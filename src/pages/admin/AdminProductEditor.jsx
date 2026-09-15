import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Package,
  X,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import ToastNotification from '../../components/admin/ToastNotification';
import MediaSelectorModal from '../../components/admin/MediaSelectorModal';
import { useAdminAuth } from '../../context/AdminAuthContext';

// ─── Helpers ───────────────────────────────────────────────────────────────────
function FieldLabel({ children }) {
  return (
    <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1.5">
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, className = '' }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50 ${className}`}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50 resize-y"
    />
  );
}

// Repeatable list editor (compositions, benefits, mechanisms, safety)
function RepeatableListEditor({ items, onChange, fields, addLabel }) {
  const add = () => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, '']))]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, key, val) =>
    onChange(items.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-brand-navy-dark/40 border border-white/8 rounded-xl p-4 space-y-3 relative group">
          <button
            onClick={() => remove(i)}
            className="absolute top-3 right-3 text-brand-slate/30 hover:text-red-400 transition-colors"
          >
            <Trash2 size={13} />
          </button>
          <div className="text-[10px] font-mono text-brand-teal/50 uppercase tracking-widest mb-1">
            Item {i + 1}
          </div>
          {fields.map((f) => (
            <div key={f.key}>
              <FieldLabel>{f.label}</FieldLabel>
              {f.multiline ? (
                <TextArea
                  value={item[f.key]}
                  onChange={(e) => update(i, f.key, e.target.value)}
                  placeholder={f.placeholder}
                />
              ) : (
                <TextInput
                  value={item[f.key]}
                  onChange={(e) => update(i, f.key, e.target.value)}
                  placeholder={f.placeholder}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-2 px-3 py-2 text-xs text-brand-teal/80 hover:text-brand-teal border border-dashed border-brand-teal/20 hover:border-brand-teal/40 rounded-xl transition-all w-full justify-center"
      >
        <Plus size={13} />
        {addLabel}
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminProductEditor() {
  const { id } = useParams(); // 'new' or product id
  const navigate = useNavigate();
  const { token } = useAdminAuth();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [therapeuticAreas, setTherapeuticAreas] = useState([]);
  const [mediaCb, setMediaCb] = useState(null);

  const showToast = (type, message) => setToast({ type, message });

  const [form, setForm] = useState({
    therapeutic_area_id: '',
    brand_name: '',
    slug: '',
    short_description: '',
    full_description: '',
    packshot_url: '',
    status: 'published',
    dosage_form: '',
    tagline: '',
    seo_title: '',
    seo_description: '',
    compositions: [],
    benefits: [],
    dosage: { heading: 'How it should be taken.', description: '' },
    mechanisms: [],
    safetySections: [],
  });

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  useEffect(() => {
    document.title = isNew ? 'New Product | Onecore Admin' : 'Edit Product | Onecore Admin';

    // Fetch therapeutic areas for dropdown
    fetch('/api/therapeutic-areas')
      .then((r) => r.json())
      .then((d) => { if (d.success) setTherapeuticAreas(d.data || []); })
      .catch(() => {});

    if (!isNew) {
      setLoading(true);
      fetch(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.data) {
            const p = d.data;
            setForm({
              therapeutic_area_id: p.therapeutic_area_id || '',
              brand_name: p.brand_name || '',
              slug: p.slug || '',
              short_description: p.short_description || '',
              full_description: p.full_description || '',
              packshot_url: p.packshot_url || '',
              status: p.status || 'published',
              dosage_form: p.dosage_form || '',
              tagline: p.tagline || '',
              seo_title: p.seo_title || '',
              seo_description: p.seo_description || '',
              compositions: (p.compositions || []).map((c) => ({
                ingredient_name: c.ingredient_name || '',
                ingredient_description: c.ingredient_description || '',
                strength: c.strength || '',
              })),
              benefits: (p.benefits || []).map((b) => ({
                title: b.title || '',
                description: b.description || '',
              })),
              dosage: p.dosage
                ? { heading: p.dosage.heading || '', description: p.dosage.description || '' }
                : { heading: 'How it should be taken.', description: '' },
              mechanisms: (p.mechanisms || []).map((m) => ({
                title: m.title || '',
                description: m.description || '',
              })),
              safetySections: (p.safetySections || []).map((s) => ({
                section_key: s.section_key || '',
                title: s.title || '',
                description: s.description || '',
              })),
            });
          } else {
            showToast('error', 'Product not found.');
          }
        })
        .catch(() => showToast('error', 'Failed to load product.'))
        .finally(() => setLoading(false));
    }
  }, [id, isNew, token]);

  const handleSave = async () => {
    if (!form.brand_name.trim()) {
      showToast('error', 'Brand name is required.');
      return;
    }
    setSaving(true);
    try {
      const url = isNew ? '/api/products' : `/api/products/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', isNew ? 'Product created successfully.' : 'Product saved successfully.');
        if (isNew && data.data?.id) {
          setTimeout(() => navigate(`/admin/products/${data.data.id}`), 1500);
        }
      } else {
        showToast('error', data.message || 'Save failed.');
      }
    } catch {
      showToast('error', 'Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Product Editor" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isNew ? 'New Product' : `Editing: ${form.brand_name}`}
      subtitle={isNew ? 'Create a new pharmaceutical product entry' : 'Update product details, compositions, benefits, and safety information'}
    >
      {/* Back + Preview */}
      <div className="flex items-center justify-between">
        <Link to="/admin/products" className="flex items-center gap-2 text-xs text-brand-slate hover:text-white transition-colors">
          <ChevronLeft size={14} />
          Back to Products
        </Link>
        {!isNew && form.slug && (
          <a
            href={`/areas-of-care/orthopaedics/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-brand-teal hover:underline"
          >
            <ExternalLink size={13} />
            View Live Product
          </a>
        )}
      </div>

      {/* Core Details */}
      <AdminCard title="Product Details" subtitle="Brand name, therapeutic area, status, and key identifiers">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <FieldLabel>Brand Name *</FieldLabel>
            <TextInput value={form.brand_name} onChange={set('brand_name')} placeholder="e.g. OneFLEXO" />
          </div>
          <div>
            <FieldLabel>URL Slug</FieldLabel>
            <TextInput value={form.slug} onChange={set('slug')} placeholder="auto-generated from name" />
          </div>
          <div>
            <FieldLabel>Therapeutic Area</FieldLabel>
            <select
              value={form.therapeutic_area_id}
              onChange={set('therapeutic_area_id')}
              className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
            >
              <option value="">— Select Therapeutic Area —</option>
              {therapeuticAreas.map((ta) => (
                <option key={ta.id} value={ta.id}>{ta.name}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <select
              value={form.status}
              onChange={set('status')}
              className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <FieldLabel>Dosage Form</FieldLabel>
            <TextInput value={form.dosage_form} onChange={set('dosage_form')} placeholder="e.g. Oral Capsule & Sachet" />
          </div>
          <div>
            <FieldLabel>Tagline</FieldLabel>
            <TextInput value={form.tagline} onChange={set('tagline')} placeholder="Short positioning line" />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <FieldLabel>Short Description</FieldLabel>
            <TextArea value={form.short_description} onChange={set('short_description')} placeholder="Brief product summary (1–2 sentences)" rows={2} />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <FieldLabel>Full Description</FieldLabel>
            <TextArea value={form.full_description} onChange={set('full_description')} placeholder="Detailed clinical description" rows={5} />
          </div>
        </div>
      </AdminCard>

      {/* Packshot / Image */}
      <AdminCard title="Product Image" subtitle="Packshot or representative product visual">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <FieldLabel>Image URL or Path</FieldLabel>
            <div className="flex gap-2">
              <TextInput
                value={form.packshot_url}
                onChange={set('packshot_url')}
                placeholder="/assets/product-image.jpg"
              />
              <button
                type="button"
                onClick={() => setMediaCb(() => (url) => setForm((p) => ({ ...p, packshot_url: url })))}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-brand-navy border border-white/10 hover:border-brand-teal/40 rounded-lg text-xs text-brand-slate hover:text-white transition-all"
              >
                <ImageIcon size={13} />
                Library
              </button>
            </div>
          </div>
          {form.packshot_url && (
            <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 shrink-0">
              <img src={form.packshot_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </AdminCard>

      {/* Compositions */}
      <AdminCard title="Active Compositions" subtitle="Ingredient name, description, and strength for each active component">
        <RepeatableListEditor
          items={form.compositions}
          onChange={(compositions) => setForm((p) => ({ ...p, compositions }))}
          addLabel="Add Composition"
          fields={[
            { key: 'ingredient_name', label: 'Ingredient Name', placeholder: 'e.g. Sodium Hyaluronate' },
            { key: 'strength', label: 'Strength / Dose', placeholder: 'e.g. 200 mg' },
            { key: 'ingredient_description', label: 'Description', placeholder: 'Clinical role of this ingredient', multiline: true },
          ]}
        />
      </AdminCard>

      {/* Benefits */}
      <AdminCard title="Clinical Benefits" subtitle="Key therapeutic benefits displayed on the product page">
        <RepeatableListEditor
          items={form.benefits}
          onChange={(benefits) => setForm((p) => ({ ...p, benefits }))}
          addLabel="Add Benefit"
          fields={[
            { key: 'title', label: 'Benefit Title', placeholder: 'e.g. Joint Cartilage Restoration' },
            { key: 'description', label: 'Description', placeholder: 'Clinical explanation of the benefit', multiline: true },
          ]}
        />
      </AdminCard>

      {/* Dosage */}
      <AdminCard title="Dosage Information" subtitle="Dosage instructions and administration guidance">
        <div className="space-y-3">
          <div>
            <FieldLabel>Dosage Section Heading</FieldLabel>
            <TextInput
              value={form.dosage.heading}
              onChange={(e) => setForm((p) => ({ ...p, dosage: { ...p.dosage, heading: e.target.value } }))}
              placeholder="How it should be taken."
            />
          </div>
          <div>
            <FieldLabel>Dosage Description</FieldLabel>
            <TextArea
              value={form.dosage.description}
              onChange={(e) => setForm((p) => ({ ...p, dosage: { ...p.dosage, description: e.target.value } }))}
              placeholder="Dosage schedule, route of administration..."
              rows={4}
            />
          </div>
        </div>
      </AdminCard>

      {/* Mechanisms */}
      <AdminCard title="Mechanism of Action" subtitle="Scientific mechanism steps or pathways">
        <RepeatableListEditor
          items={form.mechanisms}
          onChange={(mechanisms) => setForm((p) => ({ ...p, mechanisms }))}
          addLabel="Add Mechanism Step"
          fields={[
            { key: 'title', label: 'Step / Title', placeholder: 'e.g. Synovial Fluid Viscosity Restoration' },
            { key: 'description', label: 'Description', placeholder: 'Mechanism detail...', multiline: true },
          ]}
        />
      </AdminCard>

      {/* Safety Sections */}
      <AdminCard title="Safety Information" subtitle="Contraindications, precautions, and prescribing notes for healthcare professionals">
        <RepeatableListEditor
          items={form.safetySections}
          onChange={(safetySections) => setForm((p) => ({ ...p, safetySections }))}
          addLabel="Add Safety Section"
          fields={[
            { key: 'title', label: 'Section Title', placeholder: 'e.g. Contraindications' },
            { key: 'section_key', label: 'Section Key (unique ID)', placeholder: 'e.g. contraindications' },
            { key: 'description', label: 'Content', placeholder: 'Safety information content...', multiline: true },
          ]}
        />
      </AdminCard>

      {/* SEO */}
      <AdminCard title="SEO Metadata" subtitle="Optional search engine title and meta description for this product page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>SEO Title</FieldLabel>
            <TextInput value={form.seo_title} onChange={set('seo_title')} placeholder="Defaults to brand name" />
          </div>
          <div>
            <FieldLabel>SEO Meta Description</FieldLabel>
            <TextInput value={form.seo_description} onChange={set('seo_description')} placeholder="Search engine description" />
          </div>
        </div>
      </AdminCard>

      {/* Save Bar */}
      <div className="sticky bottom-4 z-20">
        <div className="bg-brand-navy/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between shadow-xl">
          <div className="text-xs text-brand-slate/70">
            {isNew ? 'Creating new product' : `Editing: ${form.brand_name}`}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl transition-all disabled:opacity-60 shadow-lg"
          >
            <Save size={15} />
            {saving ? 'Saving...' : isNew ? 'Create Product' : 'Save All Changes'}
          </button>
        </div>
      </div>

      <MediaSelectorModal
        isOpen={!!mediaCb}
        onSelect={(url) => { mediaCb && mediaCb(url); setMediaCb(null); }}
        onClose={() => setMediaCb(null)}
      />

      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </AdminLayout>
  );
}
