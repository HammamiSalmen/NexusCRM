import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Logout() {
  useEffect(() => {
    localStorage.clear();
    toast.success("Déconnexion réussie. À bientôt !");
  }, []);

  return <Navigate to="/login" replace />;
}
