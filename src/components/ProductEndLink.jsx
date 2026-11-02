import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatProductName } from '../utils/formatProductName';

export default function ProductEndLink({ product }) {
  const url = (product?.link_url || product?.external_link || '').trim();
  if (!url) return null;

  const label = (product?.link_label || product?.external_link_label || '').trim() || 'Learn More';
  const isExternal = /^https?:\/\//i.test(url);
  const brand = product?.name || product?.brandName || product?.brand_name || 'Product';

  return (
    <section className="w-full bg-[#FAF9F6] border-t border-[#E5E3DC] py-14 px-6 sm:px-12 text-[#232126]">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl border border-[#E5E3DC] bg-white shadow-xs">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#D52B1E] font-semibold">
            Product Access & Resources
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#232126]">
            {label}
          </h3>
          <p className="text-sm text-[#666666] font-light max-w-lg">
            Direct access to official information, ordering portals, or prescribing literature for {formatProductName(brand)}.
          </p>
        </div>

        <div className="shrink-0">
          {isExternal ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <span>{label}</span>
              <ExternalLink size={15} />
            </a>
          ) : (
            <Link
              to={url}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <span>{label}</span>
              <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
