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
  Mail,
  Phone,
  Building,
  User,
  AlertCircle,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import ToastNotification from '../../components/admin/ToastNotification';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminEnquiries() {
  const { token, isSuperAdmin } = useAdminAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [currentStatus, setCurrentStatus] = useState('new');
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (type, message) => setToast({ type, message });

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all' ? '/api/admin/enquiries' : `/api/admin/enquiries?status=${statusFilter}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          const list = Array.isArray(data.data) ? data.data : (data.data.enquiries || []);
          setEnquiries(list);
        }
      }
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Contact Enquiries | Onecore Admin';
    fetchEnquiries();
  }, [token, statusFilter]);

  const handleOpenDetail = (item) => {
    setSelectedEnquiry(item);
    setCurrentStatus(item.status || 'new');
    setAdminNotes(item.admin_notes || '');
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
          adminNotes: adminNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Enquiry updated successfully.');
        setSelectedEnquiry((prev) => ({ ...prev, status: currentStatus, admin_notes: adminNotes }));
        fetchEnquiries();
      } else {
        showToast('error', data.message || 'Update failed.');
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${deleteTarget}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Enquiry deleted.');
        setEnquiries((prev) => prev.filter((e) => e.id !== deleteTarget));
        if (selectedEnquiry?.id === deleteTarget) setSelectedEnquiry(null);
      } else {
        showToast('error', data.message || 'Delete failed.');
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = enquiries.filter((e) => {
    const q = search.toLowerCase();
    return (
      (e.full_name || '').toLowerCase().includes(q) ||
      (e.email || '').toLowerCase().includes(q) ||
      (e.phone || '').toLowerCase().includes(q) ||
      (e.organisation || '').toLowerCase().includes(q) ||
      (e.contacting_as || '').toLowerCase().includes(q) ||
      (e.enquiry_type || '').toLowerCase().includes(q) ||
      (e.message || '').toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            New
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            Resolved
          </span>
        );
      case 'archived':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <AdminLayout
      title="Contact Enquiries"
      subtitle="Review and manage incoming commercial enquiries, distributor requests, and medical communications"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table Column (2 cols) */}
        <div className="lg:col-span-2">
          <AdminCard
            title={`Enquiries (${filtered.length})`}
            subtitle="Public contact messages stored securely in MySQL"
            action={
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, email, org..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0D5C75] focus:ring-1 focus:ring-[#0D5C75]"
                  />
                  <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0D5C75] focus:ring-1 focus:ring-[#0D5C75]"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            }
          >
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Loading contact enquiries...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Inbox size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-700">No enquiries found.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enquiries submitted on the website contact page will appear here.
                </p>
              </div>
            ) : (
              <AdminTable
                headers={['Contact', 'Category', 'Date', 'Status', 'Actions']}
              >
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    className={`cursor-pointer transition-colors ${
                      selectedEnquiry?.id === item.id ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.full_name}</div>
                      <div className="text-[11px] text-slate-500">{item.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium text-xs">
                      {item.enquiry_type || item.nature_of_enquiry || 'General'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {new Date(item.submitted_at || item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="px-2.5 py-1 text-xs font-semibold bg-[#1B365D] text-white rounded-md"
                        >
                          View
                        </button>
                        {isSuperAdmin && (
                          <button
                            onClick={() => setDeleteTarget(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </AdminTable>
            )}
          </AdminCard>
        </div>

        {/* Selected Enquiry Detail Panel (1 col) */}
        <div>
          {selectedEnquiry ? (
            <AdminCard
              title="Enquiry Details"
              subtitle={`Ref #${selectedEnquiry.id} • ${new Date(selectedEnquiry.submitted_at || selectedEnquiry.created_at).toLocaleString()}`}
              action={
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded"
                >
                  <X size={16} />
                </button>
              }
            >
              <div className="space-y-4">
                {/* Sender card */}
                <div className="p-3.5 bg-[#FAFAFC] border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-[#0D5C75]" />
                    <span className="text-xs font-bold text-slate-900">{selectedEnquiry.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail size={13} className="text-slate-400" />
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-[#0D5C75] hover:underline">
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  {selectedEnquiry.phone && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Phone size={13} className="text-slate-400" />
                      <a href={`tel:${selectedEnquiry.phone}`} className="text-slate-800">
                        {selectedEnquiry.phone}
                      </a>
                    </div>
                  )}
                  {selectedEnquiry.organisation && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Building size={13} className="text-slate-400" />
                      <span>{selectedEnquiry.organisation}</span>
                    </div>
                  )}
                </div>

                {/* Profile & Type */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Contact Profile</span>
                    <span className="font-semibold text-slate-800">{selectedEnquiry.contacting_as || selectedEnquiry.contact_type || '—'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Category</span>
                    <span className="font-semibold text-slate-800">{selectedEnquiry.enquiry_type || selectedEnquiry.nature_of_enquiry || '—'}</span>
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
                    Message Content
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                    {selectedEnquiry.message}
                  </div>
                </div>

                {/* Status & Notes Form */}
                <form onSubmit={handleUpdateStatus} className="space-y-3 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-medium mb-1">
                      Update Status
                    </label>
                    <select
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0D5C75] focus:ring-1 focus:ring-[#0D5C75]"
                    >
                      <option value="new">New (Unread)</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-medium mb-1">
                      Internal Admin Notes
                    </label>
                    <textarea
                      rows={3}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add follow-up notes, assigned representative, or resolution details..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0D5C75] focus:ring-1 focus:ring-[#0D5C75] resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full py-2 px-4 bg-[#1B365D] hover:bg-[#152a48] text-white rounded-lg text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
                  >
                    {updating ? 'Saving Notes...' : 'Save Enquiry Status & Notes'}
                  </button>
                </form>
              </div>
            </AdminCard>
          ) : (
            <AdminCard title="Enquiry Overview">
              <div className="py-12 text-center text-slate-400 text-xs">
                <Inbox size={28} className="mx-auto mb-2 text-slate-300" />
                <p>Select any enquiry from the list to review details and record internal notes.</p>
              </div>
            </AdminCard>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Enquiry"
        message="This enquiry record will be permanently deleted from MySQL."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        dangerous
      />

      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </AdminLayout>
  );
}
