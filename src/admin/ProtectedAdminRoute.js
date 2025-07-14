// src/admin/ProtectedAdminRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from './adminAuthContext';

function ProtectedAdminRoute() {
  const { adminUser, loading } = useAdminAuth();

  if (loading) return <div>Loading...</div>;

  return adminUser ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default ProtectedAdminRoute;
 