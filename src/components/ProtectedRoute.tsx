import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import type { JSX } from "react";

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    toast.dismiss();
    toast("You must be logged in to access this page.", {
      icon: "ℹ",
    });
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;