import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Save,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Edit2,
  X,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import ToastNotification from '../../components/admin/ToastNotification';
import ConfirmModal from '../../components/admin/ConfirmModal';
import MediaSelectorModal from '../../components/admin/MediaSelectorModal';
import { useAdminAuth } from '../../context/AdminAuthContext';

// ─── Inline Repeatable Items Manager ──────────────────────────────────────────
function SectionItemsManager({ items, onChange, onOpenMedia }) {
  const [itemList, setItemList] = useState(items || []);
  const [editingItemIdx, setEditingItemIdx] = useState(null);

  useEffect(() => {
    setItemList(items || []);
  }, [items]);

  const updateItems = (newList) => {
    setItemList(newList);
    onChange(newList);
  };

  const handleAddItem = () => {
    const newItem = {
      title: 'New Item',
      desc: '',
      description: '',
      eyebrow: '',
      stat: '',
      num: String(itemList.length + 1).padStart(2, '0'),
      cta_text: '',
      cta_url: '',
      image: '',
    };
    const updated = [...itemList, newItem];
    updateItems(updated);
    setEditingItemIdx(updated.length - 1);
  };

  const handleRemoveItem = (index) => {
    const updated = itemList.filter((_, i) => i !== index);
    updateItems(updated);
    if (editingItemIdx === index) setEditingItemIdx(null);
    else if (editingItemIdx > index) setEditingItemIdx(editingItemIdx - 1);
  };

  const handleMoveItem = (index, direction) => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= itemList.length) return;
    const updated = [...itemList];
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    updateItems(updated);
    if (editingItemIdx === index) setEditingItemIdx(swapIndex);
    else if (editingItemIdx === swapIndex) setEditingItemIdx(index);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = itemList.map((item, i) => {
      if (i !== index) return item;
      return { ...item, [field]: value };
    });
    updateItems(updated);
  };

  return (
    <div className="space-y-3 pt-3 border-t border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-brand-teal" />
          <label className="text-xs font-semibold uppercase tracking-wider text-brand-teal">
            Repeatable Content / Cards / Steps ({itemList.length})
          </label>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-brand-teal/20 hover:bg-brand-teal/30 text-brand-teal border border-brand-teal/30 rounded-lg transition-all"
        >
          <Plus size={12} />
          Add Item / Card
        </button>
      </div>

      {itemList.length === 0 ? (
        <p className="text-[11px] text-brand-slate/50 italic py-2">
          No repeatable items configured for this section. Click "Add Item / Card" to create cards, pillars, or steps.
        </p>
      ) : (
        <div className="space-y-2">
          {itemList.map((item, idx) => {
            const isEditing = editingItemIdx === idx;
            const itemLabel = item.title || item.heading || item.name || item.stat || `Item #${idx + 1}`;
            const itemSub = item.eyebrow || item.stat || item.num || item.channel || item.stage || '';
            const itemDesc = item.desc || item.description || item.text || item.body || item.detail || '';

            return (
              <div
                key={idx}
                className="bg-brand-navy/80 border border-white/10 rounded-lg overflow-hidden transition-all"
              >
                {/* Item Summary Bar */}
                <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02]">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveItem(idx, 'up')}
                        disabled={idx === 0}
                        className="text-brand-slate/40 hover:text-white disabled:opacity-20 transition-colors"
                      >
                        <ChevronUp size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveItem(idx, 'down')}
                        disabled={idx === itemList.length - 1}
                        className="text-brand-slate/40 hover:text-white disabled:opacity-20 transition-colors"
                      >
                        <ChevronDown size={11} />
                      </button>
                    </div>

                    <span className="w-5 h-5 rounded bg-brand-teal/10 text-brand-teal text-[10px] font-mono flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-white truncate">{itemLabel}</span>
                        {itemSub && (
                          <span className="text-[10px] font-mono text-brand-teal/70 uppercase px-1.5 py-0.2 bg-brand-teal/10 rounded">
                            {itemSub}
                          </span>
                        )}
                      </div>
                      {itemDesc && (
                        <p className="text-[11px] text-brand-slate/60 truncate">{itemDesc}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => setEditingItemIdx(isEditing ? null : idx)}
                      className={`p-1.5 rounded text-xs transition-colors ${
                        isEditing ? 'bg-brand-teal/20 text-brand-teal' : 'text-brand-slate/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isEditing ? <X size={13} /> : <Edit2 size={13} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 rounded text-brand-slate/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Inline Item Details Editor */}
                {isEditing && (
                  <div className="p-3.5 bg-black/20 border-t border-white/5 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Title */}
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
                          Item Title / Heading
                        </label>
                        <input
                          type="text"
                          value={item.title || item.heading || item.name || ''}
                          onChange={(e) => {
                            handleFieldChange(idx, 'title', e.target.value);
                            if (item.heading) handleFieldChange(idx, 'heading', e.target.value);
                          }}
                          placeholder="e.g. Clinical Relevance"
                          className="w-full bg-brand-navy border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
                        />
                      </div>

                      {/* Eyebrow / Subtitle / Number / Stat */}
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
                          Eyebrow / Number / Stat Label
                        </label>
                        <input
                          type="text"
                          value={item.eyebrow || item.stat || item.num || item.channel || item.stage || ''}
                          onChange={(e) => {
                            handleFieldChange(idx, 'eyebrow', e.target.value);
                            if (item.stat !== undefined) handleFieldChange(idx, 'stat', e.target.value);
                            if (item.num !== undefined) handleFieldChange(idx, 'num', e.target.value);
                            if (item.channel !== undefined) handleFieldChange(idx, 'channel', e.target.value);
                          }}
                          placeholder="e.g. 01, 09+, RESPONSIBLE OPERATIONS"
                          className="w-full bg-brand-navy border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
                        />
                      </div>

                      {/* Description / Detail */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
                          Description / Text / Body
                        </label>
                        <textarea
                          rows={2}
                          value={item.desc || item.description || item.text || item.body || ''}
                          onChange={(e) => {
                            handleFieldChange(idx, 'desc', e.target.value);
                            handleFieldChange(idx, 'description', e.target.value);
                            handleFieldChange(idx, 'text', e.target.value);
                          }}
                          placeholder="Item descriptive summary..."
                          className="w-full bg-brand-navy border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50 resize-y"
                        />
                      </div>

                      {/* Detail / Secondary text (optional) */}
                      {(item.detail !== undefined || item.footer !== undefined) && (
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
                            Secondary Detail / Footer Note
                          </label>
                          <input
                            type="text"
                            value={item.detail || item.footer || ''}
                            onChange={(e) => {
                              if (item.detail !== undefined) handleFieldChange(idx, 'detail', e.target.value);
                              if (item.footer !== undefined) handleFieldChange(idx, 'footer', e.target.value);
                            }}
                            placeholder="Additional nuance or badge text"
                            className="w-full bg-brand-navy border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
                          />
                        </div>
                      )}

                      {/* CTA Text & Link (optional) */}
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
                          Item Button / Link Text
                        </label>
                        <input
                          type="text"
                          value={item.cta_text || ''}
                          onChange={(e) => handleFieldChange(idx, 'cta_text', e.target.value)}
                          placeholder="e.g. Learn More"
                          className="w-full bg-brand-navy border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
                          Item Link URL / Target
                        </label>
                        <input
                          type="text"
                          value={item.cta_url || item.value || ''}
                          onChange={(e) => {
                            handleFieldChange(idx, 'cta_url', e.target.value);
                            if (item.value !== undefined) handleFieldChange(idx, 'value', e.target.value);
                          }}
                          placeholder="/page or #target or mailto:..."
                          className="w-full bg-brand-navy border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
                        />
                      </div>

                      {/* Item Image (if used) */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
                          Item Image URL (Optional)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.image || item.image_url || ''}
                            onChange={(e) => {
                              handleFieldChange(idx, 'image', e.target.value);
                              handleFieldChange(idx, 'image_url', e.target.value);
                            }}
                            placeholder="/assets/image.jpg"
                            className="flex-1 bg-brand-navy border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              onOpenMedia((url) => {
                                handleFieldChange(idx, 'image', url);
                                handleFieldChange(idx, 'image_url', url);
                              })
                            }
                            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-brand-navy border border-white/10 hover:border-brand-teal/40 rounded-lg text-xs text-brand-slate hover:text-white transition-all"
                          >
                            <ImageIcon size={12} />
                            <span>Media</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Inline Section Editor Panel ──────────────────────────────────────────────
function SectionEditorPanel({ section, onSave, onCancel, onOpenMedia }) {
  let initialItems = [];
  if (section.items_json) {
    try {
      initialItems = typeof section.items_json === 'string'
        ? JSON.parse(section.items_json)
        : section.items_json;
    } catch {
      initialItems = [];
    }
  }

  const [form, setForm] = useState({
    eyebrow: section.eyebrow || '',
    heading: section.heading || section.title || '',
    subheading: section.subheading || section.subtitle || '',
    body: section.body || '',
    cta_text: section.cta_text || '',
    cta_url: section.cta_url || '',
    secondary_cta_text: section.secondary_cta_text || '',
    secondary_cta_url: section.secondary_cta_url || '',
    image_url: section.image_url || '',
    is_active: section.is_active !== 0,
    items_json: JSON.stringify(initialItems),
  });

  const [parsedItems, setParsedItems] = useState(initialItems);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleItemsChange = (newItems) => {
    setParsedItems(newItems);
    setForm((prev) => ({ ...prev, items_json: JSON.stringify(newItems) }));
  };

  const handleSave = () => {
    onSave({
      ...form,
      items_json: JSON.stringify(parsedItems),
    });
  };

  return (
    <div className="bg-brand-navy-dark/70 border border-brand-teal/30 rounded-xl p-5 space-y-5 mt-2 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-brand-teal" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Edit Section: <strong className="text-brand-teal font-mono">{section.section_key}</strong>
          </span>
        </div>
        <span className="text-[10px] font-mono text-brand-slate/60 uppercase bg-white/5 px-2 py-0.5 rounded">
          Type: {section.section_type || 'editorial'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Eyebrow */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
            Eyebrow Label
          </label>
          <input
            type="text"
            value={form.eyebrow}
            onChange={set('eyebrow')}
            placeholder="e.g. ABOUT ONECORE"
            className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
          />
        </div>

        {/* Heading */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
            Heading / Title
          </label>
          <input
            type="text"
            value={form.heading}
            onChange={set('heading')}
            placeholder="Main section heading"
            className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
          />
        </div>

        {/* Subheading */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
            Subheading / Subtitle
          </label>
          <input
            type="text"
            value={form.subheading}
            onChange={set('subheading')}
            placeholder="Subtitle or additional contextual tagline"
            className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
          />
        </div>

        {/* Body */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
            Body / Paragraph Text
          </label>
          <textarea
            value={form.body}
            onChange={set('body')}
            rows={4}
            placeholder="Section editorial copy..."
            className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50 resize-y"
          />
        </div>

        {/* Primary CTA */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
            Primary CTA Button Label
          </label>
          <input
            type="text"
            value={form.cta_text}
            onChange={set('cta_text')}
            placeholder="e.g. Explore Areas of Care"
            className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
            Primary CTA Link / URL
          </label>
          <input
            type="text"
            value={form.cta_url}
            onChange={set('cta_url')}
            placeholder="/about or #principles"
            className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
          />
        </div>

        {/* Secondary CTA */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
            Secondary CTA Button Label
          </label>
          <input
            type="text"
            value={form.secondary_cta_text}
            onChange={set('secondary_cta_text')}
            placeholder="e.g. Connect With Us"
            className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
            Secondary CTA Link / URL
          </label>
          <input
            type="text"
            value={form.secondary_cta_url}
            onChange={set('secondary_cta_url')}
            placeholder="/contact or #patient-safety"
            className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
          />
        </div>

        {/* Section Image */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">
            Section Image / Visual Asset URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={form.image_url}
              onChange={set('image_url')}
              placeholder="/assets/image.jpg"
              className="flex-1 bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
            />
            <button
              type="button"
              onClick={() => onOpenMedia((url) => setForm((prev) => ({ ...prev, image_url: url })))}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-brand-teal/10 hover:bg-brand-teal/20 border border-brand-teal/30 rounded-lg text-xs text-brand-teal transition-all"
            >
              <ImageIcon size={13} />
              <span>Media Library</span>
            </button>
            {form.image_url && (
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, image_url: '' }))}
                className="shrink-0 px-2.5 py-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-lg text-xs text-brand-slate hover:text-red-400 transition-all"
                title="Clear image"
              >
                <X size={13} />
              </button>
            )}
          </div>
          {form.image_url && (
            <div className="mt-2.5 flex items-center gap-3">
              <div className="h-20 w-32 rounded-lg overflow-hidden border border-white/15 bg-brand-navy-dark shadow">
                <img src={form.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="text-[11px] text-brand-slate/60 font-mono truncate">{form.image_url}</span>
            </div>
          )}
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-3 md:col-span-2 pt-1">
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-brand-teal' : 'bg-white/10'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : ''}`}
            />
          </button>
          <span className="text-xs text-brand-slate">Section Active & Visible on Public Website</span>
        </div>
      </div>

      {/* Repeatable Content Items Manager */}
      <SectionItemsManager
        items={parsedItems}
        onChange={handleItemsChange}
        onOpenMedia={onOpenMedia}
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs text-brand-slate hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
        >
          <X size={13} />
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg transition-all shadow-md"
        >
          <Save size={13} />
          Save Section Changes
        </button>
      </div>
    </div>
  );
}

// ─── Add Section Modal ──────────────────────────────────────────────────────
function AddSectionModal({ isOpen, onAdd, onClose }) {
  const [form, setForm] = useState({ section_key: '', section_type: 'editorial', heading: '', eyebrow: '' });
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0A1118] border border-brand-navy-light/50 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Add New Section</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">Section Key (unique ID)</label>
            <input
              type="text"
              value={form.section_key}
              onChange={(e) => setForm((p) => ({ ...p, section_key: e.target.value }))}
              placeholder="e.g. hero, quality_intro"
              className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">Section Type</label>
            <select
              value={form.section_type}
              onChange={(e) => setForm((p) => ({ ...p, section_type: e.target.value }))}
              className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
            >
              <option value="hero">Hero</option>
              <option value="editorial">Editorial / Text</option>
              <option value="editorial_split">Editorial Split / Visual</option>
              <option value="cards_grid">Cards Grid</option>
              <option value="timeline_list">Timeline / Steps List</option>
              <option value="cta_banner">CTA Banner</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">Heading</label>
            <input
              type="text"
              value={form.heading}
              onChange={(e) => setForm((p) => ({ ...p, heading: e.target.value }))}
              placeholder="Section heading"
              className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1">Eyebrow</label>
            <input
              type="text"
              value={form.eyebrow}
              onChange={(e) => setForm((p) => ({ ...p, eyebrow: e.target.value }))}
              placeholder="Optional eyebrow label"
              className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2 text-xs text-brand-slate hover:text-white border border-white/10 rounded-lg transition-all">Cancel</button>
          <button
            onClick={() => { if (form.section_key.trim()) { onAdd(form); setForm({ section_key: '', section_type: 'editorial', heading: '', eyebrow: '' }); } }}
            className="px-4 py-2 text-xs font-medium bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg transition-all"
          >
            Add Section
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminPageEditor() {
  const { pageKey } = useParams();
  const navigate = useNavigate();
  const { token } = useAdminAuth();

  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [mediaCb, setMediaCb] = useState(null); // callback for media selection
  const [pageMeta, setPageMeta] = useState({ title: '', seo_title: '', seo_description: '' });
  const [savingMeta, setSavingMeta] = useState(false);

  const showToast = (type, message) => setToast({ type, message });

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pages/${pageKey}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPage(data.data);
        setSections(data.data.sections || []);
        setPageMeta({
          title: data.data.title || '',
          seo_title: data.data.seo_title || '',
          seo_description: data.data.seo_description || '',
        });
      }
    } catch {
      showToast('error', 'Failed to load page data.');
    } finally {
      setLoading(false);
    }
  }, [pageKey, token]);

  useEffect(() => {
    document.title = `Page Editor | Onecore Admin`;
    fetchPage();
  }, [fetchPage]);

  // ── Section CRUD ──────────────────────────────────────────────────────────
  const handleSaveSection = async (sectionId, form) => {
    try {
      const res = await fetch(`/api/pages/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, ...form } : s)));
        setEditingId(null);
        showToast('success', 'Section saved successfully.');
      } else {
        showToast('error', data.message || 'Save failed.');
      }
    } catch {
      showToast('error', 'Network error. Please try again.');
    }
  };

  const handleToggleActive = async (section) => {
    try {
      const newActive = section.is_active === 0 ? 1 : 0;
      const res = await fetch(`/api/pages/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: newActive }),
      });
      const data = await res.json();
      if (data.success) {
        setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, is_active: newActive } : s)));
      }
    } catch {
      showToast('error', 'Toggle failed.');
    }
  };

  const handleDeleteSection = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/pages/sections/${deleteTarget}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSections((prev) => prev.filter((s) => s.id !== deleteTarget));
        showToast('success', 'Section deleted.');
      } else {
        showToast('error', data.message || 'Delete failed.');
      }
    } catch {
      showToast('error', 'Network error.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleAddSection = async (form) => {
    try {
      const res = await fetch(`/api/pages/${page.id}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setAddModal(false);
        fetchPage();
        showToast('success', 'New section added.');
      } else {
        showToast('error', data.message || 'Failed to add section.');
      }
    } catch {
      showToast('error', 'Network error.');
    }
  };

  const handleMoveSection = async (index, direction) => {
    const newSections = [...sections];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSections.length) return;
    [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];
    setSections(newSections);
    try {
      await fetch(`/api/pages/${page.id}/reorder-sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderedIds: newSections.map((s) => s.id) }),
      });
    } catch {
      showToast('error', 'Reorder save failed.');
    }
  };

  const handleSaveMeta = async () => {
    setSavingMeta(true);
    try {
      const res = await fetch(`/api/pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(pageMeta),
      });
      const data = await res.json();
      if (data.success) showToast('success', 'Page metadata saved.');
      else showToast('error', data.message || 'Save failed.');
    } catch {
      showToast('error', 'Network error.');
    } finally {
      setSavingMeta(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout title="Page Editor" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  if (!page) {
    return (
      <AdminLayout title="Page Editor" subtitle="Page not found">
        <div className="text-center py-20 text-brand-slate/50">
          <FileText size={48} className="mx-auto mb-3 opacity-20" />
          <p>Page "{pageKey}" not found in database.</p>
          <Link to="/admin/pages" className="mt-4 inline-block text-brand-teal text-sm hover:underline">← Back to Pages</Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Editing: ${page.title}`}
      subtitle={`${sections.length} section${sections.length !== 1 ? 's' : ''} • ${page.slug || page.page_key}`}
    >
      {/* Back + Preview */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/pages"
          className="flex items-center gap-2 text-xs text-brand-slate hover:text-white transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Pages
        </Link>
        <a
          href={page.slug || `/${page.page_key?.replace(/_/g, '-')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-brand-teal hover:underline"
        >
          <ExternalLink size={13} />
          View Live Page
        </a>
      </div>

      {/* Page Metadata Card */}
      <AdminCard title="Page Metadata & SEO" subtitle="Controls title, route, and search engine meta tags">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1.5">Page Title</label>
            <input
              type="text"
              value={pageMeta.title}
              onChange={(e) => setPageMeta((p) => ({ ...p, title: e.target.value }))}
              className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1.5">SEO Title Tag</label>
            <input
              type="text"
              value={pageMeta.seo_title}
              onChange={(e) => setPageMeta((p) => ({ ...p, seo_title: e.target.value }))}
              placeholder="Defaults to Page Title"
              className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1.5">SEO Meta Description</label>
            <input
              type="text"
              value={pageMeta.seo_description}
              onChange={(e) => setPageMeta((p) => ({ ...p, seo_description: e.target.value }))}
              placeholder="Brief page summary for search engines"
              className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveMeta}
            disabled={savingMeta}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg transition-all disabled:opacity-60"
          >
            <Save size={13} />
            {savingMeta ? 'Saving...' : 'Save Metadata'}
          </button>
        </div>
      </AdminCard>

      {/* Sections */}
      <AdminCard
        title="Page Sections"
        subtitle={`${sections.filter((s) => s.is_active !== 0).length} active • Reorder, customize text, and manage items`}
        action={
          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg transition-all"
          >
            <Plus size={13} />
            Add Section
          </button>
        }
      >
        {sections.length === 0 ? (
          <div className="text-center py-12 text-brand-slate/40 text-sm">
            <FileText size={36} className="mx-auto mb-2 opacity-20" />
            <p>No sections yet. Add the first section to start building this page.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section, idx) => {
              let itemCount = 0;
              if (section.items_json) {
                try {
                  const itms = typeof section.items_json === 'string'
                    ? JSON.parse(section.items_json)
                    : section.items_json;
                  itemCount = Array.isArray(itms) ? itms.length : 0;
                } catch {
                  itemCount = 0;
                }
              }

              return (
                <div key={section.id}>
                  {/* Section Row */}
                  <div
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all ${
                      section.is_active === 0
                        ? 'border-white/5 bg-brand-navy-dark/30 opacity-60'
                        : 'border-white/10 bg-brand-navy hover:border-white/20'
                    }`}
                  >
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        onClick={() => handleMoveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="text-brand-slate/40 hover:text-white disabled:opacity-20 transition-colors"
                      >
                        <ChevronUp size={13} />
                      </button>
                      <button
                        onClick={() => handleMoveSection(idx, 'down')}
                        disabled={idx === sections.length - 1}
                        className="text-brand-slate/40 hover:text-white disabled:opacity-20 transition-colors"
                      >
                        <ChevronDown size={13} />
                      </button>
                    </div>

                    <GripVertical size={14} className="text-brand-slate/20 shrink-0" />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-white">{section.heading || section.title || '(No heading)'}</span>
                        {section.eyebrow && (
                          <span className="text-[10px] font-mono text-brand-teal/70 uppercase">{section.eyebrow}</span>
                        )}
                        <span className="text-[10px] font-mono text-brand-slate/40 bg-white/5 px-1.5 py-0.5 rounded">
                          {section.section_key}
                        </span>
                        {itemCount > 0 && (
                          <span className="text-[10px] font-mono text-brand-teal bg-brand-teal/10 px-1.5 py-0.5 rounded border border-brand-teal/20">
                            {itemCount} item{itemCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      {section.body && (
                        <p className="text-[11px] text-brand-slate/60 mt-0.5 truncate">{section.body}</p>
                      )}
                    </div>

                    {/* Image preview */}
                    {section.image_url && (
                      <div className="w-10 h-10 rounded-md overflow-hidden border border-white/10 shrink-0">
                        <img src={section.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleActive(section)}
                        title={section.is_active === 0 ? 'Activate section' : 'Deactivate section'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          section.is_active === 0
                            ? 'text-brand-slate/40 hover:text-white hover:bg-white/5'
                            : 'text-brand-teal/80 hover:text-brand-teal hover:bg-brand-teal/5'
                        }`}
                      >
                        {section.is_active === 0 ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => setEditingId(editingId === section.id ? null : section.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          editingId === section.id
                            ? 'text-white bg-brand-teal/20'
                            : 'text-brand-slate/70 hover:text-white hover:bg-white/5'
                        }`}
                        title="Edit Section Content & Items"
                      >
                        {editingId === section.id ? <X size={14} /> : <Edit2 size={14} />}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(section.id)}
                        className="p-1.5 rounded-lg text-brand-slate/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Section"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Inline Editor */}
                  {editingId === section.id && (
                    <SectionEditorPanel
                      key={`edit-${section.id}`}
                      section={section}
                      onSave={(form) => handleSaveSection(section.id, form)}
                      onCancel={() => setEditingId(null)}
                      onOpenMedia={(cb) => setMediaCb(() => cb)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>

      {/* Modals */}
      <AddSectionModal
        isOpen={addModal}
        onAdd={handleAddSection}
        onClose={() => setAddModal(false)}
      />

      <MediaSelectorModal
        isOpen={!!mediaCb}
        onSelect={(url) => { mediaCb && mediaCb(url); setMediaCb(null); }}
        onClose={() => setMediaCb(null)}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Section"
        message="This section and all its content will be permanently removed. This cannot be undone."
        confirmLabel="Delete Section"
        onConfirm={handleDeleteSection}
        onCancel={() => setDeleteTarget(null)}
        dangerous
      />

      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </AdminLayout>
  );
}
