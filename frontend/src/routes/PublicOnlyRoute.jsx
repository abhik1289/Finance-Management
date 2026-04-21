import { Navigate, Outlet } from "react-router-dom";

export default function PublicOnlyRoute() {
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
