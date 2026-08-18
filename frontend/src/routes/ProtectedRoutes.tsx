import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import AuthContext from "../context/AuthContext";

interface ProtectedRouteProps {
  role?: "admin" | "tenant";
}

const ProtectedRoutes = ({ role }: ProtectedRouteProps) => {
  const { user } = useContext(AuthContext)!;

  console.log(user?.role)

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;