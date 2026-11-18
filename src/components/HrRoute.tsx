import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const HrRoute: React.FC = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Cek apakah user memiliki role HR atau department HR
  const isHr = user?.role === 'HR' || user?.department === 'HR' || user?.is_hr === true;

  return isHr ? <Outlet /> : <Navigate to="/dashboard" replace />;
};