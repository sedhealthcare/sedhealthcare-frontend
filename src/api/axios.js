import axios from "axios";

const PROD_API = "https://sedhealthcare-backend.onrender.com/api";
const LOCAL_API = "http://localhost:5001/api";

const getBaseURL = () => {
  // 1. If a build-time env var is set (Vercel sets VITE_API_URL), always use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. Running in a browser
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // Local dev machine → use local backend
    if (host === "localhost" || host === "127.0.0.1") {
      // But Capacitor also serves at localhost — detect native platform
      if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
        return PROD_API;
      }
      return LOCAL_API;
    }
  }

  // 3. Anything else (deployed web, mobile app) → production
  return PROD_API;
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
