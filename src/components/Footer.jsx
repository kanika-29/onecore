import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { footerLinks } from '../data/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function Footer() {
  const location = useLocation();
  const { siteSettings } = useSettings();

  const logoUrl = siteSettings.logo_url || '/assets/onecore-logo.png';
  const tagline = siteSettings.footer_tagline || 'Healthcare centered on people.';
  const copyright = siteSettings.copyright_text || '© 2026 Onecore Pharma Pvt. Ltd.';

  const parseLinks = (val, fallback) => {
    let list = fallback;
    if (val) {
      try {
        const parsed = typeof val === 'string' ? JSON.parse(val) : val;
        if (Array.isArray(parsed) && parsed.length > 0) list = parsed;
      } catch {
        list = fallback;
      }
    }
    return list.filter(
      (item) =>
        item.is_active !== false &&
        !item.path?.includes('healthcare-professional') &&
        !item.name?.toLowerCase().includes('healthcare professional')
    );
  };

  const exploreList = parseLinks(siteSettings.footer_explore_links, footerLinks.explore);
  const areasOfCareList = footerLinks.areasOfCare;
  const companyList = footerLinks.company;

  const handleAnchorClick = (path) => {
    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      if (location.pathname === route) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-12 border-t border-brand-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-brand-border-dark">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center" aria-label="Onecore Pharma Home">
              <img
                src={logoUrl}
                alt="Onecore Pharma"
                className="h-8 sm:h-9 w-auto object-contain brightness-0 invert opacity-95 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed pt-2">
              {tagline}
            </p>
          </div>

          {/* Column 1: Explore */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              {exploreList.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Areas of Care */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Areas of Care
            </h4>
            <ul className="space-y-2.5 text-sm">
              {areasOfCareList.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => handleAnchorClick(item.path)}
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {companyList.map((item) => {
                const isOnecore = item.name.toLowerCase() === 'onecore';
                const isExternal = item.isExternal || !isOnecore;
                const hasValidUrl = item.path && item.path !== '#' && item.path !== '';

                if (isOnecore) {
                  return (
                    <li key={item.name}>
                      <Link
                        to="/"
                        className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                      >
                        <span>{item.name}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.name}>
                    <a
                      href={hasValidUrl ? item.path : '#'}
                      target={hasValidUrl ? '_blank' : undefined}
                      rel={hasValidUrl ? 'noopener noreferrer' : undefined}
                      className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                      onClick={(e) => {
                        if (!hasValidUrl) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <span>{item.name}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>{copyright}</p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 hover:text-gray-400">Quality Assured</span>
            <span className="text-gray-500 hover:text-gray-400">Clinical Integrity</span>
            <span className="text-gray-500 hover:text-gray-400">Global Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
