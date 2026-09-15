import React, { useState, useEffect } from 'react';
import { Search, Upload, X, Check, Image as ImageIcon, File } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

/**
 * MediaSelectorModal — browse/upload and pick a media asset.
 * Props:
 *   isOpen: boolean
 *   onSelect(url: string): called with the selected file_path
 *   onClose(): dismiss without selecting
 */
export default function MediaSelectorModal({ isOpen, onSelect, onClose }) {
  const { token } = useAdminAuth();
  const [mediaList, setMediaList] = useState([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSelected(null);
    setSearch('');
    fetchMedia();
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMediaList(data.data || []);
    } catch {
      // silent — show empty state
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMediaList((prev) => [data.data, ...prev]);
        setSelected(data.data.file_path);
      }
    } catch {
      // silent
    } finally {
      setUploading(false);
    }
  };

  const filtered = mediaList.filter(
    (m) =>
      !search ||
      m.original_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.filename?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-3xl bg-[#0A1118] border border-brand-navy-light/50 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <div>
            <h3 className="text-white font-semibold text-base">Media Library</h3>
            <p className="text-brand-slate/70 text-xs mt-0.5">Select an existing asset or upload a new one</p>
          </div>
          <button onClick={onClose} className="text-brand-slate hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-white/5 shrink-0">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate/50" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-navy/60 border border-white/10 rounded-lg px-3 py-1.5 pl-9 text-xs text-white placeholder-brand-slate/40 focus:outline-none focus:border-brand-teal/50"
            />
          </div>
          <label className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-brand-teal hover:bg-brand-teal/90 text-white text-xs font-medium rounded-lg cursor-pointer transition-colors">
            <Upload size={13} />
            <span>{uploading ? 'Uploading...' : 'Upload'}</span>
            <input
              type="file"
              onChange={handleUpload}
              disabled={uploading}
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
            />
          </label>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-brand-slate/50 text-sm">
              <ImageIcon size={32} className="mb-2 opacity-30" />
              <span>No assets found</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map((media) => {
                const isSelected = selected === media.file_path;
                return (
                  <button
                    key={media.id}
                    onClick={() => setSelected(media.file_path)}
                    className={`relative group rounded-xl border overflow-hidden transition-all text-left ${
                      isSelected
                        ? 'border-brand-teal ring-2 ring-brand-teal/40'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="h-24 bg-brand-navy-dark/60 flex items-center justify-center overflow-hidden">
                      {media.mime_type?.startsWith('image/') ? (
                        <img
                          src={media.file_path}
                          alt={media.original_filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <File size={24} className="text-brand-slate/50" />
                      )}
                    </div>
                    <div className="px-2 py-1.5 bg-brand-navy border-t border-white/5">
                      <p className="text-[10px] text-white truncate font-medium">{media.original_filename || media.filename}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-brand-teal rounded-full flex items-center justify-center shadow">
                        <Check size={11} className="text-brand-navy" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 shrink-0 bg-brand-navy/40">
          {selected ? (
            <p className="text-xs text-brand-teal font-mono truncate max-w-xs">{selected}</p>
          ) : (
            <p className="text-xs text-brand-slate/50">No asset selected</p>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-brand-slate hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => selected && onSelect(selected)}
              disabled={!selected}
              className="px-4 py-2 text-sm font-medium bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Use Selected Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
