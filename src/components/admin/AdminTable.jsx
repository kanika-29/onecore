import React from 'react';

export default function AdminTable({ headers, children, emptyMessage = 'No records found.' }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/5 bg-brand-navy-dark/30">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="py-3 px-4 text-[11px] font-mono uppercase tracking-wider text-brand-slate font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-xs text-brand-slate font-light">
          {children}
        </tbody>
      </table>
    </div>
  );
}
