import React from "react";
import { Navigate } from "react-router-dom";
import RolesGuard from "./RolesGuard";

interface AuthGuardProps {
  children: React.ReactNode;
  role?: string | string[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, role }) => {
  if (RolesGuard({ role })) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return <Navigate to="/404" replace />;
};

export default AuthGuard;
