import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Verifying admin authorization...</p>
      </div>
    );
  }

  // Not signed in -> redirect to login preserving intended target
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Signed in but not an authorized admin
  if (!isAdmin) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', borderColor: 'var(--danger-color)' }}>
          <h2 style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>403 - Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You are signed in as <strong>{user.email}</strong>, but your account does not possess administrator privileges.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/" className="btn btn-outline">Back to Home</Link>
            <Link to="/login" className="btn btn-primary">Switch Account</Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized admin
  return <Outlet />;
}
