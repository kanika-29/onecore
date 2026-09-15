import React, { useState, useEffect } from 'react';
import { Menu, Database, Shield, Bell } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminHeader({ title, subtitle, onToggleSidebar }) {
  const { user } = useAdminAuth();
  const [dbStatus, setDbStatus] = useState('checking'); // 'connected', 'offline', 'checking'

  useEffect(() => {
    const checkDb = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          setDbStatus('connected');
        } else {
          setDbStatus('offline');
        }
      } catch {
        setDbStatus('offline');
      }
    };
    checkDb();
  }, []);

  return (
    <header className="h-20 bg-brand-navy border-b border-brand-navy-light/40 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-brand-slate hover:text-white rounded-lg hover:bg-white/5"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-lg font-medium text-white tracking-tight">
            {title || 'Dashboard'}
          </h1>
          {subtitle && (
            <p className="text-xs text-brand-slate/70 font-light mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* MySQL Database Status Indicator */}
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
            dbStatus === 'connected'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : dbStatus === 'checking'
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
          title={
            dbStatus === 'connected'
              ? 'MySQL Database Active & Connected'
              : 'MySQL Connection Status'
          }
        >
          <Database size={13} className="shrink-0" />
          <span className="capitalize">MySQL: {dbStatus === 'connected' ? 'Connected' : dbStatus}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              dbStatus === 'connected'
                ? 'bg-emerald-400 animate-pulse'
                : dbStatus === 'checking'
                ? 'bg-amber-400'
                : 'bg-red-400'
            }`}
          />
        </div>

        {/* Current User Role Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-brand-slate font-medium">
          <Shield size={13} className="text-brand-teal" />
          <span className="hidden sm:inline">{user?.name}</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-brand-teal/20 text-brand-teal">
            {user?.role_name}
          </span>
        </div>
      </div>
    </header>
  );
}
