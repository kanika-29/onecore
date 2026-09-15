import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Save, Image as ImageIcon, ExternalLink } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import ToastNotification from '../../components/admin/ToastNotification';
import MediaSelectorModal from '../../components/admin/MediaSelectorModal';
import { useAdminAuth } from '../../context/AdminAuthContext';

const CATEGORIES = [
  'Corporate Update',
  'Research & Formulation',
  'Clinical Care',
  'Sustainability',
  'Regulatory',
  'Scientific Collaboration',
  'Community & Access',
];

function FieldLabel({ children, required }) {
  return (
    <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-slate/70 mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}

export default function AdminNewsEditor() {
  const { id } = useParams(); // 'new' or article id
  const navigate = useNavigate();
  const { token } = useAdminAuth();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [mediaOpen, setMediaOpen] = useState(false);

  const showToast = (type, message) => setToast({ type, message });

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Corporate Update',
    excerpt: '',
    content: '',
    featured_image_url: '',
    status: 'published',
    read_time: '',
  });

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80);
    setForm((prev) => ({ ...prev, title, ...(isNew ? { slug } : {}) }));
  };

  useEffect(() => {
    document.title = isNew ? 'New Article | Onecore Admin' : 'Edit Article | Onecore Admin';
    if (isNew) return;

    setLoading(true);
    fetch(`/api/news/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          const a = d.data;
          setForm({
            title: a.title || '',
            slug: a.slug || '',
            category: a.category || 'Corporate Update',
            excerpt: a.excerpt || '',
            content: a.content || '',
            featured_image_url: a.featured_image_url || '',
            status: a.status || 'published',
            read_time: a.read_time || '',
          });
        } else {
          showToast('error', 'Article not found.');
        }
      })
      .catch(() => showToast('error', 'Failed to load article.'))
      .finally(() => setLoading(false));
  }, [id, isNew, token]);

  const handleSave = async () => {
    if (!form.title.trim()) { showToast('error', 'Title is required.'); return; }
    if (!form.excerpt.trim()) { showToast('error', 'Excerpt is required.'); return; }

    setSaving(true);
    try {
      const url = isNew ? '/api/news' : `/api/news/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = { ...form };
      if (isNew && !payload.slug) {
        payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 80);
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', isNew ? 'Article created successfully.' : 'Article saved successfully.');
        if (isNew && data.data?.id) {
          setTimeout(() => navigate(`/admin/news/${data.data.id}`), 1500);
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
      <AdminLayout title="Article Editor" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isNew ? 'New Article' : `Editing: ${form.title || 'Untitled'}`}
      subtitle={isNew ? 'Write a new corporate update or press release' : `Status: ${form.status} • ${form.category}`}
    >
      {/* Back */}
      <div className="flex items-center justify-between">
        <Link to="/admin/news" className="flex items-center gap-2 text-xs text-brand-slate hover:text-white transition-colors">
          <ChevronLeft size={14} />
          Back to News
        </Link>
        {!isNew && (
          <a
            href="/news"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-brand-teal hover:underline"
          >
            <ExternalLink size={13} />
            View News Page
          </a>
        )}
      </div>

      {/* Core Details */}
      <AdminCard title="Article Details" subtitle="Title, category, status, and publication settings">
        <div className="space-y-4">
          <div>
            <FieldLabel required>Article Title</FieldLabel>
            <input
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              placeholder="Enter article headline..."
              className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FieldLabel>URL Slug</FieldLabel>
              <input
                type="text"
                value={form.slug}
                onChange={set('slug')}
                placeholder="auto-generated"
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
              />
            </div>
            <div>
              <FieldLabel>Category</FieldLabel>
              <select
                value={form.category}
                onChange={set('category')}
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
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
              </select>
            </div>
          </div>

          <div>
            <FieldLabel required>Excerpt / Summary</FieldLabel>
            <textarea
              value={form.excerpt}
              onChange={set('excerpt')}
              rows={3}
              placeholder="Brief 1–2 sentence summary shown in news listings..."
              className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50 resize-y"
            />
          </div>

          <div>
            <FieldLabel>Read Time</FieldLabel>
            <input
              type="text"
              value={form.read_time}
              onChange={set('read_time')}
              placeholder="e.g. 4 min read"
              className="w-full max-w-xs bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
            />
          </div>
        </div>
      </AdminCard>

      {/* Featured Image */}
      <AdminCard title="Featured Image" subtitle="Hero image displayed on the news listing card">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <FieldLabel>Image URL or Path</FieldLabel>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.featured_image_url}
                onChange={set('featured_image_url')}
                placeholder="/assets/article-image.jpg"
                className="flex-1 bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50"
              />
              <button
                type="button"
                onClick={() => setMediaOpen(true)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-brand-navy border border-white/10 hover:border-brand-teal/40 rounded-lg text-xs text-brand-slate hover:text-white transition-all"
              >
                <ImageIcon size={13} />
                Library
              </button>
            </div>
          </div>
          {form.featured_image_url && (
            <div className="w-32 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0">
              <img src={form.featured_image_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </AdminCard>

      {/* Full Content */}
      <AdminCard title="Full Article Content" subtitle="Full article body. Supports plain text or HTML markup.">
        <FieldLabel>Article Body</FieldLabel>
        <textarea
          value={form.content}
          onChange={set('content')}
          rows={16}
          placeholder="Write the full article content here. HTML tags are supported for formatting."
          className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/90 placeholder-brand-slate/30 focus:outline-none focus:border-brand-teal/50 resize-y font-mono leading-relaxed"
        />
        <p className="text-[10px] text-brand-slate/40 mt-2 font-mono">
          {(form.content || '').length.toLocaleString()} characters
        </p>
      </AdminCard>

      {/* Save Bar */}
      <div className="sticky bottom-4 z-20">
        <div className="bg-brand-navy/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between shadow-xl">
          <div className="text-xs text-brand-slate/70">
            {isNew ? 'New article will be created' : `Editing: ${form.title}`}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl transition-all disabled:opacity-60 shadow-lg"
          >
            <Save size={15} />
            {saving ? 'Saving...' : isNew ? 'Publish Article' : 'Save Changes'}
          </button>
        </div>
      </div>

      <MediaSelectorModal
        isOpen={mediaOpen}
        onSelect={(url) => { setForm((p) => ({ ...p, featured_image_url: url })); setMediaOpen(false); }}
        onClose={() => setMediaOpen(false)}
      />

      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </AdminLayout>
  );
}
