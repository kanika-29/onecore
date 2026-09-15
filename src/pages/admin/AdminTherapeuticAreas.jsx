import React, { useState, useEffect } from 'react';
import {
  Activity,
  ExternalLink,
  Search,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Tag,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import ToastNotification from '../../components/admin/ToastNotification';
import ConfirmModal from '../../components/admin/ConfirmModal';
import MediaSelectorModal from '../../components/admin/MediaSelectorModal';
import { useAdminAuth } from '../../context/AdminAuthContext';

const SEED_AREAS = [
  { id: 1, name: 'Orthopaedics', slug: 'orthopaedics', focus_title: 'Joint health, bone density and musculoskeletal recovery.', sort_order: 1, is_active: 1, tags: ['Joint Preservation', 'Bone Density', 'Cartilage Health'] },
  { id: 2, name: 'Cardiology', slug: 'cardiology', focus_title: 'Cardiovascular maintenance, arterial integrity and lipid management.', sort_order: 2, is_active: 1, tags: ['Lipid Control', 'Arterial Support'] },
  { id: 3, name: 'Neurology', slug: 'neurology', focus_title: 'Neuroprotection, peripheral nerve support and cognitive vitality.', sort_order: 3, is_active: 1, tags: ['Nerve Regeneration', 'Cognitive Health'] },
  { id: 4, name: 'Oncology Support', slug: 'oncology-support', focus_title: 'Adjunctive nutritional and cellular recovery therapeutics.', sort_order: 4, is_active: 1, tags: ['Cellular Resilience', 'Nutritional Support'] },
  { id: 5, name: 'Gastroenterology', slug: 'gastroenterology', focus_title: 'Mucosal lining protection, gut barrier integrity and microbiome balance.', sort_order: 5, is_active: 1, tags: ['Gut Barrier Integrity', 'Enzyme Support'] },
  { id: 6, name: 'Pulmonology', slug: 'pulmonology', focus_title: 'Respiratory tract resilience and pulmonary tissue maintenance.', sort_order: 6, is_active: 1, tags: ['Airway Clearance', 'Oxidative Balance'] },
  { id: 7, name: 'Endocrinology & Metabolism', slug: 'endocrinology-metabolism', focus_title: 'Glycaemic regulation, metabolic pathway support and hormonal balance.', sort_order: 7, is_active: 1, tags: ['Glycaemic Balance', 'Metabolic Health'] },
  { id: 8, name: 'Dermatology & Wound Care', slug: 'dermatology-wound-care', focus_title: 'Skin barrier restoration, tissue healing and dermal protection.', sort_order: 8, is_active: 1, tags: ['Barrier Restoration', 'Tissue Regeneration'] },
  { id: 9, name: 'Nephrology & Renal Care', slug: 'nephrology-renal-care', focus_title: 'Renal tissue support, electrolyte management and filtration integrity.', sort_order: 9, is_active: 1, tags: ['Renal Support', 'Electrolyte Balance'] },
];

// ─── Inline Area Editor ────────────────────────────────────────────────────────
function AreaEditorPanel({ area, onSave, onCancel, onOpenMedia }) {
  const [form, setForm] = useState({
    name: area?.name || '',
    slug: area?.slug || '',
    number_label: area?.number_label || '',
    heading: area?.heading || area?.name || '',
    description: area?.description || area?.focus_title || '',
    image_url: area?.image_url || '',
    is_active: area?.is_active !== 0,
    tags: (area?.tags || []).join(', '),
  });

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="bg-brand-navy-dark/60 border border-brand-teal/20 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1.5">Therapeutic Area Name *</label>
          <input type="text" value={form.name} onChange={set('name')} placeholder="e.g. Orthopaedics" className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50" />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1.5">URL Slug</label>
          <input type="text" value={form.slug} onChange={set('slug')} placeholder="auto-generated" className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1.5">Heading / Focus Title</label>
          <input type="text" value={form.heading} onChange={set('heading')} placeholder="Main heading shown on the area page" className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1.5">Description</label>
          <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Clinical description of this therapeutic area..." className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50 resize-y" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1.5">Tags (comma-separated)</label>
          <input type="text" value={form.tags} onChange={set('tags')} placeholder="Joint Preservation, Bone Density, Cartilage Health" className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1.5">Image URL</label>
          <div className="flex gap-2">
            <input type="text" value={form.image_url} onChange={set('image_url')} placeholder="/assets/therapeutic-area.jpg" className="flex-1 bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50" />
            <button
              type="button"
              onClick={() => onOpenMedia((url) => setForm((p) => ({ ...p, image_url: url })))}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-brand-navy border border-white/10 hover:border-brand-teal/40 rounded-lg text-xs text-brand-slate hover:text-white transition-all"
            >
              <ImageIcon size={13} />
              Library
            </button>
          </div>
          {form.image_url && (
            <div className="mt-2 h-20 w-32 rounded-lg overflow-hidden border border-white/10">
              <img src={form.image_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, is_active: !p.is_active }))}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-brand-teal' : 'bg-white/10'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : ''}`} />
          </button>
          <span className="text-xs text-brand-slate">Visible on Website</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
        <button onClick={onCancel} className="flex items-center gap-1.5 px-3 py-2 text-xs text-brand-slate hover:text-white border border-white/10 rounded-lg transition-all">
          <X size={13} /> Cancel
        </button>
        <button
          onClick={() => {
            const tagsArray = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
            onSave({ ...form, tags: tagsArray });
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg transition-all"
        >
          <Save size={13} /> Save Area
        </button>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function AdminTherapeuticAreas() {
  const { token } = useAdminAuth();
  const [areas, setAreas] = useState(SEED_AREAS);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [mediaCb, setMediaCb] = useState(null);

  const showToast = (type, message) => setToast({ type, message });

  const fetchAreas = async () => {
    try {
      const res = await fetch('/api/therapeutic-areas');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) setAreas(data.data);
      }
    } catch (err) {
      console.warn('Using seeded therapeutic areas:', err);
    }
  };

  useEffect(() => {
    document.title = 'Therapeutic Areas | Onecore Admin';
    fetchAreas();
  }, []);

  const handleSave = async (id, form) => {
    try {
      const res = await fetch(`/api/therapeutic-areas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          number_label: form.number_label,
          heading: form.heading,
          description: form.description,
          image_url: form.image_url,
          is_active: form.is_active ? 1 : 0,
          tags: form.tags,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAreas();
        setEditingId(null);
        showToast('success', 'Therapeutic area saved.');
      } else {
        showToast('error', data.message || 'Save failed.');
      }
    } catch {
      showToast('error', 'Network error.');
    }
  };

  const handleCreate = async (form) => {
    try {
      const res = await fetch('/api/therapeutic-areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          number_label: form.number_label,
          heading: form.heading,
          description: form.description,
          image_url: form.image_url,
          is_active: form.is_active ? 1 : 0,
          tags: form.tags,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAreas();
        setShowAddForm(false);
        showToast('success', 'New therapeutic area created.');
      } else {
        showToast('error', data.message || 'Create failed.');
      }
    } catch {
      showToast('error', 'Network error.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/therapeutic-areas/${deleteTarget}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAreas((prev) => prev.filter((a) => a.id !== deleteTarget));
        showToast('success', 'Therapeutic area deleted.');
      } else {
        showToast('error', data.message || 'Cannot delete. May have linked products.');
      }
    } catch {
      showToast('error', 'Network error.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredAreas = areas.filter(
    (a) =>
      !search ||
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.focus_title?.toLowerCase().includes(search.toLowerCase()) ||
      a.heading?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Therapeutic Areas"
      subtitle="Manage the specialized clinical care sectors and associated focus tags"
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-brand-navy border border-brand-navy-light/40 p-4 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-mono text-brand-slate">
          <Activity size={16} className="text-brand-teal" />
          <span>{areas.filter((a) => a.is_active !== 0).length} Active Specialities</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter therapeutic areas..."
              className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-1.5 pl-9 text-xs text-white placeholder-brand-slate/40 focus:outline-none focus:border-brand-teal/50"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-brand-slate/50" />
          </div>
          <button
            onClick={() => { setShowAddForm(true); setEditingId(null); }}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg transition-all"
          >
            <Plus size={13} />
            Add Area
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <AdminCard title="Add New Therapeutic Area">
          <AreaEditorPanel
            area={null}
            onSave={handleCreate}
            onCancel={() => setShowAddForm(false)}
            onOpenMedia={(cb) => setMediaCb(() => cb)}
          />
        </AdminCard>
      )}

      <AdminCard>
        <div className="space-y-2">
          {filteredAreas.map((area) => (
            <div key={area.id}>
              {/* Row */}
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  area.is_active === 0
                    ? 'border-white/5 bg-brand-navy-dark/30 opacity-60'
                    : 'border-white/10 bg-brand-navy hover:border-white/20'
                }`}
              >
                {/* Status dot */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${area.is_active !== 0 ? 'bg-brand-teal' : 'bg-white/20'}`} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-white">{area.name}</span>
                    {area.is_active === 0 && (
                      <span className="text-[10px] font-mono text-amber-400/70 bg-amber-500/10 px-1.5 py-0.5 rounded">Hidden</span>
                    )}
                  </div>
                  <p className="text-[11px] text-brand-slate/60 truncate mt-0.5">
                    {area.heading || area.focus_title}
                  </p>
                  {area.tags && area.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(area.tags || []).slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/8 text-brand-slate/60">
                          {typeof tag === 'string' ? tag : tag.name || tag.tag_name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image preview */}
                {area.image_url && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <img src={area.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditingId(editingId === area.id ? null : area.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      editingId === area.id
                        ? 'text-white bg-brand-teal/20'
                        : 'text-brand-slate/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {editingId === area.id ? <X size={14} /> : <Edit2 size={14} />}
                  </button>
                  <a
                    href={`/areas-of-care#${area.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-brand-slate/50 hover:text-brand-teal hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => setDeleteTarget(area.id)}
                    className="p-1.5 text-brand-slate/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Inline Editor */}
              {editingId === area.id && (
                <div className="mt-2">
                  <AreaEditorPanel
                    area={area}
                    onSave={(form) => handleSave(area.id, form)}
                    onCancel={() => setEditingId(null)}
                    onOpenMedia={(cb) => setMediaCb(() => cb)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </AdminCard>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Therapeutic Area"
        message="This will remove the therapeutic area and all associated tags. Products linked to this area must be reassigned first."
        confirmLabel="Delete Area"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        dangerous
      />

      <MediaSelectorModal
        isOpen={!!mediaCb}
        onSelect={(url) => { mediaCb && mediaCb(url); setMediaCb(null); }}
        onClose={() => setMediaCb(null)}
      />

      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </AdminLayout>
  );
}
