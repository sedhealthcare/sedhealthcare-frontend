import axios from "axios";

const PROD_API = "https://sedhealthcare-backend.onrender.com/api";
const LOCAL_API = "http://localhost:5001/api";

// Detect if running inside Capacitor (mobile app)
const isMobile = () => {
  if (typeof window === "undefined") return false;
  // Capacitor exposes this global
  if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) return true;
  // Fallback: check protocol/scheme
  if (window.location.protocol === "capacitor:") return true;
  if (window.location.protocol === "https:" && window.location.hostname === "localhost") return true;
  if (window.location.protocol === "http:" && window.location.hostname === "localhost" && window.location.port !== "5173" && window.location.port !== "") return true;
  return false;
};

const getBaseURL = () => {
  return isMobile() ? PROD_API : LOCAL_API;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 60000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log("[REQ]", config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log("[OK]", res.status, res.config.url);
    return res;
  },
  (err) => {
    console.error("[ERR]", err.message, err.code, err.response?.status, err.response?.data);
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
