import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Edit3,
  ExternalLink,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import { useAdminAuth } from '../../context/AdminAuthContext';

const DEFAULT_PAGES = [
  { id: 1, page_key: 'home', title: 'Home Page', route: '/', meta_description: 'Onecore Pharma corporate homepage.', section_count: 10 },
  { id: 2, page_key: 'about', title: 'About Onecore', route: '/about', meta_description: 'Mission, vision and foundational principles.', section_count: 5 },
  { id: 3, page_key: 'patients-caregivers', title: 'Patients & Caregivers', route: '/patients-caregivers', meta_description: 'Patient education and caregiver guidance.', section_count: 8 },
  { id: 4, page_key: 'quality-manufacturing', title: 'Quality & Manufacturing', route: '/quality-manufacturing', meta_description: 'Quality and manufacturing standards.', section_count: 7 },
  { id: 5, page_key: 'areas-of-care', title: 'Therapeutic Areas', route: '/areas-of-care', meta_description: 'Therapeutic areas and clinical care.', section_count: 2 },
  { id: 6, page_key: 'news', title: 'News & Perspectives', route: '/news', meta_description: 'Corporate announcements and press releases.', section_count: 1 },
  { id: 7, page_key: 'contact', title: 'Contact Us', route: '/contact', meta_description: 'Commercial and medical communication channels.', section_count: 7 },
  { id: 8, page_key: 'healthcare-professionals', title: 'Healthcare Professionals', route: '/healthcare-professionals', meta_description: 'Medical dialogue and scientific portfolio data.', section_count: 3 },
  { id: 55, page_key: 'partnerships', title: 'Distribution & Partnerships', route: '/partnerships', meta_description: 'Distribution network and franchise partner criteria.', section_count: 4 },
  { id: 56, page_key: 'privacy', title: 'Privacy Statement', route: '/privacy', meta_description: 'Information collection, usage, and data protection policies.', section_count: 4 },
  { id: 57, page_key: 'disclaimer', title: 'Terms of Use & Disclaimer', route: '/disclaimer', meta_description: 'Medical information notice, regulatory boundaries, and website terms.', section_count: 3 },
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
      subtitle="Manage page titles, modular sections, headings, text copy, images, and CTAs"
    >
      {/* Info Banner */}
      <div className="flex items-center gap-3 bg-[#0D5C75]/10 border border-[#0D5C75]/20 rounded-xl px-4 py-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#0D5C75] shrink-0" />
        <p className="text-xs text-[#0D5C75] font-medium">
          Select <strong className="font-semibold">Edit Sections</strong> below to manage titles, body paragraphs, images, repeatable cards, and call-to-action buttons for that page.
        </p>
      </div>

      <AdminCard
        title="Website Pages"
        subtitle="Core routes rendered by the Onecore Pharma application"
      >
        <AdminTable
          headers={['Page Name', 'Public Route', 'Sections', 'SEO Description', 'Last Updated', 'Actions']}
        >
          {pages.map((page) => (
            <tr key={page.id} className="hover:bg-slate-50 transition-colors">
              <td className="py-3.5 px-4 font-semibold text-slate-900">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-slate-100 text-[#1B365D]">
                    <FileText size={15} />
                  </div>
                  <span>{page.title}</span>
                </div>
              </td>
              <td className="py-3.5 px-4 font-mono text-[#0D5C75] text-[11px] font-medium">
                {page.route || (page.slug?.startsWith('/') ? page.slug : `/${page.slug || page.page_key?.replace(/_/g, '-')}`)}
              </td>
              <td className="py-3.5 px-4 text-slate-600 text-xs">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
                  {page.section_count ?? '—'} sections
                </span>
              </td>
              <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate text-xs">
                {page.seo_description || page.meta_description || '—'}
              </td>
              <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : '—'}
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/pages/${page.page_key || page.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#1B365D] hover:bg-[#152a48] text-white rounded-lg transition-all shadow-xs"
                  >
                    <Edit3 size={12} />
                    Edit Sections
                  </Link>
                  <a
                    href={page.route || (page.slug?.startsWith('/') ? page.slug : `/${page.slug || ''}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="View Live Page"
                  >
                    <ExternalLink size={14} />
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
