import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION_NAME = "erp_instances";

/**
 * 1. Register a new ERP instance and generate a license key
 */
export async function registerInstance(clientData) {
  try {
    const randomKey = `ERP-KEY-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Calculate expiration date based on selected validity days (default 30 days)
    const validityDays = parseInt(clientData.validityDays || 30);
    const createdAt = new Date();
    const expiresAt = new Date(
      createdAt.getTime() + validityDays * 24 * 60 * 60 * 1000,
    );

    const payload = {
      client: clientData.companyName,
      clientPerson: clientData.clientName,
      domain: clientData.instanceUrl,
      plan: clientData.selectedPlan,
      validityDays: validityDays,
      status: "Active",
      cpu: "12%",
      ram: "1.8 GB / 8 GB",
      dbSize: "120 MB",
      license: randomKey,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(), // Storing expiration time
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
    return { success: true, id: docRef.id, license: randomKey, data: payload };
  } catch (error) {
    console.error("Error registering instance:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 2. Fetch all registered ERP instances for the dashboard telemetry table
 */
export async function fetchAllInstances() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const now = new Date();

    const instances = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Check if expired on-the-fly for dashboard display
      const isExpired = data.expiresAt && new Date(data.expiresAt) < now;

      return {
        id: doc.id,
        ...data,
        status: isExpired ? "Expired / Deactivated" : "Active",
      };
    });
    return { success: true, instances };
  } catch (error) {
    console.error("Error fetching instances:", error);
    return { success: false, error: error.message, instances: [] };
  }
}

/**
 * 3. Verify a license key (Used if you want an API-like query function inside React)
 */
export async function verifyLicenseKey(licenseKey) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("license", "==", licenseKey),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { valid: false, message: "Invalid or expired license key." };
    }

    const instanceDoc = querySnapshot.docs[0];
    return {
      valid: true,
      instance: { id: instanceDoc.id, ...instanceDoc.data() },
    };
  } catch (error) {
    console.error("Error verifying license:", error);
    return { valid: false, error: error.message };
  }
}
