import React from 'react';

export function AdminCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`bg-brand-navy border border-brand-navy-light/40 rounded-xl p-6 shadow-sm ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-5 border-b border-white/5 pb-4">
          <div>
            {title && <h3 className="text-base font-medium text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-brand-slate/70 font-light mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function AdminStatCard({ title, value, change, icon: Icon, color = 'teal' }) {
  const colorMap = {
    teal: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    blue: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className="bg-brand-navy border border-brand-navy-light/40 rounded-xl p-5 flex items-start justify-between shadow-sm">
      <div className="space-y-1">
        <span className="text-xs font-mono uppercase tracking-wider text-brand-slate/80 block">
          {title}
        </span>
        <div className="text-2xl font-editorial text-white tracking-tight">
          {value}
        </div>
        {change && (
          <span className="text-[11px] text-brand-slate/70 block">
            {change}
          </span>
        )}
      </div>
      {Icon && (
        <div className={`p-3 rounded-lg border ${colorMap[color] || colorMap.teal}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}
