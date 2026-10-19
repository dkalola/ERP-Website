const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();

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
