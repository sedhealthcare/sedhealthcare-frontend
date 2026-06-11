import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import LabTests from "./pages/LabTests";
import Pharmacy from "./pages/Pharmacy";
import Account from "./pages/Account";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminLabTests from "./pages/admin/AdminLabTests";
import AdminPharmacy from "./pages/admin/AdminPharmacy";

const Routed = () => {
  const loc = useLocation();
  const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;
  const A = ({ children }) => <AdminRoute>{children}</AdminRoute>;
  const isAdmin = loc.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={loc} key={loc.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/" element={<P><Dashboard /></P>} />
          <Route path="/dashboard" element={<P><Dashboard /></P>} />
          <Route path="/doctors" element={<P><Doctors /></P>} />
          <Route path="/book/:id" element={<P><BookAppointment /></P>} />
          <Route path="/appointments" element={<P><Appointments /></P>} />
          <Route path="/lab-tests" element={<P><LabTests /></P>} />
          <Route path="/pharmacy" element={<P><Pharmacy /></P>} />
          <Route path="/account" element={<P><Account /></P>} />
          <Route path="/payment" element={<P><Payment /></P>} />

          <Route path="/admin" element={<A><AdminLayout /></A>}>
            <Route index element={<AdminDashboard />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="lab-tests" element={<AdminLabTests />} />
            <Route path="pharmacy" element={<AdminPharmacy />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routed />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
