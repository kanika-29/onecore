import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmModal — shows a blocking confirmation before destructive actions.
 * Usage:
 *   <ConfirmModal
 *     isOpen={showConfirm}
 *     title="Delete Section"
 *     message="This action cannot be undone."
 *     confirmLabel="Delete"
 *     onConfirm={handleDelete}
 *     onCancel={() => setShowConfirm(false)}
 *     dangerous
 *   />
 */
export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  dangerous = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-brand-navy border border-brand-navy-light/50 rounded-2xl shadow-2xl p-6 space-y-5">
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-brand-slate hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            className={`p-2.5 rounded-lg shrink-0 ${
              dangerous
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base">{title}</h3>
            <p className="text-brand-slate/80 text-sm mt-1 font-light">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-brand-slate hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              dangerous
                ? 'bg-red-600 hover:bg-red-500 text-white border border-red-500'
                : 'bg-brand-teal hover:bg-brand-teal/90 text-brand-navy border border-brand-teal'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
