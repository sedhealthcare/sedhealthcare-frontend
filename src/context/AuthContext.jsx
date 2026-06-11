import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem("user");
    const r = localStorage.getItem("role");
    if (u) { setUser(JSON.parse(u)); setRole(r); }
    setLoading(false);
  }, []);

  const sendOtp = async (mobile) => (await api.post("/auth/send-otp", { mobile })).data;

  const verifyOtp = async (mobile, otp, isAdmin = false) => {
    const endpoint = isAdmin ? "/auth/admin-login" : "/auth/verify-otp";
    const { data } = await api.post(endpoint, { mobile, otp });
    const userRole = isAdmin ? "admin" : "user";
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("role", userRole);
    setUser(data.user);
    setRole(userRole);
    return data;
  };

  const logout = () => { localStorage.clear(); setUser(null); setRole(null); };
  const updateUser = (u) => { setUser(u); localStorage.setItem("user", JSON.stringify(u)); };

  return (
    <AuthContext.Provider value={{ user, role, loading, sendOtp, verifyOtp, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
