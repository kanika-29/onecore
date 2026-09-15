import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Edit,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import { useAdminAuth } from '../../context/AdminAuthContext';

const DEFAULT_PAGES = [
  { id: 1, page_key: 'home', title: 'Home Page', route: '/', meta_description: 'Onecore Pharma corporate homepage.', section_count: 5 },
  { id: 2, page_key: 'about', title: 'About Onecore', route: '/about', meta_description: 'Mission, vision and leadership.', section_count: 4 },
  { id: 9, page_key: 'quality_manufacturing', title: 'Quality & Manufacturing', route: '/quality-manufacturing', meta_description: 'Quality and manufacturing standards.', section_count: 6 },
  { id: 3, page_key: 'patients_caregivers', title: 'Patients & Caregivers', route: '/patients-caregivers', meta_description: 'Patient education and caregiver guidance.', section_count: 4 },
  { id: 4, page_key: 'areas_of_care', title: 'Therapeutic Areas', route: '/areas-of-care', meta_description: 'Therapeutic areas and clinical care.', section_count: 4 },
  { id: 5, page_key: 'oneflexo', title: 'Product: OneFLEXO', route: '/areas-of-care/orthopaedics/oneflexo', meta_description: 'OneFLEXO product specifications.', section_count: 6 },
  { id: 6, page_key: 'news', title: 'News & Media', route: '/news', meta_description: 'Corporate announcements and press releases.', section_count: 2 },
  { id: 7, page_key: 'contact', title: 'Contact Us', route: '/contact', meta_description: 'Commercial and general communication.', section_count: 4 },
  { id: 8, page_key: 'legal', title: 'Privacy & Disclaimer', route: '/privacy', meta_description: 'Compliance and legal disclaimers.', section_count: 2 },
];

export default function AdminPages() {
  const { token } = useAdminAuth();
  const [pages, setPages] = useState(DEFAULT_PAGES.map((p) => ({ ...p, updated_at: new Date().toISOString() })));

  useEffect(() => {
    document.title = 'Pages & CMS Content | Onecore Admin';
    const fetchPages = async () => {
      try {
        const res = await fetch('/api/pages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && data.data.length > 0) {
            setPages(data.data);
          }
        }
      } catch (err) {
        console.warn('Using default pages overview:', err);
      }
    };
    fetchPages();
  }, [token]);

  return (
    <AdminLayout
      title="Pages & Section CMS"
      subtitle="Manage page titles, modular sections, and SEO meta descriptions"
    >
      {/* Info Banner */}
      <div className="flex items-center gap-3 bg-brand-teal/5 border border-brand-teal/20 rounded-xl px-4 py-3">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0" />
        <p className="text-xs text-brand-teal/90 font-light">
          Click <strong className="font-medium">Edit Sections</strong> to manage headings, body text, images, and CTAs for each page section in the CMS.
        </p>
      </div>

      <AdminCard
        title="Website Pages"
        subtitle="Core routes rendered by the Onecore Pharma application"
      >
        <AdminTable
          headers={['Page Name', 'Public Route', 'Sections', 'SEO Meta', 'Last Updated', 'Actions']}
        >
          {pages.map((page) => (
            <tr key={page.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3 px-4 font-medium text-white">
                <div className="flex items-center gap-2.5">
                  <FileText size={16} className="text-brand-teal shrink-0" />
                  <span>{page.title}</span>
                </div>
              </td>
              <td className="py-3 px-4 font-mono text-brand-teal text-[11px]">
                {page.route || `/${page.slug || page.page_key?.replace(/_/g, '-')}`}
              </td>
              <td className="py-3 px-4 text-brand-slate text-xs">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 border border-white/10 text-brand-slate/70">
                  {page.section_count ?? '—'} sections
                </span>
              </td>
              <td className="py-3 px-4 text-brand-slate/70 max-w-xs truncate text-xs">
                {page.seo_description || page.meta_description || '—'}
              </td>
              <td className="py-3 px-4 font-mono text-[11px] text-brand-slate/60">
                {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : '—'}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/pages/${page.page_key || page.id}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal border border-brand-teal/20 hover:border-brand-teal/40 rounded-lg transition-all"
                  >
                    <Edit size={12} />
                    Edit Sections
                  </Link>
                  <a
                    href={page.route || `/${page.slug || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-brand-slate/50 hover:text-brand-teal hover:bg-white/5 rounded-lg transition-colors"
                    title="View Live Page"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      </AdminCard>
    </AdminLayout>
  );
}
