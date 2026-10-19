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
  deleteDoc,
  setDoc,
} from "firebase/firestore";

const COLLECTION_NAME = "erp_instances";
const DEMO_COLLECTION = "demo_requests";

/**
 * 1. Register a new ERP instance and generate a license key
 */
export async function registerInstance(clientData) {
  try {
    const randomKey = `ERP-KEY-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const validityDays = parseInt(clientData.validityDays || 30);
    const createdAt = new Date();
    const expiresAt = new Date(
      createdAt.getTime() + validityDays * 24 * 60 * 60 * 1000,
    );

    const payload = {
      client: clientData.companyName,
      clientPerson: clientData.clientName,
      clientEmail: clientData.clientEmail || "",
      clientPhone: clientData.clientPhone || "",
      maxUsers: parseInt(clientData.maxUsers || 10),
      domain: clientData.instanceUrl,
      plan: clientData.selectedPlan,
      validityDays: validityDays,
      status: "Active",
      cpu: "12%",
      ram: "1.8 GB / 8 GB",
      dbSize: "120 MB",
      license: randomKey,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
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

/**
 * Delete an ERP instance permanently from Firestore by its document ID
 */
export async function deleteInstance(docId) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, docId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting instance:", error);
    return { success: false, error: error.message };
  }
}

export const updateInstance = async (id, updatedData) => {
  console.log("Updating ID:", id);

  if (!id) {
    console.error("Missing ID!");
    return { success: false, error: new Error("Missing ID") };
  }

  try {
    // Change "instances" to match your exact Firestore collection path if it's named differently
    const docRef = doc(db, "erp_instances", id);

    // setDoc with merge: true guarantees it updates the doc or creates it if missing
    await setDoc(docRef, updatedData, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Firestore update failed:", error);
    return { success: false, error };
  }
};

// Submit a new demo request from the landing page
export async function submitDemoRequest(formData) {
  try {
    const payload = {
      ...formData,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, DEMO_COLLECTION), payload);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting demo request:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update demo request status to "Closed" instead of deleting
 */
export async function updateDemoRequestStatus(docId, newStatus = "Closed") {
  try {
    const docRef = doc(db, "demo_requests", docId);
    await updateDoc(docRef, { status: newStatus });
    return { success: true };
  } catch (error) {
    console.error("Error updating demo request status:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch only active (non-closed) demo requests for the admin portal
 */
export async function fetchDemoRequests() {
  try {
    // Query only requests where status is not "Closed" (or where status field doesn't exist yet)
    const q = query(
      collection(db, "demo_requests"),
      where("status", "!=", "Closed"),
    );
    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, requests };
  } catch (error) {
    console.error("Error fetching demo requests:", error);
    return { success: false, error: error.message, requests: [] };
  }
}
