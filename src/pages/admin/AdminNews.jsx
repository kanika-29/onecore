import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import ToastNotification from '../../components/admin/ToastNotification';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { useAdminAuth } from '../../context/AdminAuthContext';

const SEED_NEWS = [
  {
    id: 1,
    title: 'Onecore Expands Advanced Formulation Research Facility',
    slug: 'onecore-expands-advanced-formulation-research-facility',
    category: 'Corporate Update',
    published_date: '2026-08-14',
    status: 'published',
    read_time: '4 min read',
  },
  {
    id: 2,
    title: 'New Clinical Insights in Orthopaedic Joint Integrity',
    slug: 'new-clinical-insights-orthopaedic-joint-integrity',
    category: 'Clinical Care',
    published_date: '2026-07-28',
    status: 'published',
    read_time: '6 min read',
  },
  {
    id: 3,
    title: 'Sustainable Packaging Initiative Implemented Across Production Lines',
    slug: 'sustainable-packaging-initiative-implemented',
    category: 'Sustainability',
    published_date: '2026-06-19',
    status: 'published',
    read_time: '3 min read',
  },
];

export default function AdminNews() {
  const { token } = useAdminAuth();
  const [news, setNews] = useState(SEED_NEWS);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (type, message) => setToast({ type, message });

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) setNews(data.data);
      }
    } catch (err) {
      console.warn('Using seeded news:', err);
    }
  };

  useEffect(() => {
    document.title = 'News & Press Releases | Onecore Admin';
    fetchNews();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/news/${deleteTarget}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNews((prev) => prev.filter((n) => n.id !== deleteTarget));
        showToast('success', 'Article deleted successfully.');
      } else {
        showToast('error', data.message || 'Delete failed.');
      }
    } catch {
      showToast('error', 'Network error.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout
      title="News & Press Releases"
      subtitle="Manage corporate updates, research releases, and announcements"
    >
      <AdminCard
        title="Published News & Media Articles"
        subtitle="Articles displayed on the public /news section"
        action={
          <Link
            to="/admin/news/new"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg transition-all"
          >
            <Plus size={13} />
            New Article
          </Link>
        }
      >
        <AdminTable
          headers={['Article Title', 'Category', 'Publication Date', 'Read Time', 'Status', 'Actions']}
        >
          {news.map((item) => (
            <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3 px-4 font-medium text-white max-w-sm">
                <div className="flex items-center gap-2">
                  <Newspaper size={14} className="text-brand-teal shrink-0" />
                  <span className="truncate">{item.title}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-brand-teal font-mono text-[11px]">
                {item.category}
              </td>
              <td className="py-3 px-4 font-mono text-[11px] text-brand-slate/70">
                {item.published_date || (item.published_at ? new Date(item.published_at).toLocaleDateString() : '—')}
              </td>
              <td className="py-3 px-4 text-brand-slate text-xs">
                {item.read_time || '—'}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold border ${
                    item.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/news/${item.id}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal border border-brand-teal/20 hover:border-brand-teal/40 rounded-lg transition-all"
                  >
                    <Edit2 size={12} />
                    Edit
                  </Link>
                  <a
                    href="/news"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-brand-slate/50 hover:text-brand-teal hover:bg-white/5 rounded-lg transition-colors"
                    title="View News Page"
                  >
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => setDeleteTarget(item.id)}
                    className="p-1.5 text-brand-slate/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Article"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      </AdminCard>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Article"
        message="This article will be permanently removed from the news section and cannot be recovered."
        confirmLabel="Delete Article"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        dangerous
      />

      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </AdminLayout>
  );
}
