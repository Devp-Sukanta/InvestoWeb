import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassord";
import Profile from "../pages/Profile";
import AdminLogin from "../pages/AdminLogin";
import AdminProRoute from "./AdminProRoute";
import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../components/AdminDashboard";
import Users from "../pages/Users";
import AdminInvestments from "../pages/AdminInvestments";
import AdminLedger from "../pages/AdminLedger";
import AdminReports from "../pages/AdminReports";

function AllRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<AdminProRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="investments" element={<AdminInvestments />} />
          <Route path="ledger/roi" element={<AdminLedger />} />
          <Route path="ledger/referrals" element={<AdminLedger />} />
          <Route path="reports" element={<AdminReports />} />
          {/* Ready for additional sub-routes: investments, ledger, reports */}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AllRoutes;
