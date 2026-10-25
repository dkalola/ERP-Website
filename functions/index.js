const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.verifyLicense = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).send({ error: "Method Not Allowed" });
  }

  const { license } = req.body;
  if (!license) {
    return res
      .status(400)
      .json({ valid: false, message: "Missing license key" });
  }

  try {
    const snapshot = await admin
      .firestore()
      .collection("erp_instances")
      .where("license", "==", license)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ valid: false, message: "License not found" });
    }

    const docData = snapshot.docs[0].data();
    const expiresAt = new Date(docData.expiresAt);
    const now = new Date();

    if (expiresAt < now) {
      return res.json({
        valid: false,
        message: "License expired",
        expiresAt: docData.expiresAt,
      });
    }

    return res.json({
      valid: true,
      client: docData.client,
      maxUsers: docData.maxUsers,
      expiresAt: docData.expiresAt,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ valid: false, error: "Internal server error" });
  }
});

exports.updateTelemetry = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  const body = req.body || {};
  const { licenseKey, timestamp, metrics } = body;

  if (
    typeof licenseKey !== "string" ||
    !licenseKey.trim() ||
    !metrics ||
    typeof metrics !== "object" ||
    Array.isArray(metrics)
  ) {
    return res.status(400).json({
      success: false,
      error: "Invalid request",
    });
  }

  try {
    const snapshot = await db
      .collection("erp_instances")
      .where("license", "==", licenseKey)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(403).json({
        success: false,
        error: "Invalid license",
      });
    }

    const doc = snapshot.docs[0];
    const instance = doc.data();

    const expiresAt =
      instance.expiresAt?.toDate instanceof Function
        ? instance.expiresAt.toDate()
        : new Date(instance.expiresAt);

    if (
      instance.status === "disabled" ||
      instance.status === "revoked" ||
      Number.isNaN(expiresAt.getTime()) ||
      expiresAt.getTime() <= Date.now()
    ) {
      return res.status(403).json({
        success: false,
        error: "License inactive or expired",
      });
    }

    // Allow only known, bounded telemetry fields.

    const allowedMetrics = Object.fromEntries(
      Object.entries({
        status: metrics.status,
        databaseStatus: metrics.databaseStatus,
        cpuUsagePercent: metrics.cpuUsagePercent,
        ramUsagePercent: metrics.ramUsagePercent,
        diskUsagePercent: metrics.diskUsagePercent,
        erpnextVersion: metrics.erpnextVersion,
        telemetryAgent: metrics.telemetryAgent,
      }).filter(([, value]) => value !== undefined),
    );

    for (const field of [
      "cpuUsagePercent",
      "ramUsagePercent",
      "diskUsagePercent",
    ]) {
      const value = allowedMetrics[field];

      if (
        value !== undefined &&
        (typeof value !== "number" ||
          !Number.isFinite(value) ||
          value < 0 ||
          value > 100)
      ) {
        return res.status(400).json({
          success: false,
          error: `Invalid ${field}`,
        });
      }
    }

    const now = admin.firestore.FieldValue.serverTimestamp();

    // Keep the latest metrics on the instance document.
    await doc.ref.set(
      {
        telemetry: {
          ...allowedMetrics,
          receivedAt: now,
        },
        lastHeartbeat: now,
      },
      { merge: true },
    );

    return res.status(200).json({
      success: true,
      licenseValid: true,
      receivedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Telemetry update failed:", error.message);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

exports.uploadBackup = onRequest(
  { timeoutSeconds: 300, memory: "1GB" },
  async (req, res) => {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ success: false, error: "Method Not Allowed" });
    }

    const bb = busboy({ headers: req.headers });
    let licenseKey = "";
    let fileHash = "";
    let uploadPath = "";
    let uploadDetails = {};

    const uploadPromise = new Promise((resolve, reject) => {
      bb.on("field", (fieldname, val) => {
        if (fieldname === "licenseKey") licenseKey = val;
        if (fieldname === "fileHash") fileHash = val;
      });

      bb.on("file", (fieldname, file, info) => {
        const { filename, mimeType } = info;
        const saveTo = path.join(os.tmpdir(), filename);
        uploadPath = saveTo;
        uploadDetails = { filename, mimeType };

        const writeStream = fs.createWriteStream(saveTo);
        file.pipe(writeStream);
      });

      bb.on("finish", async () => {
        try {
          if (!licenseKey) {
            return reject(new Error("Missing licenseKey"));
          }
          if (!uploadPath || !fs.existsSync(uploadPath)) {
            return reject(new Error("No file uploaded"));
          }

          const bucket = admin.storage().bucket();
          const destination = `${licenseKey}/${uploadDetails.filename}`;

          await bucket.upload(uploadPath, {
            destination: destination,
            metadata: {
              contentType: uploadDetails.mimeType || "application/octet-stream",
              metadata: { fileHash: fileHash },
            },
          });

          if (fs.existsSync(uploadPath)) {
            fs.unlinkSync(uploadPath);
          }
          resolve(destination);
        } catch (err) {
          reject(err);
        }
      });

      bb.on("error", (err) => {
        reject(err);
      });

      if (req.rawBody) {
        bb.end(req.rawBody);
      } else {
        req.pipe(bb);
      }
    });

    try {
      const destination = await uploadPromise;
      return res.status(200).json({ success: true, destination });
    } catch (error) {
      console.error("Upload error:", error);
      if (uploadPath && fs.existsSync(uploadPath)) {
        try {
          fs.unlinkSync(uploadPath);
        } catch (e) {}
      }
      return res.status(500).json({
        success: false,
        error: error.message,
        stack: error.stack,
      });
    }
  },
);
