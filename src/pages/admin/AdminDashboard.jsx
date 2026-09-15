import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Package,
  Newspaper,
  Inbox,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard, AdminStatCard } from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminDashboard() {
  const { user, token } = useAdminAuth();
  const [stats, setStats] = useState({
    totalTherapeuticAreas: 9,
    totalProducts: 1,
    publishedNews: 3,
    totalEnquiries: 0,
    newEnquiries: 0,
    recentEnquiries: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard | Onecore Admin Portal';

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            const s = data.data.stats || {};
            setStats({
              totalTherapeuticAreas: s.therapeuticAreas ?? 9,
              totalProducts: s.products ?? 1,
              publishedNews: s.publishedNews ?? 3,
              totalEnquiries: s.totalEnquiries ?? 0,
              newEnquiries: s.newEnquiries ?? 0,
              recentEnquiries: data.data.recentEnquiries || [],
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch live dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token]);

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
      title="System Overview"
      subtitle="Onecore Pharma Custom CMS & Portal Management"
    >
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-navy-dark to-brand-navy p-6 rounded-2xl border border-white/10 relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-teal">
                Authorized Session
              </span>
              <span className="text-brand-slate/40">•</span>
              <span className="text-xs font-mono text-brand-slate">
                {user?.role_name || 'Admin'}
              </span>
            </div>
            <h2 className="font-editorial text-2xl text-white">
              Welcome back, {user?.name || 'Administrator'}
            </h2>
            <p className="text-xs text-brand-slate/80 font-light mt-1 max-w-xl">
              Manage website content, review incoming commercial and product enquiries, and maintain therapeutic areas and product specifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/enquiries"
              className="px-4 py-2.5 bg-brand-teal text-white rounded-lg text-xs font-medium hover:bg-brand-teal/90 transition-colors shadow-sm flex items-center gap-2"
            >
              <Inbox size={14} />
              <span>View Enquiries</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <span>Live Site</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          title="New Enquiries"
          value={stats.newEnquiries || 0}
          change={stats.totalEnquiries ? `${stats.totalEnquiries} total received` : 'No unread messages'}
          icon={Inbox}
          color="emerald"
        />
        <AdminStatCard
          title="Therapeutic Areas"
          value={stats.totalTherapeuticAreas || 9}
          change="9 active specialities"
          icon={Activity}
          color="teal"
        />
        <AdminStatCard
          title="Products Portfolio"
          value={stats.totalProducts || 1}
          change="OneFLEXO & catalog"
          icon={Package}
          color="blue"
        />
        <AdminStatCard
          title="News Articles"
          value={stats.publishedNews || 3}
          change="Editorial press releases"
          icon={Newspaper}
          color="purple"
        />
      </div>

      {/* Main Grid: Recent Enquiries + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries (2 cols) */}
        <div className="lg:col-span-2">
          <AdminCard
            title="Recent Contact Enquiries"
            subtitle="Latest submissions received from the public Contact page"
            action={
              <Link
                to="/admin/enquiries"
                className="text-xs text-brand-teal hover:underline flex items-center gap-1 font-medium"
              >
                <span>View all</span>
                <ArrowRight size={12} />
              </Link>
            }
          >
            {stats.recentEnquiries && stats.recentEnquiries.length > 0 ? (
              <AdminTable
                headers={['Contact', 'Category', 'Date', 'Status', 'Action']}
              >
                {stats.recentEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{enquiry.full_name}</div>
                      <div className="text-[11px] text-brand-slate/70">{enquiry.email}</div>
                    </td>
                    <td className="py-3 px-4 text-white">
                      {enquiry.nature_of_enquiry || enquiry.subject_category || 'General'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(enquiry.status)}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to="/admin/enquiries"
                        className="text-brand-teal hover:underline font-medium text-xs"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </AdminTable>
            ) : (
              <div className="py-12 text-center text-brand-slate/60 text-xs font-light">
                <Inbox size={32} className="mx-auto mb-2 text-brand-slate/40" />
                <p>No contact enquiries recorded yet.</p>
                <p className="text-[11px] text-brand-slate/40 mt-1">
                  Public submissions from the Contact Us form will appear here.
                </p>
              </div>
            )}
          </AdminCard>
        </div>

        {/* Quick Management Shortcuts (1 col) */}
        <div className="space-y-6">
          <AdminCard
            title="Quick Management"
            subtitle="Jump directly to core sections"
          >
            <div className="space-y-2.5">
              <Link
                to="/admin/pages"
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-brand-teal/10 text-brand-teal">
                    <Package size={16} />
                  </div>
                  <div>
                    <span className="font-medium text-white block">Pages & Sections</span>
                    <span className="text-[11px] text-brand-slate/70">Edit website copy & hero text</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-brand-slate group-hover:text-brand-teal group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/admin/therapeutic-areas"
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-sky-500/10 text-sky-400">
                    <Activity size={16} />
                  </div>
                  <div>
                    <span className="font-medium text-white block">Therapeutic Areas</span>
                    <span className="text-[11px] text-brand-slate/70">9 clinical specialities</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-brand-slate group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/admin/products"
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                    <Package size={16} />
                  </div>
                  <div>
                    <span className="font-medium text-white block">Product Portfolio</span>
                    <span className="text-[11px] text-brand-slate/70">OneFLEXO & dosage details</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-brand-slate group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/admin/settings"
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-amber-500/10 text-amber-400">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <span className="font-medium text-white block">Site Settings</span>
                    <span className="text-[11px] text-brand-slate/70">Contact emails, phones, address</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-brand-slate group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </AdminCard>

          {/* MySQL Database Architecture Note */}
          <div className="p-5 rounded-xl border border-white/10 bg-brand-navy/60 backdrop-blur-xs">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-brand-teal">
              <ShieldCheck size={14} />
              <span>Database Architecture</span>
            </div>
            <p className="text-xs text-brand-slate font-light leading-relaxed">
              Powered strictly by a normalized <strong className="text-white">MySQL 8.x</strong> relational database using parameterized queries, salted bcrypt hashes, and JWT-authenticated endpoints.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
