import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';

/**
 * ToastNotification — lightweight contextless toast.
 * Usage: <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
 * toast = { type: 'success'|'error'|'warning', message: string }
 */
export default function ToastNotification({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const styles = {
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      text: 'text-emerald-300',
      icon: <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />,
    },
    error: {
      bg: 'bg-red-500/10 border-red-500/30',
      text: 'text-red-300',
      icon: <XCircle size={16} className="text-red-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-amber-300',
      icon: <AlertTriangle size={16} className="text-amber-400 shrink-0" />,
    },
  };

  const s = styles[toast.type] || styles.success;

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-fade-in-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm text-sm ${s.bg} ${s.text}`}
      >
        {s.icon}
        <span className="flex-1 font-light">{toast.message}</span>
        <button
          onClick={onDismiss}
          className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
