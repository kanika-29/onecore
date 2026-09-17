import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, CheckCircle2, ShieldCheck, Microscope, RefreshCw, Layers, FileCheck } from 'lucide-react';
import SectionEyebrow from '../components/SectionEyebrow';
import ScrollReveal from '../components/ScrollReveal';
import FallbackImage from '../components/FallbackImage';
import { useCmsPage } from '../hooks/useCmsPage';

export default function QualityManufacturing() {
  const { getSection } = useCmsPage('quality-manufacturing');

  const heroSec = getSection('hero', {
    eyebrow: 'QUALITY & MANUFACTURING',
    title: 'Quality built into every stage of the product journey.',
    body: 'At Onecore Pharma, quality is not treated as a final checkpoint. It is considered throughout the product journey, from formulation and sourcing to manufacturing, testing and responsible release.',
    image_url: '/assets/quality.jpg',
    cta_text: 'Quality Principles',
    cta_url: '#principles',
    secondary_cta_text: 'Explore Specialties',
    secondary_cta_url: '/areas-of-care',
  });

  const principlesSec = getSection('principles', {
    eyebrow: 'FOUNDATIONAL PRINCIPLES',
    title: 'Principles that guide our quality approach.',
    body: 'A disciplined commitment to patient safety, regulatory compliance, and formulation excellence across every batch.',
    items: [
      {
        title: "Consistent Standards",
        desc: "Quality begins with clear specifications, controlled processes and consistent standards across the product lifecycle.",
      },
      {
        title: "Responsible Release",
        desc: "Products are released only after the appropriate quality requirements and checks have been completed.",
      },
      {
        title: "Controlled Processes",
        desc: "Manufacturing and quality processes are designed to support consistency, traceability and dependable product performance.",
      },
      {
        title: "Continuous Improvement",
        desc: "We continuously look for opportunities to strengthen processes, improve reliability and support better quality outcomes.",
      },
    ]
  });

  const manufacturingSec = getSection('manufacturing_standards', {
    eyebrow: 'MANUFACTURING DISCIPLINES',
    title: 'Manufacturing with discipline and control.',
    body: 'Onecore formulations are produced in qualified manufacturing environments adhering strictly to cGMP and regulatory standards.',
    image_url: '/assets/hero-healthcare.jpg',
    items: [
      {
        title: 'Validated Processes',
        desc: 'Equipment calibration and environmental monitoring.'
      },
      {
        title: 'Batch Traceability',
        desc: 'End-to-end documentation across the supply chain.'
      }
    ]
  });

  const assuranceSec = getSection('assurance_steps', {
    eyebrow: 'QUALITY ASSURANCE',
    title: 'Controls throughout the lifecycle.',
    subtitle: 'Key assurance stages designed to support formulation reliability from raw ingredient selection to clinical availability.',
    items: [
      {
        title: "Raw material and supplier oversight",
        desc: "Disciplined evaluation and verification of starting materials, active pharmaceutical ingredients and qualified supply partners.",
      },
      {
        title: "Defined specifications",
        desc: "Clear chemical, physical and stability benchmarks established for every formulation across its shelf life.",
      },
      {
        title: "Manufacturing process controls",
        desc: "Structured in-process monitoring and calibrated equipment parameters designed to ensure batch consistency.",
      },
      {
        title: "Testing and quality checks",
        desc: "Rigorous analytical and microbiological testing conducted to verify identity, purity, potency and dosage uniformity.",
      },
      {
        title: "Documentation and traceability",
        desc: "Complete batch records, systematic tracking and full audit trails maintained throughout production and storage.",
      },
      {
        title: "Responsible product release",
        desc: "Independent quality review and systematic verification before any product batch is authorized for clinical distribution.",
      },
    ]
  });

  const finalCtaSec = getSection('final_cta', {
    title: 'Quality you can depend on.',
    body: 'Explore the therapeutic areas and formulations that make up the Onecore portfolio.',
    cta_text: 'Explore Areas of Care',
    cta_url: '/areas-of-care',
    secondary_cta_text: 'Contact Quality Team',
    secondary_cta_url: '/contact',
  });

  return (
    <div className="w-full bg-brand-ivory text-brand-text">
      {/* =========================================================================
          SECTION 1 — HERO
          ========================================================================= */}
      {heroSec.is_active && (
        <section className="pt-32 sm:pt-40 lg:pt-44 pb-20 sm:pb-28 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: H1, Intro, Actions */}
            <div className="lg:col-span-7 space-y-8">
              <ScrollReveal>
                <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-brand-dark tracking-tight leading-[1.08] whitespace-pre-line">
                  {heroSec.title}
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <p className="text-lg sm:text-xl text-brand-muted font-normal max-w-2xl leading-relaxed whitespace-pre-line">
                  {heroSec.body}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  {heroSec.cta_url && (
                    heroSec.cta_url.startsWith('#') ? (
                      <a
                        href={heroSec.cta_url}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-dark text-white text-sm font-semibold tracking-wide rounded-full hover:bg-brand-sage transition-all duration-300 shadow-sm cursor-pointer group"
                      >
                        <span>{heroSec.cta_text || 'Quality Principles'}</span>
                        <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                      </a>
                    ) : (
                      <Link
                        to={heroSec.cta_url}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-dark text-white text-sm font-semibold tracking-wide rounded-full hover:bg-brand-sage transition-all duration-300 shadow-sm group"
                      >
                        <span>{heroSec.cta_text || 'Quality Principles'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )
                  )}

                  {heroSec.secondary_cta_url && (
                    <Link
                      to={heroSec.secondary_cta_url}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-surface border border-brand-border text-brand-dark text-sm font-medium rounded-full hover:bg-brand-ivory transition-all duration-200"
                    >
                      <span>{heroSec.secondary_cta_text || 'Explore Specialties'}</span>
                    </Link>
                  )}
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Hero Visual Asset (Top-Aligned) */}
            <div className="lg:col-span-5">
              <ScrollReveal delay={0.2} direction="left">
                <div className="relative rounded-sm overflow-hidden border border-brand-border shadow-sm">
                  <FallbackImage
                    src={heroSec.image_url || '/assets/quality.jpg'}
                    alt="Onecore Pharma quality assurance and laboratory testing"
                    aspectRatio="aspect-[4/3]"
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 2 — PRINCIPLES (4 Cards)
          ========================================================================= */}
      {principlesSec.is_active && (
        <section id="principles" className="py-20 sm:py-28 bg-brand-surface border-y border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="max-w-3xl space-y-4">
              <ScrollReveal>
                <SectionEyebrow>{principlesSec.eyebrow || 'FOUNDATIONAL PRINCIPLES'}</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight whitespace-pre-line">
                  {principlesSec.title || 'Principles that guide our quality approach.'}
                </h2>
                <p className="text-base sm:text-lg text-brand-muted leading-relaxed whitespace-pre-line">
                  {principlesSec.body}
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {principlesSec.items.map((item, idx) => (
                <ScrollReveal key={item.title || idx} delay={idx * 0.06}>
                  <div className="bg-white border border-brand-border/80 p-6 sm:p-8 rounded-sm h-full flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-sm transition-shadow">
                    <div className="space-y-3">
                      <h3 className="text-lg sm:text-xl font-medium text-brand-dark tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-brand-muted leading-relaxed">
                        {item.desc || item.description || item.text}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3 — MANUFACTURING
          ========================================================================= */}
      {manufacturingSec.is_active && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Visual (Top-Aligned) */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <ScrollReveal delay={0.1}>
                <div className="relative rounded-sm overflow-hidden border border-brand-border shadow-sm">
                  <FallbackImage
                    src={manufacturingSec.image_url || '/assets/hero-healthcare.jpg'}
                    alt="Precision pharmaceutical manufacturing lines and cleanroom packaging"
                    aspectRatio="aspect-[4/3]"
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScrollReveal>
            </div>

            {/* Right Copy */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <ScrollReveal>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight whitespace-pre-line">
                  {manufacturingSec.title || 'Manufacturing with discipline and control.'}
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <p className="text-base sm:text-lg text-brand-muted leading-relaxed whitespace-pre-line">
                  {manufacturingSec.body || 'Onecore formulations are produced in qualified manufacturing environments adhering strictly to cGMP and regulatory standards.'}
                </p>
              </ScrollReveal>

              {manufacturingSec.items && manufacturingSec.items.length > 0 && (
                <ScrollReveal delay={0.15}>
                  <div className="pt-4 border-t border-brand-border/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {manufacturingSec.items.map((bullet, idx) => (
                      <div key={bullet.title || idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-brand-sage shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-brand-dark">{bullet.title}</h4>
                          <p className="text-xs text-brand-muted mt-0.5">{bullet.desc || bullet.description || bullet.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4 — QUALITY ASSURANCE (Step-by-Step Grid)
          ========================================================================= */}
      {assuranceSec.is_active && (
        <section className="py-24 sm:py-32 bg-brand-surface/80 border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="max-w-3xl space-y-4">
              <ScrollReveal>
                <SectionEyebrow>{assuranceSec.eyebrow || 'QUALITY ASSURANCE'}</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight whitespace-pre-line">
                  {assuranceSec.title || 'Controls throughout the lifecycle.'}
                </h2>
                <p className="text-base sm:text-lg text-brand-muted leading-relaxed whitespace-pre-line">
                  {assuranceSec.subtitle || 'Key assurance stages designed to support formulation reliability from raw ingredient selection to clinical availability.'}
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {assuranceSec.items.map((step, idx) => (
                <ScrollReveal key={step.title || idx} delay={idx * 0.05}>
                  <div className="bg-white border border-brand-border/70 p-6 sm:p-8 rounded-sm h-full flex flex-col justify-between space-y-4 shadow-2xs hover:border-brand-sage/40 transition-colors">
                    <div className="space-y-3">
                      <h3 className="text-base sm:text-lg font-medium text-brand-dark tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-sm text-brand-muted leading-relaxed">
                        {step.desc || step.description || step.text}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5 — FINAL CTA
          ========================================================================= */}
      {finalCtaSec.is_active && (
        <section className="py-24 sm:py-32 bg-brand-dark text-white text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
            <ScrollReveal>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white tracking-tight leading-tight max-w-3xl mx-auto whitespace-pre-line">
                {finalCtaSec.title || 'Quality you can depend on.'}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-lg sm:text-xl text-gray-300 font-normal max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
                {finalCtaSec.body || 'Explore the therapeutic areas and formulations that make up the Onecore portfolio.'}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
                <Link
                  to={finalCtaSec.cta_url || '/areas-of-care'}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-sage hover:bg-brand-sage-light text-brand-dark text-sm font-semibold tracking-wide rounded-full transition-all duration-300 shadow-sm"
                >
                  <span>{finalCtaSec.cta_text || 'Explore Areas of Care'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {finalCtaSec.secondary_cta_text && (
                  <Link
                    to={finalCtaSec.secondary_cta_url || '/contact'}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-all duration-200"
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
