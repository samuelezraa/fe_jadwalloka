// src/components/ProtectedPageRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedPageRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
}

const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const ProtectedPageRoute: React.FC<ProtectedPageRouteProps> = ({
  allowedRoles,
  redirectTo = '/dashboard',
}) => {
  const user = getStoredUser();
  const role = String(user?.role ?? '').trim().toUpperCase();

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map((r) => r.trim().toUpperCase());
    if (!normalizedAllowed.includes(role)) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <Outlet />;
};