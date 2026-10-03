import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface GateGuardProps {
  children: React.ReactNode;
}

export const GateGuard: React.FC<GateGuardProps> = ({ children }) => {
  const location = useLocation();
  const hasPassedGate = sessionStorage.getItem('qraft:gate_passed') === 'true';

  if (!hasPassedGate) {
    // Retain target route after gate pass if needed
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
