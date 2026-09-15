import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle2,
  X,
  Globe,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import MediaSelectorModal from '../../components/admin/MediaSelectorModal';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminSettings() {
  const { token, isAdmin } = useAdminAuth();
  const [formData, setFormData] = useState({
    site_name: 'Onecore Pharma',
    company_name: 'Onecore Pharma Pvt. Ltd.',
    logo_url: '/assets/onecore-logo.png',
    favicon_url: '/assets/favicon.png',
    footer_tagline: 'Healthcare centered on people.',
    copyright_text: '© 2026 Onecore Pharma Pvt. Ltd.',
    general_email: 'info@onecorepharma.in',
    product_email: 'info@onecorepharma.in',
    business_email: 'info@onecorepharma.in',
    careers_email: 'info@onecorepharma.in',
    safety_email: 'info@onecorepharma.in',
    phone: '8169255034',
    address: 'Onecore Pharma Corporate Headquarters, Bio-Innovation Park, Level 7, Mumbai, Maharashtra 400051, India',
    office_hours: '10 AM to 7 PM',
    default_seo_title: 'Onecore Pharma — Purposeful Formulations, Dependable Quality',
    default_seo_desc: 'Onecore Pharma is a modern pharmaceutical company developing purposeful formulations and healthcare solutions centered on patients and healthcare professionals.',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [mediaCb, setMediaCb] = useState(null);

  useEffect(() => {
    document.title = 'Site & Contact Settings | Onecore Admin';
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            const map = data.data.settingsMap || {};
            if (Array.isArray(data.data.siteSettings)) {
              data.data.siteSettings.forEach((s) => {
                map[s.setting_key] = s.setting_value;
              });
            }
            setFormData((prev) => ({
              ...prev,
              ...map,
              general_email: map.general_email || map.contact_email || prev.general_email,
              phone: map.phone || map.contact_phone || prev.phone,
              office_hours: map.office_hours || map.contact_hours || prev.office_hours,
            }));
          }
        }
      } catch (err) {
        console.warn('Using default settings state:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setNotification({ type: 'error', message: 'Only Admin or Super Admin can modify site settings.' });
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/settings/bulk', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setNotification({ type: 'success', message: 'Site & Contact settings saved to MySQL database successfully.' });
      } else {
        const errData = await res.json();
        setNotification({ type: 'error', message: errData.message || 'Failed to update settings.' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Network error.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <AdminLayout
      title="Site & Corporate Settings"
      subtitle="Manage global site identity, corporate contact routing, branding, and SEO defaults"
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Identity & Branding */}
        <AdminCard
          title="Site Identity & Corporate Branding"
          subtitle="Logo, company name, footer tagline, and copyright information"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                Legal Company Name
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                Corporate Logo URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="flex-1 bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
                />
                <button
                  type="button"
                  onClick={() => setMediaCb(() => (url) => setFormData((p) => ({ ...p, logo_url: url })))}
                  className="px-3 py-2 bg-brand-navy border border-white/10 hover:border-brand-teal/40 rounded-lg text-xs text-brand-slate hover:text-white flex items-center gap-1.5 transition-all"
                >
                  <ImageIcon size={13} />
                  Library
                </button>
              </div>
              {formData.logo_url && (
                <div className="mt-2 p-2 bg-brand-navy border border-white/10 rounded-lg inline-block">
                  <img src={formData.logo_url} alt="Logo Preview" className="h-8 w-auto object-contain" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                Footer Tagline
              </label>
              <input
                type="text"
                value={formData.footer_tagline}
                onChange={(e) => setFormData({ ...formData, footer_tagline: e.target.value })}
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                value={formData.copyright_text}
                onChange={(e) => setFormData({ ...formData, copyright_text: e.target.value })}
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
          </div>
        </AdminCard>

        {/* Departmental Email Routing */}
        <AdminCard
          title="Departmental Email Routing"
          subtitle="Direct communication addresses displayed on public contact forms and directories"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                General Enquiries Email
              </label>
              <input
                type="email"
                value={formData.general_email}
                onChange={(e) => setFormData({ ...formData, general_email: e.target.value })}
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                Product Information Email
              </label>
              <input
                type="email"
                value={formData.product_email}
                onChange={(e) => setFormData({ ...formData, product_email: e.target.value })}
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                Commercial & Distribution Email
              </label>
              <input
                type="email"
                value={formData.business_email}
                onChange={(e) => setFormData({ ...formData, business_email: e.target.value })}
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                Careers & Talent Email
              </label>
              <input
                type="email"
                value={formData.careers_email}
                onChange={(e) => setFormData({ ...formData, careers_email: e.target.value })}
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                Patient Safety & Adverse Event Reporting Email
              </label>
              <input
                type="email"
                value={formData.safety_email}
                onChange={(e) => setFormData({ ...formData, safety_email: e.target.value })}
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
          </div>
        </AdminCard>

        {/* Physical Location & Operating Schedule */}
        <AdminCard
          title="Physical Location & Operating Schedule"
          subtitle="Corporate headquarters address, primary telephone line, and business hours"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                Headquarters Address
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                  Primary Phone Line
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                  Office Hours
                </label>
                <input
                  type="text"
                  value={formData.office_hours}
                  onChange={(e) => setFormData({ ...formData, office_hours: e.target.value })}
                  className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
                />
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Global SEO Metadata Defaults */}
        <AdminCard
          title="Default SEO Metadata"
          subtitle="Fallback meta title and description when specific page meta is omitted"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                Default Meta Title
              </label>
              <input
                type="text"
                value={formData.default_seo_title}
                onChange={(e) => setFormData({ ...formData, default_seo_title: e.target.value })}
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1">
                Default Meta Description
              </label>
              <textarea
                rows={2}
                value={formData.default_seo_desc}
                onChange={(e) => setFormData({ ...formData, default_seo_desc: e.target.value })}
                className="w-full bg-brand-navy-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 mt-6 border-t border-white/10">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Save size={14} />
              <span>{isSaving ? 'Saving Settings...' : 'Save Settings'}</span>
            </button>
          </div>
        </AdminCard>
      </form>

      {mediaCb && <MediaSelectorModal onSelect={mediaCb} onClose={() => setMediaCb(null)} />}
    </AdminLayout>
  );
}
