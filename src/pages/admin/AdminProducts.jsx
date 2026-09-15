import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import ToastNotification from '../../components/admin/ToastNotification';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { useAdminAuth } from '../../context/AdminAuthContext';

const SEED_PRODUCTS = [
  {
    id: 1,
    brand_name: 'OneFLEXO',
    slug: 'oneflexo',
    therapeutic_area_name: 'Orthopaedics',
    therapeutic_area_slug: 'orthopaedics',
    tagline: 'Targeted joint cartilage preservation & mobility restoration.',
    dosage_form: 'Oral Capsule & Sachet Formulations',
    status: 'published',
    composition_summary: 'Bioactive collagen peptides, Type II un-denatured collagen, Sodium hyaluronate',
    updated_at: new Date().toISOString(),
  },
];

export default function AdminProducts() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (type, message) => setToast({ type, message });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) setProducts(data.data);
      }
    } catch (err) {
      console.warn('Using seeded products:', err);
    }
  };

  useEffect(() => {
    document.title = 'Product Portfolio | Onecore Admin';
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/products/${deleteTarget}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget));
        showToast('success', 'Product deleted successfully.');
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
      title="Product Portfolio"
      subtitle="Pharmaceutical formulations, active compositions, and clinical specifications"
    >
      <AdminCard
        title="Active Pharmaceutical Portfolio"
        subtitle="Catalogue of approved product specifications"
        action={
          <Link
            to="/admin/products/new"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg transition-all"
          >
            <Plus size={13} />
            New Product
          </Link>
        }
      >
        <AdminTable
          headers={['Product Name', 'Therapeutic Area', 'Dosage Form', 'Active Composition', 'Status', 'Actions']}
        >
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3 px-4 font-medium text-white">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-brand-teal/10 text-brand-teal">
                    <Package size={14} />
                  </div>
                  <span>{p.brand_name || p.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-white text-xs">
                {p.therapeutic_area_name || 'Orthopaedics'}
              </td>
              <td className="py-3 px-4 text-brand-slate text-xs">
                {p.dosage_form || '—'}
              </td>
              <td className="py-3 px-4 text-brand-slate/80 text-xs max-w-xs truncate">
                {p.composition_summary || '—'}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold border ${
                    p.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {p.status || 'Active'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/products/${p.id}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal border border-brand-teal/20 hover:border-brand-teal/40 rounded-lg transition-all"
                  >
                    <Edit2 size={12} />
                    Edit
                  </Link>
                  <a
                    href={`/areas-of-care/${p.therapeutic_area_slug || 'orthopaedics'}/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-brand-slate/50 hover:text-brand-teal hover:bg-white/5 rounded-lg transition-colors"
                    title="View Live Product"
                  >
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => setDeleteTarget(p.id)}
                    className="p-1.5 text-brand-slate/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Product"
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
        title="Delete Product"
        message="This product and all its compositions, benefits, dosage, and safety data will be permanently deleted."
        confirmLabel="Delete Product"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        dangerous
      />

      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </AdminLayout>
  );
}
