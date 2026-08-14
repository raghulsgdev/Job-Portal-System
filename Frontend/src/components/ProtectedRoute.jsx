import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRole }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        color: 'var(--primary)',
        fontWeight: '700',
        fontSize: '18px'
      }}>
        Loading Job Portal...
      </div>
    );
  }

  if (!role) {
    return <Navigate to={allowedRole === 'hr' ? '/hr/login' : '/user/login'} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'hr' ? '/hr/dashboard' : '/user/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
