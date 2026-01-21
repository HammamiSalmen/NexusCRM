import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?.is_superuser) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
