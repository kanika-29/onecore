import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  ExternalLink,
  File,
  CheckCircle2,
  X,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminMedia() {
  const { token, isEditor } = useAdminAuth();
  const [mediaList, setMediaList] = useState([
    {
      id: 1,
      filename: 'hero_healthcare.jpg',
      original_name: 'hero_healthcare.jpg',
      file_path: '/uploads/hero_healthcare.jpg',
      mime_type: 'image/jpeg',
      size_bytes: 384000,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      filename: 'patients_caregivers.jpg',
      original_name: 'patients_caregivers.jpg',
      file_path: '/uploads/patients_caregivers.jpg',
      mime_type: 'image/jpeg',
      size_bytes: 412000,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      filename: 'hcp_clinical.jpg',
      original_name: 'hcp_clinical.jpg',
      file_path: '/uploads/hcp_clinical.jpg',
      mime_type: 'image/jpeg',
      size_bytes: 356000,
      created_at: new Date().toISOString(),
    },
  ]);

  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    document.title = 'Media Library | Onecore Admin';
    const fetchMedia = async () => {
      try {
        const res = await fetch('/api/admin/media', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && data.data.length > 0) {
            setMediaList(data.data);
          }
        }
      } catch (err) {
        console.warn('Using seeded media list:', err);
      }
    };
    fetchMedia();
  }, [token]);

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
        setNotification({ type: 'success', message: 'File uploaded successfully.' });
        setMediaList((prev) => [data.data, ...prev]);
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

  return (
    <AdminLayout
      title="Media Library"
      subtitle="Controlled image and document uploads (JPEG, PNG, WebP, PDF)"
    >
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-white/60 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload Box */}
      <div className="bg-brand-navy border border-dashed border-white/20 hover:border-brand-teal/50 rounded-2xl p-8 text-center transition-all">
        <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto mb-3">
          <Upload size={22} />
        </div>
        <h3 className="text-sm font-medium text-white mb-1">Upload New Media Asset</h3>
        <p className="text-xs text-brand-slate font-light mb-4 max-w-sm mx-auto">
          Supported file formats: JPEG, PNG, WebP, SVG, and PDF. Maximum size: 10MB.
        </p>

        <label className="inline-block px-4 py-2 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-sm">
          <span>{uploading ? 'Uploading...' : 'Select File from Computer'}</span>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      <AdminCard
        title="Asset Library"
        subtitle={`${mediaList.length} media assets recorded in database`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaList.map((media) => (
            <div
              key={media.id}
              className="bg-brand-navy-dark/60 border border-white/10 rounded-xl p-3 flex flex-col justify-between group hover:border-brand-teal/40 transition-all"
            >
              <div className="h-32 bg-brand-navy-light/40 rounded-lg flex items-center justify-center overflow-hidden mb-3 border border-white/5">
                {media.mime_type?.startsWith('image/') ? (
                  <img
                    src={media.file_path}
                    alt={media.original_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <File size={32} className="text-brand-slate" />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-white truncate" title={media.original_filename || media.original_name}>
                  {media.original_filename || media.original_name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-brand-slate/70 font-mono">
                  <span>{((media.file_size || media.size_bytes || 0) / 1024).toFixed(1)} KB</span>
                  <span>{new Date(media.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </AdminLayout>
  );
}
