import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const Protected: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useUserStore();
  if (isLoading) {
    return <span className="flex h-full items-center justify-center">Loading...</span>;
  }
  if (user == null) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>;
};

export default Protected;