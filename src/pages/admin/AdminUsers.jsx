import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  Lock,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminUsers() {
  const { token, user: currentUser } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: 2, // 1: Super Admin, 2: Admin, 3: Editor
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Admin Users | Onecore Admin';
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setUsers(data.data);
        }
      }
    } catch (err) {
      console.warn('Could not fetch admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({ type: 'success', message: 'Admin account created successfully.' });
        setShowCreateModal(false);
        setFormData({ name: '', email: '', password: '', roleId: 2 });
        fetchUsers();
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to create account.' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const handleToggleActive = async (user) => {
    if (user.id === currentUser?.id) {
      alert('You cannot deactivate your own account.');
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !user.is_active,
        }),
      });

      if (res.ok) {
        setNotification({
          type: 'success',
          message: `User ${user.is_active ? 'deactivated' : 'activated'}.`,
        });
        fetchUsers();
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.id === currentUser?.id) {
      alert('You cannot delete your own account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete user "${user.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setNotification({ type: 'success', message: 'User account removed.' });
        fetchUsers();
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  return (
    <AdminLayout
      title="Admin Users & Roles"
      subtitle="Super Administrator Control Panel for team accounts and role permissions"
    >
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-white/60 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      <AdminCard
        title="Active Administrative Accounts"
        subtitle="Control panel accounts with access to the custom CMS"
        action={
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-colors shadow-xs"
          >
            <UserPlus size={14} />
            <span>Add New User</span>
          </button>
        }
      >
        {loading ? (
          <div className="py-12 text-center text-brand-slate/60 text-xs">
            <div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p>Loading user list from MySQL...</p>
          </div>
        ) : users.length > 0 ? (
          <AdminTable
            headers={['Administrator', 'Email', 'Role', 'Status', 'Last Login', 'Actions']}
          >
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 font-medium text-white">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-brand-navy-light border border-white/10 flex items-center justify-center text-[11px] font-mono text-white">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{u.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold border ${
                      u.role_name === 'Super Admin'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : u.role_name === 'Admin'
                        ? 'bg-brand-teal/10 text-brand-teal border-brand-teal/20'
                        : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                    }`}
                  >
                    {u.role_name}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggleActive(u)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold border flex items-center gap-1 ${
                      u.is_active
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {u.is_active ? (
                      <>
                        <CheckCircle2 size={10} />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={10} />
                        <span>Disabled</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="py-3 px-4 font-mono text-[11px]">
                  {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}
                </td>
                <td className="py-3 px-4">
                  {u.id !== currentUser?.id && (
                    <button
                      onClick={() => handleDeleteUser(u)}
                      className="p-1.5 text-brand-slate hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Delete User"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </AdminTable>
        ) : (
          <div className="py-12 text-center text-brand-slate/60 text-xs">
            <Users size={32} className="mx-auto mb-2 text-brand-slate/40" />
            <p>No admin users found.</p>
          </div>
        )}
      </AdminCard>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-brand-navy border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-brand-slate hover:text-white p-1 rounded-lg"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-brand-teal/10 text-brand-teal">
                <UserPlus size={20} />
              </div>
              <div>
                <h3 className="text-base font-medium text-white">Create Admin Account</h3>
                <p className="text-xs text-brand-slate font-light">
                  Provision new team credentials with role permissions.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sarah Chen"
                  className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., sarah@onecorepharma.com"
                  className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                  Initial Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                  Role Assignment
                </label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
                  className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-brand-teal"
                >
                  <option value={2}>Admin (Content & Enquiries Management)</option>
                  <option value={3}>Editor (Content & Media updates)</option>
                  <option value={1}>Super Admin (Full Access & User Management)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg text-xs font-medium"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
