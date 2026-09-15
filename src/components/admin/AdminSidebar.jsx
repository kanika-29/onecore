import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Activity,
  Package,
  Newspaper,
  Image as ImageIcon,
  Settings,
  Users,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminSidebar({ isOpen, onClose }) {
  const { user, logout, isSuperAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navGroups = [
    {
      title: 'Overview',
      links: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
        { name: 'Contact Enquiries', path: '/admin/enquiries', icon: Inbox },
      ],
    },
    {
      title: 'Content Management',
      links: [
        { name: 'Pages & Sections', path: '/admin/pages', icon: FileText },
        { name: 'Therapeutic Areas', path: '/admin/therapeutic-areas', icon: Activity },
        { name: 'Products Portfolio', path: '/admin/products', icon: Package },
        { name: 'News & Releases', path: '/admin/news', icon: Newspaper },
        { name: 'Media Library', path: '/admin/media', icon: ImageIcon },
      ],
    },
    {
      title: 'System & Security',
      links: [
        { name: 'Site Settings', path: '/admin/settings', icon: Settings },
        ...(isSuperAdmin
          ? [{ name: 'Admin Users', path: '/admin/users', icon: Users, badge: 'Super' }]
          : []),
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-brand-navy border-r border-brand-navy-light/40 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/5">
          <div className="flex flex-col">
            <img
              src="/assets/onecore-logo.png"
              alt="Onecore Pharma"
              className="h-7 w-auto object-contain brightness-0 invert opacity-95"
            />
            <span className="text-[9px] tracking-widest uppercase font-mono text-brand-teal/90 block mt-1">
              Admin Portal
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-brand-slate hover:text-white p-1 rounded-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="px-3 text-[11px] font-mono uppercase tracking-widest text-brand-slate/60 mb-2">
                {group.title}
              </h3>
              {group.links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.exact}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-brand-teal/15 text-white border-l-2 border-brand-teal font-semibold'
                          : 'text-brand-slate hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            size={16}
                            className={
                              isActive
                                ? 'text-brand-teal'
                                : 'text-brand-slate/70 group-hover:text-white transition-colors'
                            }
                          />
                          <span>{link.name}</span>
                        </div>
                        {link.badge ? (
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-brand-teal/20 text-brand-teal font-medium">
                            {link.badge}
                          </span>
                        ) : isActive ? (
                          <ChevronRight size={14} className="text-brand-teal/80" />
                        ) : null}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}

          {/* Quick link to live site */}
          <div className="pt-4 border-t border-white/5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-brand-slate/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink size={14} />
                <span>View Live Website</span>
              </div>
              <span className="text-[10px] text-brand-teal">↗</span>
            </a>
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-white/5 bg-brand-navy-dark/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-brand-navy-light border border-white/10 flex items-center justify-center text-xs font-medium text-white shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-white truncate">{user?.name || 'Administrator'}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-brand-teal font-mono">
                  <ShieldCheck size={11} />
                  <span>{user?.role_name || 'Admin'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-brand-slate hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
