import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {
  canAccessHrManagement,
  getDefaultHomeRoute,
  getStoredUser,
} from '@/utils/departmentAccess';

export const HrRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return canAccessHrManagement(user) ? (
    <Outlet />
  ) : (
    <Navigate to={getDefaultHomeRoute(user)} replace />
  );
};