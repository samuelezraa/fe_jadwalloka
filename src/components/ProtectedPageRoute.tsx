import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {
  canAccessAdminPages,
  getDefaultHomeRoute,
  getStoredUser,
} from '@/utils/departmentAccess';

interface ProtectedPageRouteProps {
  requireAdminDepartment?: boolean;
  redirectTo?: string;
}

export const ProtectedPageRoute: React.FC<ProtectedPageRouteProps> = ({
  requireAdminDepartment = true,
  redirectTo,
}) => {
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdminDepartment && !canAccessAdminPages(user)) {
    return <Navigate to={redirectTo || getDefaultHomeRoute(user)} replace />;
  }

  return <Outlet />;
};