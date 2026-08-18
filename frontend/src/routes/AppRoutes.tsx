import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/AdminDashboard";
import TenantDashboard from "../pages/tenants/TenantDashboard";

import AdminLayout from "../components/AdminLayout";
import TenantLayout from "../components/TenantLayout";

import ProtectedRoutes from "./ProtectedRoutes";
import Profile from "../pages/Profile";
import PgManagement from "../pages/admin/PgManagement";
import RoomManagement from "../pages/admin/RoomManagement";
import TenantManagement from "../pages/admin/TenantManagement";
import PaymentManagement from "../pages/admin/PaymentManagement";
import ComplaintManagement from "../pages/admin/ComplaintManagement";
import AnnouncementManagement from "../pages/admin/AnnouncementManagement";
import TenantRoom from "../pages/tenants/TenantRoom";
import TenantPayment from "../pages/tenants/TenantPayment";
import TenantComplaint from "../pages/tenants/TenantComplaint";
import TenantAnnouncement from "../pages/tenants/TenantAnnouncement";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoutes role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/pg" element={<PgManagement />} />
          <Route path="/admin/rooms" element={<RoomManagement />} />
          <Route path="/admin/tenants" element={<TenantManagement />} />
          <Route path="/admin/payments" element={<PaymentManagement />} />
          <Route path="/admin/complaints" element={<ComplaintManagement />} />
          <Route path="/admin/announcements" element={<AnnouncementManagement />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoutes role="tenant" />}>
        <Route element={<TenantLayout />}>
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
          <Route path="/tenant/room" element={<TenantRoom />} />
          <Route path="/tenant/payments" element={<TenantPayment />} />
          <Route path="/tenant/complaints" element={<TenantComplaint />} />
          <Route path="/tenant/announcements" element={<TenantAnnouncement />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoutes />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
