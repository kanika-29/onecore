import React, { useState, useEffect } from 'react';
import { Search, Upload, X, Check, Image as ImageIcon, File, RotateCcw } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { assetUrl } from '../../utils/assetUrl';

/**
 * Standard brand default assets available for section resets & fallbacks
 */
const STANDARD_ASSETS = [
  { name: 'Hero Healthcare (Homepage Hero)', url: '/assets/hero-healthcare.jpg' },
  { name: 'About Facility (About Us Hero)', url: '/assets/about-facility.jpg' },
  { name: 'Quality Assurance (Quality Hero)', url: '/assets/quality.jpg' },
  { name: 'Manufacturing Operations', url: '/assets/pharma.jpg' },
  { name: 'Patients & Caregivers Hero', url: '/assets/patients-caregivers.jpg' },
  { name: 'Two Perspectives (Care & Science)', url: '/assets/two-perspectives.jpg' },
  { name: 'Healthcare Professionals (Consultation)', url: '/assets/healthcare-professionals.jpg' },
  { name: 'Treatment Journey (Care Beyond Clinic)', url: '/assets/treatment-journey.jpg' },
  { name: 'Contact Direct Helpline Desk', url: '/assets/contact-hero.jpg' },
  { name: 'General Medicine Division', url: '/assets/therapeutic-general-medicine.jpg' },
  { name: 'Orthopaedics Division (Ortheon)', url: '/assets/ortheon.jpg' },
  { name: 'Women’s Health Division', url: '/assets/therapeutic-womens-health.jpg' },
  { name: 'Paediatrics Division (Pediaplus)', url: '/assets/pediaplus.jpg' },
  { name: 'Neurology Division (Neurix)', url: '/assets/neurix.jpg' },
  { name: 'Ophthalmology Division (Eyerix)', url: '/assets/eyerix.jpg' },
  { name: 'Dermatology Division (Vellis)', url: '/assets/vellis.webp' },
  { name: 'ENT Division (Otira)', url: '/assets/otira.jpg' },
  { name: 'Oncology Division (Cytos)', url: '/assets/cytos.jpg' },
];

/**
 * In-place path sanitizer to guarantee clean, root-relative media paths
 */
const sanitizeMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const clean = url.replace(/^\/+/, '').replace(/^uploads\/uploads\//, 'uploads/');
  if (clean.startsWith('assets/')) {
    return `/${clean}`;
  }
  return clean.startsWith('uploads/') ? `/${clean}` : `/uploads/${clean}`;
};

/**
 * MediaSelectorModal — browse/upload and pick a media asset.
 * Supports Uploaded Library, Standard Website Assets, and Reset/Clear.
 */
