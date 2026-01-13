import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function Logout() {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return <Navigate to="/login" replace />;
}
