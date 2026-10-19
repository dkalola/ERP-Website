import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const CACHE_KEY = "nexus_erp_live_stats";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function fetchCachedLiveStats() {
  const cachedData = sessionStorage.getItem(CACHE_KEY);
  const cachedTime = sessionStorage.getItem(`${CACHE_KEY}_time`);

  // Return cached data if valid
  if (
    cachedData &&
    cachedTime &&
    Date.now() - parseInt(cachedTime, 10) < CACHE_DURATION
  ) {
    return JSON.parse(cachedData);
  }

  try {
    const demoSnap = await getDocs(collection(db, "demo_requests"));
    const inquiriesCount = demoSnap.docs.filter((doc) => {
      const status = doc.data().status;
      return !status || status.toLowerCase() !== "closed";
    }).length;

    const instancesSnap = await getDocs(collection(db, "erp_instances"));
    const licensesCount = instancesSnap.docs.filter((doc) => {
      const status = doc.data().status;
      return status && status.toLowerCase() === "active";
    }).length;

    const stats = {
      activeInquiries: inquiriesCount,
      runningLicenses: licensesCount,
    };

    // Save to sessionStorage
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(stats));
    sessionStorage.setItem(`${CACHE_KEY}_time`, Date.now().toString());

    return stats;
  } catch (err) {
    console.error("Error fetching live metrics:", err);
    return { activeInquiries: 0, runningLicenses: 0 };
  }
}
