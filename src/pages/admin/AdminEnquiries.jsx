import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  Send,
  Building,
  Mail,
  Phone,
  User,
  AlertCircle,
  FileText,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminEnquiries() {
  const { token, isSuperAdmin, isAdmin } = useAdminAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [currentStatus, setCurrentStatus] = useState('new');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    document.title = 'Contact Enquiries | Onecore Admin';
    fetchEnquiries();
  }, [token, statusFilter]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const url =
        statusFilter === 'all'
          ? '/api/admin/enquiries'
          : `/api/admin/enquiries?status=${statusFilter}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setEnquiries(data.data);
        }
      }
    } catch (err) {
      console.warn('Error loading enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setCurrentStatus(enquiry.status);
    setAdminNotes(enquiry.admin_notes || '');
  };

  const handleCloseDetail = () => {
    setSelectedEnquiry(null);
    setAdminNotes('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: currentStatus,
          admin_notes: adminNotes,
        }),
      });

      if (res.ok) {
        setNotification({ type: 'success', message: 'Enquiry updated successfully.' });
        fetchEnquiries();
        setSelectedEnquiry((prev) => ({
          ...prev,
          status: currentStatus,
          admin_notes: adminNotes,
        }));
      } else {
        setNotification({ type: 'error', message: 'Failed to update enquiry.' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setUpdating(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry record?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setNotification({ type: 'success', message: 'Enquiry deleted.' });
        if (selectedEnquiry?.id === id) {
          handleCloseDetail();
        }
        fetchEnquiries();
      } else {
        setNotification({ type: 'error', message: 'Failed to delete enquiry.' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      (item.full_name && item.full_name.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.organisation && item.organisation.toLowerCase().includes(q)) ||
      (item.nature_of_enquiry && item.nature_of_enquiry.toLowerCase().includes(q)) ||
      (item.message && item.message.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            New
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Resolved
          </span>
        );
      case 'archived':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-white/5 text-brand-slate border border-white/10">
            Archived
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-white/5 text-brand-slate border border-white/10">
            {status}
          </span>
        );
    }
  };

  return (
    <AdminLayout
      title="Contact Enquiries"
      subtitle="Review and process incoming enquiries from the public Contact page"
    >
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between transition-all ${
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-navy border border-brand-navy-light/40 p-4 rounded-xl">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['all', 'new', 'in_progress', 'resolved', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-brand-teal text-white'
                  : 'text-brand-slate hover:text-white hover:bg-white/5'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enquiries..."
            className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-1.5 pl-9 text-xs text-white placeholder-brand-slate/40 focus:outline-hidden focus:border-brand-teal"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-brand-slate/50" />
        </div>
      </div>

      {/* Enquiries Table */}
      <AdminCard>
        {loading ? (
          <div className="py-16 text-center text-brand-slate/60 text-xs">
            <div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p>Loading enquiries from database...</p>
          </div>
        ) : filteredEnquiries.length > 0 ? (
          <AdminTable
            headers={['Contact', 'Organisation', 'Role / Category', 'Date', 'Status', 'Actions']}
          >
            {filteredEnquiries.map((enquiry) => (
              <tr
                key={enquiry.id}
                className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => handleOpenDetail(enquiry)}
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-white">{enquiry.full_name}</div>
                  <div className="text-[11px] text-brand-slate/70">{enquiry.email}</div>
                </td>
                <td className="py-3 px-4 text-white">
                  {enquiry.organisation || '—'}
                </td>
                <td className="py-3 px-4">
                  <div className="text-white">{enquiry.nature_of_enquiry || enquiry.subject_category}</div>
                  <div className="text-[11px] text-brand-teal font-mono">{enquiry.contact_type}</div>
                </td>
                <td className="py-3 px-4 font-mono text-[11px]">
                  {new Date(enquiry.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(enquiry.status)}
                </td>
                <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDetail(enquiry)}
                      className="p-1.5 text-brand-slate hover:text-white hover:bg-white/5 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    {(isSuperAdmin || isAdmin) && (
                      <button
                        onClick={() => handleDelete(enquiry.id)}
                        className="p-1.5 text-brand-slate hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete Enquiry"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        ) : (
          <div className="py-16 text-center text-brand-slate/60 text-xs">
            <Inbox size={32} className="mx-auto mb-2 text-brand-slate/40" />
            <p>No enquiries found matching your filter.</p>
          </div>
        )}
      </AdminCard>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-brand-navy border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 lg:p-8 relative">
            <button
              onClick={handleCloseDetail}
              className="absolute top-6 right-6 text-brand-slate hover:text-white p-1 rounded-lg hover:bg-white/5"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-brand-teal/10 text-brand-teal">
                <FileText size={20} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-brand-teal">
                  Enquiry #{selectedEnquiry.id}
                </span>
                <h3 className="text-lg font-medium text-white">
                  {selectedEnquiry.nature_of_enquiry || selectedEnquiry.subject_category || 'General Enquiry'}
                </h3>
              </div>
            </div>

            {/* Submitter Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-navy-dark/50 border border-white/5 rounded-xl p-4 mb-6 text-xs">
              <div className="flex items-center gap-2">
                <User size={14} className="text-brand-slate/60" />
                <span className="text-brand-slate">Name:</span>
                <span className="text-white font-medium">{selectedEnquiry.full_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-brand-slate/60" />
                <span className="text-brand-slate">Email:</span>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="text-brand-teal hover:underline"
                >
                  {selectedEnquiry.email}
                </a>
              </div>
              {selectedEnquiry.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-brand-slate/60" />
                  <span className="text-brand-slate">Phone:</span>
                  <span className="text-white">{selectedEnquiry.phone}</span>
                </div>
              )}
              {selectedEnquiry.organisation && (
                <div className="flex items-center gap-2">
                  <Building size={14} className="text-brand-slate/60" />
                  <span className="text-brand-slate">Organisation:</span>
                  <span className="text-white">{selectedEnquiry.organisation}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-brand-slate/60" />
                <span className="text-brand-slate">Submitted:</span>
                <span className="font-mono text-white">
                  {new Date(selectedEnquiry.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-slate">Contact Role:</span>
                <span className="text-brand-teal font-mono">{selectedEnquiry.contact_type}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-brand-slate mb-2">
                Message Content
              </h4>
              <div className="bg-brand-navy-dark/70 border border-white/10 rounded-xl p-4 text-xs text-white leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Status & Notes Management */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1.5">
                    Update Status
                  </label>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-brand-teal"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1.5">
                    Internal Admin Notes
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g., Forwarded to Commercial Team"
                    className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/40 focus:outline-hidden focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {(isSuperAdmin || isAdmin) && (
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedEnquiry.id)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    <span>Delete Enquiry</span>
                  </button>
                )}

                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={handleCloseDetail}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg text-xs font-medium flex items-center gap-2"
                  >
                    {updating ? 'Saving...' : 'Save Status & Notes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
