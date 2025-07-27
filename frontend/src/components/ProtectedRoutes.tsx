import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token =
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("user") || "{}")?.token;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
