import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import ScrollReveal from '../components/ScrollReveal';
import { useCmsPage } from '../hooks/useCmsPage';
import { assetUrl } from '../utils/assetUrl';

export default function Disclaimer() {
  const { page, getSection, sectionsList } = useCmsPage('disclaimer');

  // Dynamic SEO Title & Meta Description
  useEffect(() => {
    const pageTitle = page?.seo_title || page?.title || 'Disclaimer | Onecore Pharma';
    document.title = pageTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        page?.seo_description ||
          'Official medical information notice, product availability specifications, and regulatory disclaimers for Onecore Pharma.'
      );
    }
  }, [page]);

  // Dynamic Banner Section (from CMS 'banner' or 'hero', with high-fidelity fallback)
  const bannerSec = getSection('banner', getSection('hero', {
    heading: page?.title || 'Disclaimer',
    image_url: '/assets/hero-healthcare.jpg',
    subheading: 'Regulatory notices, medical boundaries, and conditions of website use.',
  }));

  const bannerTitle = bannerSec.heading || bannerSec.title || page?.title || 'Disclaimer';
  const bannerImage = bannerSec.image_url || '/assets/hero-healthcare.jpg';

  // Filter content sections (all active sections except the top banner)
  const contentSections = Array.isArray(sectionsList) && sectionsList.length > 0
    ? sectionsList.filter(
        (s) =>
          s.section_key !== 'banner' &&
          s.id !== bannerSec.id &&
          (s.is_active === 1 || s.is_active === true)
      )
    : [];

  // Default fallback clauses if database sections have not been populated
  const fallbackClauses = [
    {
      id: 'disc-1',
      eyebrow: 'NOTICE 01',
      heading: 'Medical Information Notice',
      body: 'The content provided on this website is for informational and educational purposes only and is not intended to replace consultation with a qualified medical professional.',
    },
    {
      id: 'disc-2',
      eyebrow: 'NOTICE 02',
      heading: 'Product Availability',
      body: 'Product specifications and availability are subject to local regulatory authorizations and marketed formulation guidelines.',
    },
  ];

  const displaySections = contentSections.length > 0 ? contentSections : fallbackClauses;

  const formattedDate = page?.updated_at
    ? new Date(page.updated_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'October 2026';

  return (
    <div className="w-full bg-transparent text-brand-text">
      {/* 1. Dynamic Hero Banner */}
      <PageBanner
        title={bannerTitle}
        imageUrl={bannerImage}
        imageMobileUrl={bannerSec.image_mobile_url || bannerSec.mobile_image_url}
        imageAlt={`${bannerTitle} - Onecore Pharma`}
      />

      {/* 2. Main Content Container */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        {/* Compliance Header / Meta Stamp */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-200/80 gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700">
                <AlertTriangle size={20} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800 font-semibold block">
                  REGULATORY & MEDICAL DISCLOSURE
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Prescription boundaries, clinical disclaimers, and terms of use
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Clock size={14} className="text-slate-400" />
              <span>Last Reviewed: {formattedDate}</span>
            </div>
          </div>
        </ScrollReveal>

        {/* 3. Dynamic Disclaimer Notices / Sections */}
        <div className="space-y-12">
          {displaySections.map((sec, idx) => {
            const paragraphs = (sec.body || '')
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean);

            const hasItems = Array.isArray(sec.items) && sec.items.length > 0;

            return (
              <ScrollReveal key={sec.id || idx}>
                <article className="space-y-4 pt-2">
                  {sec.eyebrow && (
                    <div className="inline-block px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono font-bold tracking-wider uppercase text-slate-700">
                      {sec.eyebrow}
                    </div>
                  )}

                  <h2 className="editorial-heading text-2xl sm:text-3xl font-medium text-brand-dark">
                    {sec.heading || sec.title}
                  </h2>

                  {sec.subheading && (
                    <p className="text-sm sm:text-base font-semibold text-[#0D5C75]">
                      {sec.subheading}
                    </p>
                  )}

                  {paragraphs.length > 0 ? (
                    paragraphs.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-brand-muted text-base sm:text-lg leading-relaxed"
                      >
                        {para}
                      </p>
                    ))
                  ) : (
                    sec.body && (
                      <p className="text-brand-muted text-base sm:text-lg leading-relaxed">
                        {sec.body}
                      </p>
                    )
                  )}

                  {/* Optional Image attached to section */}
                  {sec.image_url && (
                    <div className="my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-h-[380px]">
                      <img
                        src={assetUrl(sec.image_url)}
                        alt={sec.heading || 'Disclaimer illustration'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Optional Repeatable Cards / Bullet points attached to section */}
                  {hasItems && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
                      {sec.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-[#0D5C75] shrink-0" />
                            <h4 className="text-sm font-semibold text-slate-900">
                              {item.title || item.name || `Point ${iIdx + 1}`}
                            </h4>
                          </div>
                          {(item.desc || item.description) && (
                            <p className="text-xs text-slate-600 leading-relaxed pl-6">
                              {item.desc || item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Optional Section CTA Button */}
                  {sec.cta_text && sec.cta_url && (
                    <div className="pt-2">
                      <Link
                        to={sec.cta_url}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D5C75] hover:underline"
                      >
                        <span>{sec.cta_text}</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  )}
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        {/* 4. Adverse Event & Pharmacovigilance Advisory Box */}
        <ScrollReveal>
          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                <ShieldAlert size={17} className="text-amber-700" />
                <span>Suspected Adverse Reaction or Medical Emergency?</span>
              </div>
              <p className="text-xs text-amber-800/90 max-w-md leading-relaxed">
                If you are experiencing an urgent medical condition, please contact emergency medical services or your physician immediately. To notify our pharmacovigilance team regarding a formulation, visit our contact portal.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition-all shadow-xs shrink-0"
            >
              <span>Pharmacovigilance Channel</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
