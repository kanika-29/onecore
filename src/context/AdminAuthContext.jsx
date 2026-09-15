import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('onecore_admin_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('onecore_admin_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Validate token against /api/auth/me on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setUser(data.data);
            localStorage.setItem('onecore_admin_user', JSON.stringify(data.data));
          } else {
            logout();
          }
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.warn('Backend offline or verification error:', err);
        // If offline and we have saved user, keep state to allow previewing UI
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem('onecore_admin_token', data.data.token);
      localStorage.setItem('onecore_admin_user', JSON.stringify(data.data.user));
      return { success: true, user: data.data.user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('onecore_admin_token');
    localStorage.removeItem('onecore_admin_user');
  };

  const hasRole = (allowedRoles) => {
    if (!user || !user.role_name) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role_name);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        hasRole,
        isSuperAdmin: user?.role_name === 'Super Admin',
        isAdmin: user?.role_name === 'Admin' || user?.role_name === 'Super Admin',
        isEditor: Boolean(user),
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