export default function MediaSelectorModal({ isOpen, onSelect, onClose }) {
  const { token } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('uploads'); // 'uploads' | 'standards'
  const [mediaList, setMediaList] = useState([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSelected(null);
    setSearch('');
    setActiveTab('uploads');
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
      // silent
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
        const cleanPath = sanitizeMediaUrl(data.data.file_path || data.data.url || data.data.filename);
        const newAsset = {
          ...data.data,
          file_path: cleanPath,
          url: cleanPath,
          path: cleanPath,
        };
        setMediaList((prev) => [newAsset, ...prev]);
        setSelected(cleanPath);
        setActiveTab('uploads');
      }
    } catch {
      // silent
    } finally {
      setUploading(false);
    }
  };

  const handleApply = () => {
    if (selected === '') {
      onSelect('');
      onClose();
      return;
    }
    if (!selected) return;
    let formattedPath = sanitizeMediaUrl(selected);
    if (!formattedPath.startsWith('http://') && !formattedPath.startsWith('https://') && !formattedPath.startsWith('data:')) {
      if (!formattedPath.startsWith('/assets/')) {
        const cleanFilename = formattedPath.replace(/^\/+/, '').replace(/^uploads\//, '');
        formattedPath = `/uploads/${cleanFilename}`;
      }
    }
    onSelect(formattedPath);
    onClose();
  };

  const handleResetToDefault = () => {
    onSelect('');
    onClose();
  };

  const filteredUploads = mediaList.filter(
    (m) =>
      !search ||
      (m.original_name || m.original_filename || m.name || '')?.toLowerCase().includes(search.toLowerCase()) ||
      (m.filename || '')?.toLowerCase().includes(search.toLowerCase()) ||
      (m.alt_text || '')?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStandards = STANDARD_ASSETS.filter(
    (a) => !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.url.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FAFAFC]">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Select from Media Library</h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Choose an image from uploaded catalog or pick a standard website visual
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher + Actions */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-100 bg-slate-50/60 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('uploads')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'uploads'
                  ? 'bg-white text-[#1B365D] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Uploaded Library ({filteredUploads.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('standards')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'standards'
                  ? 'bg-white text-[#1B365D] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Default Website Assets ({filteredStandards.length})
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg font-medium transition-colors"
            title="Remove section image and use default fallback"
          >
            <RotateCcw size={12} />
            <span>Reset to Default</span>
          </button>
        </div>

        {/* Toolbar: Search + Direct Upload */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-slate-100 bg-white">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search images by name or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 pl-8 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0D5C75] focus:ring-1 focus:ring-[#0D5C75]"
            />
            <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>

          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B365D] hover:bg-[#152a48] text-white text-xs font-semibold rounded-lg cursor-pointer transition-all shrink-0 shadow-xs">
            <Upload size={13} />
            <span>{uploading ? 'Uploading...' : 'Upload New'}</span>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Grid of images */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {activeTab === 'uploads' ? (
            loading ? (
              <div className="py-16 text-center text-slate-400 text-xs font-medium">
                Loading media library...
              </div>
            ) : filteredUploads.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                <ImageIcon size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="font-medium text-slate-600">No uploaded assets found matching query.</p>
                <p className="text-[11px] text-slate-400 mt-1">Click "Upload New" above to upload images.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5">
                {filteredUploads.map((asset) => {
                  const rawPath = asset.url || asset.path || asset.file_path || asset.filename;
                  const finalUrl = sanitizeMediaUrl(rawPath);
                  const isSelected = selected === finalUrl;

                  return (
                    <div
                      className={`media-thumbnail-card relative group rounded-xl border-2 overflow-hidden aspect-square flex flex-col items-center justify-center p-1.5 transition-all text-left bg-slate-50 cursor-pointer ${
                        isSelected
                          ? 'border-[#1B365D] ring-2 ring-[#1B365D]/20 bg-blue-50/20'
                          : 'border-slate-200 hover:border-slate-400 hover:shadow-xs'
                      }`}
                      key={asset.id || asset.filename || finalUrl}
                      onClick={() => setSelected(finalUrl)}
                    >
                      <img
                        src={assetUrl(finalUrl)}
                        alt={asset.name || asset.filename || 'Media Asset'}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9' stroke='%23cbd5e1'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-family='sans-serif' font-size='10'%3EPreview 404%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <span className="media-asset-label absolute inset-x-0 bottom-0 bg-slate-900/80 px-1.5 py-1 text-[9px] text-white font-mono truncate">
                        {asset.original_filename || asset.name || asset.filename}
                      </span>

                      {/* Selected badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#1B365D] text-white rounded-full flex items-center justify-center shadow-md">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Standard Assets Tab */
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5">
              {filteredStandards.map((std) => {
                const isSelected = selected === std.url;

                return (
                  <div
                    className={`media-thumbnail-card relative group rounded-xl border-2 overflow-hidden aspect-square flex flex-col items-center justify-center p-1.5 transition-all text-left bg-slate-50 cursor-pointer ${
                      isSelected
                        ? 'border-[#1B365D] ring-2 ring-[#1B365D]/20 bg-blue-50/20'
                        : 'border-slate-200 hover:border-slate-400 hover:shadow-xs'
                    }`}
                    key={std.url}
                    onClick={() => setSelected(std.url)}
                  >
                    <img
                      src={assetUrl(std.url)}
                      alt={std.name}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/placeholder.png';
                      }}
                    />
                    <span className="media-asset-label absolute inset-x-0 bottom-0 bg-slate-900/80 px-1.5 py-1 text-[9px] text-white font-mono truncate">
                      {std.name}
                    </span>

                    {/* Selected badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#1B365D] text-white rounded-full flex items-center justify-center shadow-md">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-[#FAFAFC]">
          <div className="text-xs font-mono text-slate-500 truncate max-w-sm">
            {selected ? (
              <span className="text-slate-800 font-semibold">{selected}</span>
            ) : (
              'Click an asset above to select, or click "Reset to Default"'
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selected}
              onClick={handleApply}
              className="px-4 py-2 text-xs font-semibold bg-[#1B365D] hover:bg-[#152a48] text-white rounded-lg transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Apply Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
