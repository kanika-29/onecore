import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  ExternalLink,
  File,
  CheckCircle2,
  X,
  Search,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminMedia() {
  const { token } = useAdminAuth();
  const [mediaList, setMediaList] = useState([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    document.title = 'Media Library | Onecore Admin';
    fetchMedia();
  }, [token]);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setMediaList(data.data);
        }
      }
    } catch {
      // Keep empty or current
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({ type: 'success', message: 'Asset uploaded to server successfully.' });
        fetchMedia();
      } else {
        setNotification({ type: 'error', message: data.message || 'Upload failed.' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const handleDeleteMedia = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media file?')) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({ type: 'success', message: 'Asset removed from library.' });
        setMediaList((prev) => prev.filter((m) => m.id !== id));
        if (previewItem?.id === id) setPreviewItem(null);
      } else {
        setNotification({ type: 'error', message: data.message || 'Delete failed.' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const filtered = mediaList.filter(
    (m) =>
      !search ||
      (m.original_name || m.original_filename || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.filename || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Media Asset Library"
      subtitle="Upload, catalog, and manage website images, product packshots, and documentation assets"
    >
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      <AdminCard
        title={`Uploaded Assets (${filtered.length})`}
        subtitle="Public media files stored in MySQL and local upload storage"
        action={
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0D5C75] focus:ring-1 focus:ring-[#0D5C75]"
              />
              <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>
            <label className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1B365D] hover:bg-[#152a48] text-white text-xs font-semibold rounded-lg cursor-pointer transition-all shadow-xs">
              <Upload size={13} />
              <span>{uploading ? 'Uploading...' : 'Upload Asset'}</span>
              <input
                type="file"
                accept="image/*,video/*,.pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <ImageIcon size={36} className="mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700">No media assets cataloged yet.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Click "Upload Asset" above to add product packshots, photos, or documents.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((item) => {
              const filePath = item.file_path || `/uploads/${item.filename}`;
              const isImg = item.mime_type ? item.mime_type.startsWith('image/') : true;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-400 hover:shadow-xs transition-all group flex flex-col justify-between"
                >
                  <div
                    className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden relative cursor-pointer"
                    onClick={() => setPreviewItem(item)}
                  >
                    {isImg ? (
                      <img
                        src={filePath}
                        alt={item.alt_text || item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9' stroke='%23cbd5e1'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-family='sans-serif' font-size='10'%3EPreview 404%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <File size={36} className="text-slate-400" />
                    )}
                  </div>

                  <div className="p-3 border-t border-slate-100 bg-[#FAFAFC]">
                    <p className="text-xs font-semibold text-slate-800 truncate" title={item.original_name || item.filename}>
                      {item.original_name || item.filename}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                      {filePath}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-mono text-slate-500">
                        {item.size_bytes ? `${Math.round(item.size_bytes / 1024)} KB` : 'Asset'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-slate-800 rounded"
                          title="Open URL"
                        >
                          <ExternalLink size={13} />
                        </a>
                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete Asset"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
    </AdminLayout>
  );
}
