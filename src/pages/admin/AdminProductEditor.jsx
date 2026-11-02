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
  Layers,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Star,
  StarOff,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import ToastNotification from '../../components/admin/ToastNotification';
import MediaSelectorModal from '../../components/admin/MediaSelectorModal';
import { useAdminAuth } from '../../context/AdminAuthContext';

function FieldLabel({ children, required }) {
  return (
    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-medium mb-1.5">
      {children}
      {required && <span className="text-rose-600 ml-1">*</span>}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, className = '', required }) {
  return (
    <input
      type="text"
      required={required}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0D5C75] focus:ring-1 focus:ring-[#0D5C75] ${className}`}
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
      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0D5C75] focus:ring-1 focus:ring-[#0D5C75] resize-y leading-relaxed"
    />
  );
}

// Repeatable structured list editor (compositions, benefits, mechanisms, safety)
function RepeatableListEditor({ items, onChange, fields, addLabel }) {
  const add = () => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, '']))]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, key, val) =>
    onChange(items.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative group">
          <button
            type="button"
            onClick={() => remove(i)}
            className="absolute top-3.5 right-3.5 text-slate-400 hover:text-rose-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
          <div className="text-[10px] font-mono text-[#0D5C75] font-bold uppercase tracking-wider mb-1">
            Item #{i + 1}
          </div>
          {fields.map((f) => (
            <div key={f.key}>
              <FieldLabel>{f.label}</FieldLabel>
              {f.multiline ? (
                <TextArea
                  value={item[f.key]}
                  onChange={(e) => update(i, f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={2}
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
        type="button"
        onClick={add}
        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#0D5C75] hover:bg-[#0D5C75]/10 border border-dashed border-[#0D5C75]/30 rounded-xl transition-all w-full justify-center cursor-pointer"
      >
        <Plus size={13} />
        {addLabel}
      </button>
    </div>
  );
}

export default function AdminProductEditor() {
  const { id } = useParams(); // ID or slug or 'new'
  const navigate = useNavigate();
  const { token } = useAdminAuth();
  const isNew = id === 'new';

  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState('packshot'); // 'packshot' or 'gallery'

  const showToast = (type, message) => setToast({ type, message });

  const [form, setForm] = useState({
    brand_name: '',
    slug: '',
    therapeutic_area_id: 3,
    therapeutic_area_ids: [3],
    division: '',
    divisionSlug: '',
    therapeuticArea: '',
    category: '',
    short_description: '',
    full_description: '',
    packshot_url: '',
    status: 'published',
    display_order: 1,
    seo_title: '',
    seo_description: '',
    link_url: '',
    link_label: '',
    images: [],
    compositions: [],
    benefits: [],
    dosage: { heading: 'How it should be taken.', description: 'Use as directed by a healthcare professional.' },
    mechanisms: [],
    safetySections: [],
  });

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // Load Therapeutic Areas for dropdown
  useEffect(() => {
    fetch('/api/therapeutic-areas')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setAreas(d.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch product data
  useEffect(() => {
    document.title = isNew ? 'Add Product | Onecore Admin' : 'Edit Product | Onecore Admin';
    if (isNew) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          const p = d.data;
          setForm({
            id: p.id,
            brand_name: p.brand_name || p.name || '',
            brandName: p.brand_name || p.name || '',
            slug: p.slug || '',
            therapeutic_area_id: p.therapeutic_area_id || 3,
            therapeutic_area_ids: (Array.isArray(p.therapeutic_area_ids) && p.therapeutic_area_ids.length > 0)
              ? p.therapeutic_area_ids
              : [p.therapeutic_area_id || 3],
            division: p.division || p.divisionSlug || p.therapeutic_area_slug || '',
            divisionSlug: p.divisionSlug || p.division || p.therapeutic_area_slug || '',
            therapeuticArea: p.therapeuticArea || p.therapeutic_area_name || '',
            category: p.category || p.division || p.therapeutic_area_slug || '',
            short_description: p.short_description || '',
            full_description: p.full_description || p.description || '',
            packshot_url: p.packshot_url || p.image || '',
            status: p.status || 'published',
            display_order: p.display_order || 1,
            seo_title: p.seo_title || '',
            seo_description: p.seo_description || '',
            link_url: p.link_url || p.external_link || '',
            link_label: p.link_label || p.external_link_label || '',
            images: (Array.isArray(p.images) && p.images.length > 0)
              ? p.images.map((img, idx) => ({
                  id: img.id,
                  image_url: img.image_url || '',
                  alt_text: img.alt_text || '',
                  is_primary: img.is_primary ? 1 : (idx === 0 ? 1 : 0),
                  display_order: img.display_order || idx + 1,
                }))
              : (p.packshot_url ? [{ image_url: p.packshot_url, alt_text: p.brand_name || '', is_primary: 1, display_order: 1 }] : []),
            compositions: p.compositions || [],
            benefits: p.benefits || [],
            dosage: p.dosage || { heading: 'How it should be taken.', description: 'Use as directed by a healthcare professional.' },
            mechanisms: p.mechanisms || [],
            safetySections: p.safetySections || p.safety_sections || [],
          });
        } else {
          showToast('error', d.message || 'Product not found in database.');
        }
      })
      .catch((err) => {
        showToast('error', 'Failed to load product from server.');
      })
      .finally(() => setLoading(false));
  }, [id, isNew, token]);

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.brand_name.trim()) {
      showToast('error', 'Brand name is required.');
      return;
    }

    setSaving(true);
    const productId = form.id || (id && id !== 'new' ? id : null);
    const isEditing = Boolean(productId);
    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing ? `/api/products/${productId}` : '/api/products';

    const selectedArea = areas.find((a) => a.id === form.therapeutic_area_id);
    const selectedDivisionSlug = selectedArea?.slug || form.divisionSlug || form.division || 'general-medicine';
    const selectedDivisionLabel = selectedArea?.name || form.therapeuticArea || 'General Medicine';

    const payload = {
      ...form,
      id: form.id || (isEditing ? productId : undefined),
      brand_name: (form.brand_name || form.brandName || '').trim(),
      brandName: (form.brand_name || form.brandName || '').trim(),
      name: (form.brand_name || form.brandName || '').trim(),
      slug: (form.slug || '').trim().toLowerCase(),
      therapeuticArea: selectedDivisionLabel,
      division: selectedDivisionSlug,
      divisionSlug: selectedDivisionSlug,
      division_slug: selectedDivisionSlug,
      therapeutic_area: selectedDivisionLabel,
      category: selectedDivisionSlug,
      therapeutic_area_id: form.therapeutic_area_id,
      therapeutic_area_ids: form.therapeutic_area_ids || [form.therapeutic_area_id],
      link_url: form.link_url ? form.link_url.trim() : null,
      link_label: form.link_label ? form.link_label.trim() : null,
      external_link: form.link_url ? form.link_url.trim() : null,
      external_link_label: form.link_label ? form.link_label.trim() : null,
      updatedAt: new Date()
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', isEditing ? 'Product updated successfully.' : 'Product created successfully.');
        if (!isEditing && data.data?.id) {
          setForm((prev) => ({ ...prev, id: data.data.id, slug: data.data.slug || prev.slug }));
          navigate(`/admin/products/${data.data.id}`, { replace: true });
        } else if (isEditing && data.data?.id) {
          setForm((prev) => ({ ...prev, id: data.data.id }));
        }
      } else {
        showToast('error', data.error || data.message || 'Failed to save product.');
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setForm((prev) => {
      const removed = prev.images[index];
      const remaining = prev.images.filter((_, i) => i !== index);
      let nextPackshot = prev.packshot_url;
      if (removed?.is_primary && remaining.length > 0) {
        remaining[0].is_primary = 1;
        nextPackshot = remaining[0].image_url;
      } else if (remaining.length === 0) {
        nextPackshot = '';
      }
      return { ...prev, images: remaining, packshot_url: nextPackshot };
    });
  };

  const handleSetPrimaryGalleryImage = (index) => {
    setForm((prev) => {
      const target = prev.images[index];
      if (!target) return prev;
      const updated = prev.images.map((img, i) => ({
        ...img,
        is_primary: i === index ? 1 : 0,
      }));
      return {
        ...prev,
        images: updated,
        packshot_url: target.image_url || prev.packshot_url,
      };
    });
  };

  const handleUpdateGalleryImage = (index, field, value) => {
    setForm((prev) => {
      const updated = prev.images.map((img, i) => {
        if (i === index) {
          return { ...img, [field]: value };
        }
        return img;
      });
      let nextPackshot = prev.packshot_url;
      if (field === 'image_url' && updated[index]?.is_primary) {
        nextPackshot = value;
      }
      return { ...prev, images: updated, packshot_url: nextPackshot };
    });
  };

  const handleMoveGalleryImage = (index, direction) => {
    setForm((prev) => {
      const nextImages = [...prev.images];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= nextImages.length) return prev;
      const temp = nextImages[index];
      nextImages[index] = nextImages[targetIndex];
      nextImages[targetIndex] = temp;
      return { ...prev, images: nextImages };
    });
  };

  return (
    <AdminLayout
      title={isNew ? 'New Product Formulation' : `Edit: ${form.brand_name || id}`}
      subtitle="Manage active ingredients, compositions, clinical benefits, mechanism of action, and safety monographs"
    >
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/admin/products"
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to Product Portfolio</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {!isNew && form.slug && (
            <a
              href={`/areas-of-care/${form.divisionSlug || form.division || (areas.find((a) => a.id === form.therapeutic_area_id)?.slug) || 'general-medicine'}/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-all shadow-xs"
            >
              <span>View Product Page</span>
              <ExternalLink size={13} />
            </a>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1B365D] hover:bg-[#152a48] text-white text-xs font-semibold rounded-lg transition-all shadow-xs disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? 'Saving...' : 'Save Product'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          Loading product specifications from MySQL...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Basic Product Information */}
          <AdminCard
            title="General Product Specifications"
            subtitle="Brand name, classification, division, and descriptions"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FieldLabel required>Brand Name</FieldLabel>
                <TextInput
                  required
                  value={form.brand_name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      brand_name: name,
                      ...(isNew ? { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') } : {}),
                    }));
                  }}
                  placeholder="e.g. OneFLEXO, Calmme, Folentis"
                />
              </div>

              <div>
                <FieldLabel required>URL Slug</FieldLabel>
                <TextInput
                  required
                  value={form.slug}
                  onChange={set('slug')}
                  placeholder="e.g. oneflexo, calmme"
                />
              </div>

              <div>
                <FieldLabel required>Primary Division / Specialty</FieldLabel>
                <select
                  value={form.therapeutic_area_id}
                  onChange={(e) => {
                    const newPrimary = parseInt(e.target.value, 10);
                    setForm((p) => {
                      const prevIds = Array.isArray(p.therapeutic_area_ids) ? p.therapeutic_area_ids : [];
                      const updatedIds = prevIds.includes(newPrimary) ? prevIds : [newPrimary, ...prevIds];
                      return { ...p, therapeutic_area_id: newPrimary, therapeutic_area_ids: updatedIds };
                    });
                  }}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0D5C75] focus:ring-1 focus:ring-[#0D5C75]"
                >
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.slug})
                    </option>
                  ))}
                </select>
              </div>

              {/* Multi-Specialty Category Checkboxes */}
              <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Multi-Specialty Display (Appear in Multiple Categories)
                  </span>
                  <span className="text-[10px] text-[#0D5C75] font-semibold bg-[#0D5C75]/10 px-2 py-0.5 rounded-full">
                    {(form.therapeutic_area_ids || []).length} Categories Selected
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Select all specialty pages where this product should be displayed. For example, if a medicine is prescribed in both Orthopaedics (Ortheon) and General Medicine (Omnara), check both.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
                  {areas.map((a) => {
                    const isPrimary = a.id === form.therapeutic_area_id;
                    const isChecked = isPrimary || (form.therapeutic_area_ids || []).includes(a.id);
                    return (
                      <label
                        key={a.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-[#0D5C75]/5 border-[#0D5C75]/40 text-[#0D5C75] font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isPrimary}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setForm((prev) => {
                              const setIds = new Set(prev.therapeutic_area_ids || [prev.therapeutic_area_id]);
                              if (checked) {
                                setIds.add(a.id);
                              } else {
                                setIds.delete(a.id);
                              }
                              setIds.add(prev.therapeutic_area_id); // ensure primary is always kept
                              return { ...prev, therapeutic_area_ids: Array.from(setIds) };
                            });
                          }}
                          className="rounded border-slate-300 text-[#0D5C75] focus:ring-[#0D5C75]"
                        />
                        <span className="truncate">
                          {a.name} {isPrimary && <span className="text-[10px] font-normal text-[#0D5C75]">(Primary)</span>}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-3">
                <FieldLabel>Short Description / Indication Summary</FieldLabel>
                <TextInput
                  value={form.short_description}
                  onChange={set('short_description')}
                  placeholder="e.g. Specialised joint health formulation combining Aflapin®, native collagen and Mobilee®."
                />
              </div>

              <div className="md:col-span-3">
                <FieldLabel>Full Monograph / Detailed Description</FieldLabel>
                <TextArea
                  rows={3}
                  value={form.full_description}
                  onChange={set('full_description')}
                  placeholder="Comprehensive clinical overview and therapeutic positioning..."
                />
              </div>

              {/* Packshot Image */}
              <div className="md:col-span-3">
                <FieldLabel>Product Primary Packshot Image</FieldLabel>
                <div className="flex gap-2">
                  <TextInput
                    value={form.packshot_url}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((prev) => {
                        const currentImages = prev.images || [];
                        const updatedImages = currentImages.map((img) => ({
                          ...img,
                          is_primary: img.image_url === val ? 1 : (img.is_primary ? 1 : 0),
                        }));
                        return { ...prev, packshot_url: val, images: updatedImages };
                      });
                    }}
                    placeholder="/assets/products/oneflexo-packshot.png"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTarget('packshot');
                      setMediaOpen(true);
                    }}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                  >
                    <ImageIcon size={14} />
                    <span>Choose Media</span>
                  </button>
                </div>
                {form.packshot_url && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <img
                      src={form.packshot_url}
                      alt="Packshot Preview"
                      className="w-16 h-16 object-contain rounded border border-slate-200 bg-white"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Primary Catalog Packshot</div>
                      <span className="text-xs text-slate-500 font-mono truncate block">{form.packshot_url}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AdminCard>

          {/* Section 2: Product Media & Multi-Photo Gallery */}
          <AdminCard
            title="Product Images & Multi-Photo Gallery"
            subtitle="Upload and manage multiple high-resolution product photos, packaging packshots, blister visuals, and clinical mechanism diagrams."
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="text-xs text-slate-500">
                  Total Photos: <span className="font-semibold text-slate-800">{(form.images || []).length}</span>. The photo marked as <span className="font-semibold text-amber-600">Primary Packshot</span> is used across the catalog and hero monograph.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTarget('gallery');
                      setMediaOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D5C75]/10 hover:bg-[#0D5C75]/20 text-[#0D5C75] text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    <ImageIcon size={14} />
                    <span>Choose from Media Library</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newImg = {
                        image_url: '',
                        alt_text: `${form.brand_name || 'Product'} photo`,
                        is_primary: (form.images || []).length === 0 ? 1 : 0,
                        display_order: (form.images || []).length + 1,
                      };
                      setForm((prev) => ({
                        ...prev,
                        images: [...(prev.images || []), newImg],
                      }));
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Photo URL</span>
                  </button>
                </div>
              </div>

              {(!form.images || form.images.length === 0) ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No Additional Product Photos Added Yet</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                    Add multiple photos to showcase blister packaging, product boxes, formulation angles, and clinical mechanism diagrams.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTarget('gallery');
                      setMediaOpen(true);
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D5C75] text-white text-xs font-semibold rounded-lg hover:bg-[#094356] transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add First Photo</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form.images.map((img, index) => {
                    const isPrimary = Boolean(img.is_primary);
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border transition-all relative ${
                          isPrimary
                            ? 'bg-amber-50/30 border-amber-300 ring-1 ring-amber-200'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Thumbnail preview */}
                          <div className="w-20 h-20 shrink-0 bg-slate-50 border border-slate-200 rounded-lg p-1.5 flex items-center justify-center overflow-hidden">
                            {img.image_url ? (
                              <img
                                src={img.image_url}
                                alt={img.alt_text || 'Product image'}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <ImageIcon size={20} className="text-slate-300" />
                            )}
                          </div>

                          {/* Image Meta & Controls */}
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              {isPrimary ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  <Star size={11} className="fill-amber-600 text-amber-600" />
                                  PRIMARY PACKSHOT
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryGalleryImage(index)}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-amber-700 transition-colors cursor-pointer"
                                >
                                  <Star size={12} />
                                  <span>Set as Primary</span>
                                </button>
                              )}

                              {/* Ordering & Delete */}
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => handleMoveGalleryImage(index, 'up')}
                                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                  title="Move Up"
                                >
                                  <ArrowUp size={13} />
                                </button>
                                <button
                                  type="button"
                                  disabled={index === form.images.length - 1}
                                  onClick={() => handleMoveGalleryImage(index, 'down')}
                                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                  title="Move Down"
                                >
                                  <ArrowDown size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryImage(index)}
                                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                                  title="Remove Photo"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>

                            {/* Image URL input */}
                            <div>
                              <TextInput
                                value={img.image_url}
                                onChange={(e) => handleUpdateGalleryImage(index, 'image_url', e.target.value)}
                                placeholder="Image URL (e.g. /assets/products/photo.jpg)"
                                className="text-[11px] py-1.5"
                              />
                            </div>

                            {/* Alt Text input */}
                            <div>
                              <TextInput
                                value={img.alt_text}
                                onChange={(e) => handleUpdateGalleryImage(index, 'alt_text', e.target.value)}
                                placeholder="Alt text / description for doctors..."
                                className="text-[11px] py-1.5"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </AdminCard>

          {/* Section 2: Structured Product Composition Ingredients */}
          <AdminCard
            title="Product Composition Ingredients"
            subtitle="Individual active ingredients, scientific extract subtitles, and measured strengths"
          >
            <RepeatableListEditor
              items={form.compositions || []}
              onChange={(items) => setForm((p) => ({ ...p, compositions: items }))}
              fields={[
                { key: 'ingredient_name', label: 'Ingredient / Active Name *', placeholder: 'e.g. Aflapin®, Calcium citrate maleate' },
                { key: 'ingredient_description', label: 'Scientific Subtitle / Extract Details', placeholder: 'e.g. Boswellia serrata gum resin extract' },
                { key: 'strength', label: 'Strength / Amount', placeholder: 'e.g. 100 mg, 1250 mg' },
                { key: 'role_description', label: 'Role Description (Optional)', placeholder: 'e.g. Standardized Boswellia extract specialized in joint comfort.' },
              ]}
              addLabel="Add Active Ingredient"
            />
          </AdminCard>

          {/* Section 3: Structured Clinical Benefits */}
          <AdminCard
            title="Product Benefits"
            subtitle="Clinical advantages and targeted therapeutic outcomes"
          >
            <RepeatableListEditor
              items={form.benefits || []}
              onChange={(items) => setForm((p) => ({ ...p, benefits: items }))}
              fields={[
                { key: 'title', label: 'Benefit Title *', placeholder: 'e.g. JOINT COMFORT, MOBILITY' },
                { key: 'description', label: 'Benefit Description *', placeholder: 'Supports formulation role in maintaining comfort during movement.', multiline: true },
              ]}
              addLabel="Add Benefit"
            />
          </AdminCard>

          {/* Section 4: Administration & Dosage Guidance */}
          <AdminCard
            title="Administration & Dosage"
            subtitle="Recommended usage instructions and physician guidance"
          >
            <div className="space-y-3">
              <div>
                <FieldLabel>Dosage Heading</FieldLabel>
                <TextInput
                  value={form.dosage?.heading || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      dosage: { ...p.dosage, heading: e.target.value },
                    }))
                  }
                  placeholder="e.g. How OneFLEXO should be taken."
                />
              </div>
              <div>
                <FieldLabel>Administration Instructions</FieldLabel>
                <TextArea
                  rows={2}
                  value={form.dosage?.description || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      dosage: { ...p.dosage, description: e.target.value },
                    }))
                  }
                  placeholder="e.g. Take 1 tablet once daily with or after a meal as prescribed by the doctor."
                />
              </div>
            </div>
          </AdminCard>

          {/* Section 5: Mechanism of Action */}
          <AdminCard
            title="Mechanism of Action"
            subtitle="Scientific pharmacokinetics and cellular pathways"
          >
            <RepeatableListEditor
              items={form.mechanisms || []}
              onChange={(items) => setForm((p) => ({ ...p, mechanisms: items }))}
              fields={[
                { key: 'title', label: 'Mechanism Step / Title *', placeholder: 'e.g. Primary Action, Target Pathway' },
                { key: 'description', label: 'Mechanism Details *', placeholder: 'Binds progesterone receptors and provides progestational effects...', multiline: true },
              ]}
              addLabel="Add Mechanism Point"
            />
          </AdminCard>

          {/* Section 6: Safety, Precautions & Contraindications */}
          <AdminCard
            title="Safety Information & Precautions"
            subtitle="Clinical warnings, patient contraindications, and storage recommendations"
          >
            <RepeatableListEditor
              items={form.safetySections || []}
              onChange={(items) => setForm((p) => ({ ...p, safetySections: items }))}
              fields={[
                { key: 'title', label: 'Safety Section Title *', placeholder: 'e.g. WHO SHOULD NOT USE THIS PRODUCT, STORAGE INSTRUCTIONS' },
                { key: 'description', label: 'Safety Content / Warnings *', placeholder: 'Individuals with known hypersensitivity should not consume...', multiline: true },
              ]}
              addLabel="Add Safety Point"
            />
          </AdminCard>

          {/* Section 7: SEO Meta & Search Engine Optimization */}
          <AdminCard
            title="Search Engine Optimization (SEO)"
            subtitle="Meta title and description for this product monograph"
          >
            <div className="space-y-3">
              <div>
                <FieldLabel>SEO Title</FieldLabel>
                <TextInput
                  value={form.seo_title}
                  onChange={set('seo_title')}
                  placeholder="e.g. OneFLEXO | Orthopaedics Portfolio | Onecore Pharma"
                />
              </div>
              <div>
                <FieldLabel>SEO Meta Description</FieldLabel>
                <TextArea
                  rows={2}
                  value={form.seo_description}
                  onChange={set('seo_description')}
                  placeholder="Clinical product monograph for OneFLEXO, its formulation, composition and joint health information..."
                />
              </div>
            </div>
          </AdminCard>

          {/* Section 8: External / Direct Product Link */}
          <AdminCard
            title="Product Action Link (Bottom of Product Page)"
            subtitle="Optional custom destination URL and button label displayed at the very end of this product monograph"
          >
            <div className="space-y-4">
              <div>
                <FieldLabel>Link URL / Destination</FieldLabel>
                <TextInput
                  value={form.link_url}
                  onChange={set('link_url')}
                  placeholder="e.g. https://example.com/order-product or /contact"
                />
                <span className="text-[11px] text-slate-500 mt-1.5 block">
                  Enter an external URL (e.g. <code>https://...</code>) or internal page (e.g. <code>/contact</code>). If provided, a direct action button will be rendered at the end of the product page.
                </span>
              </div>
              <div>
                <FieldLabel>Button / Link Label</FieldLabel>
                <TextInput
                  value={form.link_label}
                  onChange={set('link_label')}
                  placeholder="e.g. Buy Online / Order Product / Request Monograph (defaults to 'Learn More')"
                />
              </div>
            </div>
          </AdminCard>
        </div>
      )}

      {/* Media Selector Modal */}
      <MediaSelectorModal
        isOpen={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(url) => {
          if (mediaTarget === 'gallery') {
            setForm((prev) => {
              const currentImages = prev.images || [];
              const isFirst = currentImages.length === 0;
              const newImg = {
                image_url: url,
                alt_text: `${prev.brand_name || 'Product'} visual ${currentImages.length + 1}`,
                is_primary: isFirst ? 1 : 0,
                display_order: currentImages.length + 1,
              };
              return {
                ...prev,
                images: [...currentImages, newImg],
                ...(isFirst ? { packshot_url: url } : {}),
              };
            });
            showToast('success', 'Photo added to product gallery.');
          } else {
            // packshot selection
            setForm((prev) => {
              const currentImages = prev.images || [];
              const exists = currentImages.some((img) => img.image_url === url);
              let nextImages = currentImages.map((img) => ({
                ...img,
                is_primary: img.image_url === url ? 1 : 0,
              }));
              if (!exists) {
                nextImages = [
                  { image_url: url, alt_text: prev.brand_name || '', is_primary: 1, display_order: 1 },
                  ...nextImages.map((img, i) => ({ ...img, is_primary: 0, display_order: i + 2 })),
                ];
              }
              return { ...prev, packshot_url: url, images: nextImages };
            });
          }
          setMediaOpen(false);
        }}
      />

      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </AdminLayout>
  );
}
