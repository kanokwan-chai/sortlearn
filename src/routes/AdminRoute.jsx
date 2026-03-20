import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.email !== "kanokwanmail2547@gmail.com") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}