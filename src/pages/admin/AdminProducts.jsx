import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  RefreshCw,
  FileSpreadsheet,
  UploadCloud,
  X,
  Filter,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import ToastNotification from '../../components/admin/ToastNotification';
import ConfirmModal from '../../components/admin/ConfirmModal';
import CatalogImportModal from '../../components/admin/CatalogImportModal';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminProducts() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const showToast = (type, message) => setToast({ type, message });

  const handleDeleteAll = async () => {
    setDeletingAll(true);
    try {
      const res = await fetch('/api/products/delete-all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', data.message || 'All products deleted from the live database.');
        setProducts([]);
      } else {
        showToast('error', data.message || 'Failed to delete products.');
      }
    } catch (err) {
      console.error('Error deleting all products:', err);
      showToast('error', 'Network error while deleting all products.');
    } finally {
      setDeletingAll(false);
      setShowDeleteAllModal(false);
    }
  };

  const handleSyncCatalog = async () => {
    if (!window.confirm('This will synchronize all formulations from your Master Excel sheet into MySQL and link verified packaging images. Proceed?')) {
      return;
    }
    setSyncing(true);
    try {
      const res = await fetch('/api/products/sync-catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', data.message || 'Catalog synchronized successfully!');
        fetchProducts();
      } else {
        showToast('error', data.message || 'Failed to sync catalog.');
      }
    } catch (err) {
      console.error('Error syncing catalog:', err);
      showToast('error', 'Network error during catalog sync.');
    } finally {
      setSyncing(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const rawItems = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        // Strict deduplication by ID
        const seen = new Set();
        const items = [];
        for (const it of rawItems) {
          if (it && it.id && !seen.has(it.id)) {
            seen.add(it.id);
            items.push(it);
          }
        }
        setProducts(items);
      } else {
        setProducts([]);
        showToast('error', 'Failed to retrieve products from database.');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
      showToast('error', 'Network error retrieving products.');
    } finally {
      setLoading(false);
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

  // Robust Normalized Search across Brand, Slugs, Compositions, Divisions & Descriptions
  const normalizeSearchText = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[™®©]/g, '')
      .replace(/[-_.,/\\()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const filtered = products.filter((p) => {
    if (!search || !search.trim()) return true;
    const rawQ = search.toLowerCase().trim();
    const cleanQ = normalizeSearchText(rawQ);
    const tokens = cleanQ.split(' ').filter(Boolean);

    const searchable = [
      p.brand_name,
      p.brandName,
      p.name,
      p.slug,
      p.therapeutic_area_name,
      p.therapeuticArea,
      p.division,
      p.divisionSlug,
      p.therapeutic_area_slug,
      p.category,
      p.composition_summary,
      p.composition,
      p.short_description,
      p.full_description,
      p.status,
    ];

    if (Array.isArray(p.compositions)) {
      p.compositions.forEach((c) => {
        searchable.push(c.ingredient_name, c.strength);
      });
    }

    const rawHaystack = searchable.filter(Boolean).join(' ').toLowerCase();
    const cleanHaystack = normalizeSearchText(rawHaystack);

    if (rawHaystack.includes(rawQ) || cleanHaystack.includes(cleanQ)) {
      return true;
    }

    if (tokens.length > 1) {
      return tokens.every((t) => cleanHaystack.includes(t));
    }

    return false;
  });

  return (
    <AdminLayout
      title="Product Portfolio"
      subtitle="Pharmaceutical formulations, active compositions, and clinical monographs"
    >
      <AdminCard
        title={`Active Products (${filtered.length}${search.trim() ? ` of ${products.length}` : ''})`}
        subtitle="Catalog of clinical formulations and prescription monographs"
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input with Clear Button */}
            <div className="relative min-w-[220px]">
              <input
                type="text"
                placeholder="Search brand, composition, division..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 pl-8 pr-7 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0D5C75] focus:ring-1 focus:ring-[#0D5C75]"
              />
              <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  title="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Download Excel Format */}
            <a
              href="/api/products/download-template"
              download="Onecore_Product_Catalog_Template.xlsx"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-all shadow-2xs cursor-pointer"
              title="Download pre-formatted 9-division Excel catalog template"
            >
              <FileSpreadsheet size={13} className="text-emerald-600" />
              <span>Download Excel Format</span>
            </a>

            {/* Bulk Import Excel & ZIP */}
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#0D5C75] hover:bg-[#0b4d62] text-white rounded-lg transition-all shadow-xs cursor-pointer"
              title="Bulk import products from Excel sheet and ZIP folder of photos"
            >
              <UploadCloud size={13} />
              <span>Bulk Import (Excel + ZIP)</span>
            </button>

            {/* Add Single Product */}
            <Link
              to="/admin/products/new"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#1B365D] hover:bg-[#152a48] text-white rounded-lg transition-all shadow-xs"
            >
              <Plus size={13} />
              <span>Add Product</span>
            </Link>

            {/* Delete All Products */}
            <button
              onClick={() => setShowDeleteAllModal(true)}
              disabled={deletingAll || products.length === 0}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
              title="Delete all products from the live database"
            >
              <Trash2 size={13} className={deletingAll ? 'animate-spin' : ''} />
              <span>Delete All</span>
            </button>
          </div>
        }
      >
        {/* Search Feedback Banner */}
        {search.trim() && (
          <div className="mb-4 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-[#0D5C75]" />
              <span>
                Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> products matching "
                <span className="font-semibold text-slate-900">{search}</span>"
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-[#0D5C75] hover:underline font-semibold cursor-pointer text-xs"
            >
              Clear Filter
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <Package size={36} className="mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No products found</p>
            {search.trim() ? (
              <p className="text-xs text-slate-400">
                No formulations matched "{search}". Try searching by salt name or division, or{' '}
                <button onClick={() => setSearch('')} className="text-[#0D5C75] underline font-semibold">
                  clear search
                </button>
                .
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Your catalog is currently empty. Use "Bulk Import (Excel + ZIP)" to load your products.
              </p>
            )}
          </div>
        ) : (
        <AdminTable
          headers={['Product Name', 'Therapeutic Area / Division', 'Active Composition', 'Status', 'Actions']}
        >
          {filtered.map((p, idx) => (
            <tr key={`${p.id}-${p.slug || ''}-${idx}`} className="hover:bg-slate-50 transition-colors">
              <td className="py-3 px-4 font-semibold text-slate-900">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-slate-100 text-[#1B365D]">
                    <Package size={14} />
                  </div>
                  <span>{p.brand_name || p.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-slate-700 text-xs font-medium">
                {p.therapeutic_area_name || 'Orthopaedics'}
              </td>
              <td className="py-3 px-4 text-slate-600 text-xs max-w-xs truncate">
                {p.short_description || p.full_description || '—'}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold border ${
                    p.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {p.status || 'published'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/products/${p.id || p.slug}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#1B365D] hover:bg-[#152a48] text-white rounded-lg transition-all shadow-xs"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </Link>
                  <a
                    href={p.productUrl || `/areas-of-care/${p.divisionSlug || p.division || p.therapeutic_area_slug || 'general-medicine'}/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="View Live Product"
                  >
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => setDeleteTarget(p.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
        )}
      </AdminCard>

      <CatalogImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => fetchProducts()}
        token={token}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Product"
        message="This product and all its compositions, benefits, dosage, and safety data will be permanently deleted from MySQL."
        confirmLabel="Delete Product"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        dangerous
      />

      <ConfirmModal
        isOpen={showDeleteAllModal}
        title="Delete All Products from Live Website?"
        message="This will completely remove ALL formulations, compositions, dosages, indications, and images from the live MySQL database. The website will immediately show 0 products."
        confirmLabel={deletingAll ? 'Deleting All...' : 'Yes, Delete All Products'}
        onConfirm={handleDeleteAll}
        onCancel={() => setShowDeleteAllModal(false)}
        dangerous
      />

      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </AdminLayout>
  );
}
