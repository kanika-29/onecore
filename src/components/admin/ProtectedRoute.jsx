import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, loading, hasRole } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-brand-slate text-sm font-light tracking-wide">
            Authenticating Onecore Portal...
          </p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center p-6">
        <div className="bg-brand-navy-light border border-red-500/30 rounded-xl p-8 max-w-md text-center">
          <h2 className="text-xl font-medium text-white mb-2">Access Denied</h2>
          <p className="text-brand-slate text-sm mb-6 font-light">
            Your account ({user.role_name}) does not have permission to view this section.
          </p>
          <a
            href="/admin"
            className="inline-block px-5 py-2.5 bg-brand-teal text-white rounded text-sm font-medium hover:bg-brand-teal/90 transition-colors"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}
