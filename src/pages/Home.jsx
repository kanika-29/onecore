import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ShieldCheck, Cpu, Leaf, Layers, RefreshCw, Users, CheckCircle2 } from 'lucide-react';
import SectionEyebrow from '../components/SectionEyebrow';
import ScrollReveal from '../components/ScrollReveal';
import FallbackImage from '../components/FallbackImage';
import PageBanner from '../components/PageBanner';
import { useCmsPage } from '../hooks/useCmsPage';
import { useTherapeuticAreas } from '../hooks/useTherapeuticAreas';
import { useNews } from '../hooks/useNews';

export default function Home() {
  const { getSection } = useCmsPage('home');
  const { areas: dynamicAreas } = useTherapeuticAreas();
  const { articles: dynamicNews } = useNews();

  // Fallbacks matching approved design & copy
  const heroSec = getSection('hero', {
    eyebrow: 'ABOUT ONECORE',
    title: 'Committed to better tomorrow',
    body: 'Onecore Pharma is a pharmaceutical company focused on purposeful formulations, dependable quality and the needs of patients and healthcare professionals.',
    cta_text: 'Discover Onecore',
    cta_url: '/about',
    image_url: '/assets/hero-healthcare.jpg',
  });

  const areasSec = getSection('areas_of_care', {
    eyebrow: 'AREAS OF CARE',
    title: 'Focused expertise. Purposeful healthcare.',
  });

  const purposeSec = getSection('our_purpose', {
    eyebrow: 'OUR PURPOSE',
    title: 'Improve care through medicines and healthcare solutions that matter.',
    items: [
      {
        title: 'OUR VISION',
        desc: 'To be a trusted pharmaceutical company for patients and healthcare professionals across the areas of care we serve.'
      },
      {
        title: 'OUR MISSION',
        desc: 'To develop and deliver purposeful formulations that address real clinical needs, uphold dependable quality and expand responsibly into areas where we can make a meaningful difference.'
      }
    ]
  });

  const qualitySec = getSection('quality_assurance', {
    eyebrow: 'QUALITY ASSURANCE',
    title: 'Quality is part of the product from the beginning.',
    body: 'Medicines carry responsibility. That is why quality needs to be considered across manufacturing, testing, review and release, not treated as a final checkpoint.',
    subheading: 'Our approach is centered on qualified manufacturing environments, appropriate quality controls and disciplined review before products reach the market.',
    image_url: '/assets/quality.jpg',
    items: [
      {
        title: 'Consistent standards',
        desc: 'Quality expectations aligned to the nature and regulatory requirements of each product.'
      },
      {
        title: 'Responsible release',
        desc: 'Review and controls designed to support product consistency and reliability.'
      }
    ]
  });

  const sustainabilitySec = getSection('sustainability', {
    eyebrow: 'SUSTAINABILITY',
    title: 'Better health and a healthier future belong together.',
    body: 'Our responsibility extends beyond the products we provide. As Onecore grows, we want responsible choices to become part of how we operate, how we source and how we work with our partners.',
    items: [
      {
        eyebrow: 'RESPONSIBLE OPERATIONS',
        title: 'Use resources thoughtfully.',
        desc: 'Work toward more efficient use of energy, water and materials across the operations and manufacturing network that support our products.',
        icon: 'Cpu'
      },
      {
        eyebrow: 'PACKAGING',
        title: 'Reduce what is unnecessary.',
        desc: 'Evaluate packaging choices with the aim of reducing avoidable material use while protecting product quality, safety and stability.',
        icon: 'Leaf'
      },
      {
        eyebrow: 'RESPONSIBLE PARTNERSHIPS',
        title: 'Grow with shared standards.',
        desc: 'Build relationships with partners who share expectations around quality, compliance, ethical conduct and environmental responsibility.',
        icon: 'Users'
      }
    ]
  });

  const lookingAheadSec = getSection('looking_ahead', {
    eyebrow: 'LOOKING AHEAD',
    title: 'Building depth. \nExpanding thoughtfully.',
    body: 'Our roadmap prioritizes therapeutic rigor, medical dialogue, and disciplined expansion that preserves trust.',
    items: [
      {
        title: "Deepen therapeutic expertise",
        desc: "Build stronger portfolios within our core areas of care."
      },
      {
        title: "Strengthen medical engagement",
        desc: "Stay closer to clinical practice and evolving healthcare needs."
      },
      {
        title: "Expand thoughtfully",
        desc: "Enter new areas where the portfolio can add meaningful value."
      },
      {
        title: "Grow responsibly",
        desc: "Strengthen quality, partnerships and sustainable practices as the organisation scales."
      }
    ]
  });

  const newsSec = getSection('news_preview', {
    eyebrow: 'LATEST FROM ONECORE',
    title: 'News & perspectives.',
  });

  const finalCtaSec = getSection('final_cta', {
    title: 'Purposeful healthcare, across every area we serve.',
    body: 'Explore the therapeutic areas and formulations that make up the Onecore portfolio.',
    cta_text: 'Explore areas of care',
    cta_url: '/areas-of-care',
    secondary_cta_text: 'Connect With Us',
    secondary_cta_url: '/contact',
  });

  // Map dynamic areas to division cards
  const divisions = (dynamicAreas && dynamicAreas.length > 0)
    ? dynamicAreas.map((a) => ({
        name: a.divisionName || a.displayName || a.title,
        specialty: a.therapeuticArea || a.displayName || a.title,
        image: a.image || a.image_url || '/assets/therapeutic-general-medicine.jpg',
      }))
    : [
        { name: "CYTOS", specialty: "Oncology", image: "/assets/therapeutic-oncology.jpg" },
        { name: "PEDIAPLUS", specialty: "Paediatrics", image: "/assets/therapeutic-paediatrics.jpg" },
        { name: "OTIRA", specialty: "ENT", image: "/assets/therapeutic-ent.jpg" },
        { name: "FEMME", specialty: "Women’s Health", image: "/assets/therapeutic-womens-health.jpg" },
        { name: "OMNARA", specialty: "General Medicine", image: "/assets/therapeutic-general-medicine.jpg" },
        { name: "VELLIS", specialty: "Dermatology", image: "/assets/therapeutic-dermatology.jpg" },
        { name: "EYERIX", specialty: "Ophthalmology", image: "/assets/therapeutic-ophthalmology.jpg" },
        { name: "NEURIX", specialty: "Neurology", image: "/assets/therapeutic-neurology.jpg" },
        { name: "ORTHEON", specialty: "Orthopaedics", image: "/assets/therapeutic-orthopaedics.jpg" },
      ];

  const renderSustainabilityIcon = (iconName, idx) => {
    if (iconName === 'Cpu' || idx === 0) return <Cpu className="w-5 h-5 stroke-[1.5]" />;
    if (iconName === 'Leaf' || idx === 1) return <Leaf className="w-5 h-5 stroke-[1.5]" />;
    return <Users className="w-5 h-5 stroke-[1.5]" />;
  };

  return (
    <div className="w-full">
      {/* =========================================================================
          SECTION 1 — HERO / BANNER
          ========================================================================= */}
      {heroSec.is_active && (
        <PageBanner
          title="Committed to better tomorrow"
          imageUrl={heroSec.image_url || '/assets/hero-healthcare.jpg'}
          imageAlt="Onecore Pharma - Committed to better tomorrow"
        />
      )}

      {/* =========================================================================
          SECTION 2 — AREAS OF CARE / DIVISIONS
          ========================================================================= */}
      {areasSec.is_active && (
        <section className="py-20 sm:py-28 lg:py-32 bg-brand-surface/60 border-y border-brand-border/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
            {/* Section Heading */}
            <div className="max-w-3xl space-y-4">
              <ScrollReveal>
                <SectionEyebrow>{areasSec.eyebrow || 'AREAS OF CARE'}</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight whitespace-pre-line">
                  {areasSec.title || 'Focused expertise. Purposeful healthcare.'}
                </h2>
              </ScrollReveal>
            </div>

            {/* 3x3 Grid of 9 Division Cards with Soft Muted Sage Tint */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {divisions.map((item, idx) => (
                <ScrollReveal key={item.name} delay={idx * 0.04}>
                  <Link
                    to="/areas-of-care"
                    className="group bg-[#F0F4F2] hover:bg-[#E6EFEA] border border-brand-sage/20 hover:border-brand-sage/45 rounded-sm overflow-hidden flex flex-col h-full transition-all duration-300 shadow-2xs hover:shadow-xs"
                  >
                    {/* Card Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-brand-surface border-b border-brand-sage/15">
                      <img
                        src={item.image}
                        alt={`${item.name} — ${item.specialty}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-lg sm:text-xl font-semibold tracking-wider text-brand-dark uppercase group-hover:text-brand-sage transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-brand-muted font-normal">
                          {item.specialty}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-brand-sage/15 flex items-center justify-end text-xs font-semibold text-brand-sage group-hover:text-brand-dark transition-colors">
                        <span className="inline-flex items-center gap-1 uppercase tracking-wider text-xs font-semibold">
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-brand-sage" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3 — OUR PURPOSE
          ========================================================================= */}
      {purposeSec.is_active && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-16">
            {/* Eyebrow & Large Statement */}
            <div className="max-w-4xl space-y-6">
              <ScrollReveal>
                <SectionEyebrow>{purposeSec.eyebrow || 'OUR PURPOSE'}</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-brand-dark tracking-tight leading-tight whitespace-pre-line">
                  {purposeSec.title || 'Improve care through medicines and healthcare solutions that matter.'}
                </h2>
              </ScrollReveal>
            </div>

            {/* Editorial Content Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 pt-8 border-t border-brand-border">
              {purposeSec.items.map((item, idx) => (
                <ScrollReveal key={item.title || idx} delay={(idx + 1) * 0.1}>
                  <div className="relative pl-6 sm:pl-8 border-l-2 border-brand-sage/40 space-y-4">
                    <h3 className="text-xl sm:text-2xl font-semibold text-brand-dark tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
                      {item.desc || item.description || item.text}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4 — QUALITY (Contrasting Dark Section)
          ========================================================================= */}
      {qualitySec.is_active && (
        <section className="py-24 sm:py-32 bg-brand-dark text-white border-y border-brand-border-dark relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-8">
                <ScrollReveal>
                  <SectionEyebrow isDark>{qualitySec.eyebrow || 'QUALITY ASSURANCE'}</SectionEyebrow>
                  <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight whitespace-pre-line">
                    {qualitySec.title || 'Quality is part of the product from the beginning.'}
                  </h2>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <div className="space-y-4 text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                    <p>
                      {qualitySec.body || 'Medicines carry responsibility. That is why quality needs to be considered across manufacturing, testing, review and release, not treated as a final checkpoint.'}
                    </p>
                    {qualitySec.subheading && (
                      <p>
                        {qualitySec.subheading}
                      </p>
                    )}
                  </div>
                </ScrollReveal>

                {/* Principles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-brand-border-dark">
                  {qualitySec.items.map((principle, idx) => (
                    <ScrollReveal key={principle.title || idx} delay={0.15 + idx * 0.05}>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-white">{principle.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {principle.desc || principle.description || principle.text}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              {/* Right Visual Image */}
              <div className="lg:col-span-5">
                <ScrollReveal delay={0.2} direction="left">
                  <div className="relative border border-brand-border-dark rounded-sm overflow-hidden">
                    <FallbackImage
                      src={qualitySec.image_url || '/assets/quality.jpg'}
                      alt="Onecore Pharma quality assurance and laboratory testing"
                      aspectRatio="aspect-[4/3] sm:aspect-[1/1]"
                    />
                    <div className="bg-brand-dark-surface p-4 border-t border-brand-border-dark flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-sage-light" />
                        Batch Verification
                      </span>
                      <span className="font-mono text-[11px]">QA PROTOCOL V.26</span>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5 — SUSTAINABILITY
          ========================================================================= */}
      {sustainabilitySec.is_active && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-16">
            {/* Header */}
            <div className="max-w-3xl space-y-6">
              <ScrollReveal>
                <SectionEyebrow>{sustainabilitySec.eyebrow || 'SUSTAINABILITY'}</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight whitespace-pre-line">
                  {sustainabilitySec.title || 'Better health and a healthier future belong together.'}
                </h2>
                <p className="text-base sm:text-lg text-brand-muted leading-relaxed whitespace-pre-line">
                  {sustainabilitySec.body || 'Our responsibility extends beyond the products we provide. As Onecore grows, we want responsible choices to become part of how we operate, how we source and how we work with our partners.'}
                </p>
              </ScrollReveal>
            </div>

            {/* Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pt-8 border-t border-brand-border">
              {sustainabilitySec.items.map((col, idx) => (
                <ScrollReveal key={col.title || idx} delay={0.05 + idx * 0.05}>
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-brand-sage">
                      {renderSustainabilityIcon(col.icon, idx)}
                    </div>
                    {col.eyebrow && (
                      <span className="text-xs font-semibold uppercase tracking-widest text-brand-sage block">
                        {col.eyebrow}
                      </span>
                    )}
                    <h3 className="text-xl font-medium text-brand-dark tracking-tight">
                      {col.title}
                    </h3>
                    <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                      {col.desc || col.description || col.text}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 7 — LOOKING AHEAD
          ========================================================================= */}
      {lookingAheadSec.is_active && (
        <section className="py-24 sm:py-32 bg-brand-surface/60 border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Left Header */}
              <div className="lg:col-span-5 space-y-6">
                <ScrollReveal>
                  <SectionEyebrow>{lookingAheadSec.eyebrow || 'LOOKING AHEAD'}</SectionEyebrow>
                  <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight whitespace-pre-line">
                    {lookingAheadSec.title || 'Building depth. \nExpanding thoughtfully.'}
                  </h2>
                  <p className="text-base text-brand-muted leading-relaxed pt-2 whitespace-pre-line">
                    {lookingAheadSec.body || 'Our roadmap prioritizes therapeutic rigor, medical dialogue, and disciplined expansion that preserves trust.'}
                  </p>
                </ScrollReveal>
              </div>

              {/* Right Strategic Rows */}
              <div className="lg:col-span-7">
                <div className="border-t border-brand-border divide-y divide-brand-border">
                  {lookingAheadSec.items.map((item, idx) => (
                    <ScrollReveal key={item.title || idx} delay={idx * 0.08}>
                      <div className="py-6 sm:py-7 space-y-2 group hover:bg-brand-ivory/60 transition-colors px-4 -mx-4 rounded-sm">
                        <h3 className="text-xl font-medium text-brand-dark tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                          {item.desc || item.description || item.text}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 8 — NEWS PREVIEW
          ========================================================================= */}
      {newsSec.is_active && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <ScrollReveal>
                <SectionEyebrow>{newsSec.eyebrow || 'LATEST FROM ONECORE'}</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight whitespace-pre-line">
                  {newsSec.title || 'News & perspectives.'}
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <Link
                  to={newsSec.cta_url || '/news'}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark hover:text-brand-sage group transition-colors"
                >
                  <span>{newsSec.cta_text || 'View all news'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </ScrollReveal>
            </div>

            {/* 3 News Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {dynamicNews.slice(0, 3).map((article, idx) => (
                <ScrollReveal key={article.id} delay={idx * 0.08}>
                  <article className="group flex flex-col h-full space-y-4">
                    <div className="relative overflow-hidden rounded-sm border border-brand-border/80">
                      <FallbackImage
                        src={article.image}
                        alt={article.title}
                        aspectRatio="aspect-[16/10]"
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-brand-muted pt-1">
                      <span className="font-semibold tracking-wider text-brand-sage uppercase">
                        {article.category}
                      </span>
                      <time dateTime={article.date}>{article.date}</time>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-brand-dark group-hover:text-brand-sage transition-colors leading-snug">
                      <Link to="/news">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-brand-muted leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="pt-2 mt-auto">
                      <Link
                        to="/news"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-dark group-hover:text-brand-sage tracking-wider uppercase transition-colors"
                      >
                        <span>Read more</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 9 — FINAL CTA
          ========================================================================= */}
      {finalCtaSec.is_active && (
        <section className="py-24 sm:py-32 bg-brand-surface/80 border-t border-brand-border text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <ScrollReveal>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-brand-dark tracking-tight leading-tight max-w-3xl mx-auto whitespace-pre-line">
                {finalCtaSec.title || 'Purposeful healthcare, across every area we serve.'}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-lg sm:text-xl text-brand-muted font-normal max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
                {finalCtaSec.body || 'Explore the therapeutic areas and formulations that make up the Onecore portfolio.'}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
                <Link
                  to={finalCtaSec.cta_url || '/areas-of-care'}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-dark text-white text-sm font-semibold tracking-wide rounded-full hover:bg-brand-sage transition-all duration-300 shadow-sm group"
                >
                  <span>{finalCtaSec.cta_text || 'Explore areas of care'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                {finalCtaSec.secondary_cta_text && (
                  <Link
                    to={finalCtaSec.secondary_cta_url || '/contact'}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-brand-border text-brand-dark text-sm font-medium rounded-full hover:bg-brand-ivory hover:border-brand-muted/40 transition-all duration-200"
                  >
                    <span>{finalCtaSec.secondary_cta_text}</span>
                  </Link>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </div>
  );
}
