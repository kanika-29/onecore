import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import FallbackImage from '../components/FallbackImage';
import { ArrowRight, ShieldCheck, HeartPulse, Layers, Award, Sparkles } from 'lucide-react';
import { useCmsPage } from '../hooks/useCmsPage';

export default function About() {
  const { getSection } = useCmsPage('about');

  useEffect(() => {
    document.title = "About Onecore | Purposeful Formulations, Dependable Quality";
  }, []);

  const heroSec = getSection('hero', {
    eyebrow: 'ABOUT ONECORE',
    title: 'Purposeful formulations. Dependable quality. Patient-centered care.',
    body: 'Onecore Pharma is built around the belief that modern pharmaceutical science achieves its highest impact when aligned closely with the clinical reality of patients and doctors.',
    poster_url: '/assets/about-video-poster.jpg',
  });

  const foundationSec = getSection('foundation', {
    eyebrow: 'OUR FOUNDATION',
    title: 'Our Foundation & Vision',
    body: 'At Onecore Pharma, every formulation starts with a distinct clinical question: How can this medicine make treatment more reliable, accessible, and comfortable for the patient?\n\nWe bring together rigorous research, disciplined quality oversight, and ethical supply chain standards across multi-therapeutic disciplines to serve patients and clinicians with dependable healthcare solutions.',
    image_url: '/assets/about-facility.jpg',
    items: [
      {
        stat: '09+',
        title: 'Therapeutic Specialties',
        desc: 'Comprehensive portfolio addressing clinical nuances across essential therapeutic categories.'
      },
      {
        stat: '100%',
        title: 'Quality Release Protocol',
        desc: 'Multi-tier analytical verification and strict batch release authorization before clinical distribution.'
      }
    ]
  });

  const principlesSec = getSection('principles', {
    eyebrow: 'FOUNDATIONAL PRINCIPLES',
    title: 'Principles guiding every decision.',
    subtitle: 'A disciplined framework connecting formulation science with clinical trust and everyday care.',
    items: [
      {
        title: 'Clinical Relevance',
        description: 'Focusing formulation research on real-world medical challenges and patient comfort.',
        detail: 'Aligning active pharmaceutical ingredients and delivery formats with physician feedback and daily regimen realities.',
      },
      {
        title: 'Uncompromising Quality',
        description: 'Treating quality as an intrinsic requirement from raw material intake to final market release.',
        detail: 'Adhering to strict cGMP parameters, validated analytical testing, and comprehensive batch traceability.',
      },
      {
        title: 'Responsible Stewardship',
        description: 'Building lasting partnerships and adopting sustainable manufacturing standards.',
        detail: 'Committed to ethical commercial practices, continuous pharmacovigilance, and long-term healthcare integrity.',
      },
    ]
  });

  const commitmentsSec = getSection('commitments', {
    eyebrow: 'OUR COMMITMENTS',
    title: 'Disciplined science, human focus.',
    subtitle: 'Connecting clinical insight with dependable pharmaceutical manufacturing to deliver medicines people can trust.',
    items: [
      {
        icon: 'Layers',
        title: 'Therapeutic Breadth',
        text: 'Developing specialized portfolios across essential medical disciplines including General Medicine, Paediatrics, ENT, Orthopaedics, and Oncology.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Formulation Integrity',
        text: 'Every batch is verified through rigorous stability testing, identity verification, and multi-stage analytical checkpoints.',
      },
      {
        icon: 'HeartPulse',
        title: 'Patient Centricity',
        text: 'Creating clear, transparent product information and reliable supply chains to support continuity in everyday care.',
      },
    ]
  });

  const finalCtaSec = getSection('final_cta', {
    title: 'Explore our therapeutic specialties and quality disciplines.',
    body: 'Discover how our formulations serve diverse clinical disciplines with dependable consistency.',
    cta_text: 'Areas of Care',
    cta_url: '/areas-of-care',
    secondary_cta_text: 'Quality Standards',
    secondary_cta_url: '/quality-manufacturing',
  });

  const renderCommitmentIcon = (iconName, idx) => {
    if (iconName === 'ShieldCheck' || idx === 1) return <ShieldCheck className="w-5 h-5" />;
    if (iconName === 'HeartPulse' || idx === 2) return <HeartPulse className="w-5 h-5" />;
    return <Layers className="w-5 h-5" />;
  };

  // Helper to split foundation body if multiple paragraphs exist
  const foundationParagraphs = (foundationSec.body || '').split('\n\n').filter(Boolean);

  return (
    <div className="w-full bg-brand-ivory text-brand-text">
      {/* =========================================================================
          SECTION 1 — HERO / EDITORIAL STATEMENT & VIDEO COMPOSITION
          ========================================================================= */}
      {heroSec.is_active && (
        <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pb-32 border-b border-brand-border/60 bg-gradient-to-b from-brand-surface/60 to-brand-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Heading & Supporting Text */}
              <div className="lg:col-span-6 space-y-6 sm:space-y-8">
                <ScrollReveal>
                  <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl xl:text-5xl font-light text-brand-dark tracking-tight leading-[1.14] whitespace-pre-line">
                    {heroSec.title || 'Purposeful formulations. Dependable quality. Patient-centered care.'}
                  </h1>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <p className="text-base sm:text-lg lg:text-xl text-brand-muted leading-relaxed font-normal max-w-xl whitespace-pre-line">
                    {heroSec.body || 'Onecore Pharma is built around the belief that modern pharmaceutical science achieves its highest impact when aligned closely with the clinical reality of patients and doctors.'}
                  </p>
                </ScrollReveal>
              </div>

              {/* Right Column: Video / Visual Composition */}
              <div className="lg:col-span-6">
                <ScrollReveal delay={0.15} direction="left">
                  <div className="relative rounded-sm overflow-hidden border border-brand-border shadow-sm bg-brand-dark aspect-[16/9] flex items-center justify-center group">
                    {heroSec.video_url ? (
                      <video
                        src={heroSec.video_url}
                        poster={heroSec.poster_url || heroSec.image_url || '/assets/about-video-poster.jpg'}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <FallbackImage
                          src={heroSec.poster_url || heroSec.image_url || '/assets/about-video-poster.jpg'}
                          alt="Onecore Pharma pharmaceutical science and clinical care"
                          aspectRatio="aspect-[16/9]"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 2 — STRATEGIC FOUNDATION & VISION
          ========================================================================= */}
      {foundationSec.is_active && (
        <section className="py-24 sm:py-32 bg-white border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-20">
            {/* Chapter Title & Dual Strategic Framework */}
            <div className="space-y-10">
              <ScrollReveal>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight whitespace-pre-line">
                  {foundationSec.title || 'Our Foundation & Vision'}
                </h2>
              </ScrollReveal>

              {/* Dual Strategic Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-2">
                <div className="lg:col-span-6 space-y-3">
                  <ScrollReveal delay={0.05}>
                    <h3 className="text-xl sm:text-2xl font-medium text-brand-dark tracking-tight">
                      Clinical Question & Foundation
                    </h3>
                    <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
                      {foundationParagraphs[0] || 'At Onecore Pharma, every formulation starts with a distinct clinical question: How can this medicine make treatment more reliable, accessible, and comfortable for the patient?'}
                    </p>
                  </ScrollReveal>
                </div>

                <div className="lg:col-span-6 lg:border-l lg:border-brand-border/80 lg:pl-12 space-y-3">
                  <ScrollReveal delay={0.1}>
                    <h3 className="text-xl sm:text-2xl font-medium text-brand-dark tracking-tight">
                      Disciplined Science & Vision
                    </h3>
                    <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
                      {foundationParagraphs[1] || 'We bring together rigorous research, disciplined quality oversight, and ethical supply chain standards across multi-therapeutic disciplines to serve patients and clinicians with dependable healthcare solutions.'}
                    </p>
                  </ScrollReveal>
                </div>
              </div>
            </div>

            {/* Architectural Facility Asset & Strategic Benchmarks */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
              <div className="lg:col-span-8">
                <ScrollReveal delay={0.15}>
                  <div className="relative rounded-sm overflow-hidden border border-brand-border shadow-sm h-full">
                    <FallbackImage
                      src={foundationSec.image_url || '/assets/about-facility.jpg'}
                      alt="Onecore Pharma advanced formulation research and laboratory facility"
                      aspectRatio="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10]"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </ScrollReveal>
              </div>

              {/* Strategic Operational Benchmarks Sidebar */}
              <div className="lg:col-span-4">
                <ScrollReveal delay={0.2}>
                  <div className="flex flex-col justify-between gap-8 p-8 sm:p-10 bg-brand-surface/70 border border-brand-border rounded-sm h-full">
                    {foundationSec.items.map((statItem, idx) => (
                      <div
                        key={statItem.title || idx}
                        className={`space-y-3 ${idx < foundationSec.items.length - 1 ? 'border-b border-brand-border/60 pb-8' : 'pt-2'}`}
                      >
                        <span className="text-4xl sm:text-5xl font-light text-brand-sage font-mono">
                          {statItem.stat || statItem.num || '09+'}
                        </span>
                        <h4 className="text-lg font-semibold text-brand-dark">
                          {statItem.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                          {statItem.desc || statItem.description || statItem.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3 — GUIDING PILLARS
          ========================================================================= */}
      {principlesSec.is_active && (
        <section className="py-20 sm:py-28 bg-brand-surface/60 border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="max-w-3xl space-y-3">
              <ScrollReveal>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight whitespace-pre-line">
                  {principlesSec.title || 'Principles guiding every decision.'}
                </h2>
                <p className="text-base sm:text-lg text-brand-muted leading-relaxed whitespace-pre-line">
                  {principlesSec.subtitle || 'A disciplined framework connecting formulation science with clinical trust and everyday care.'}
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {principlesSec.items.map((pillar, idx) => (
                <ScrollReveal key={pillar.title || idx} delay={idx * 0.08}>
                  <div className="bg-brand-ivory p-8 sm:p-10 border border-brand-border rounded-sm h-full flex flex-col justify-between space-y-6 hover:border-brand-sage/50 transition-all duration-300">
                    <div className="space-y-3">
                      <h3 className="text-xl font-medium text-brand-dark tracking-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                        {pillar.description || pillar.desc || pillar.text}
                      </p>
                    </div>
                    {(pillar.detail || pillar.footer) && (
                      <div className="pt-4 border-t border-brand-border/60 text-xs text-brand-muted leading-relaxed">
                        {pillar.detail || pillar.footer}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4 — OUR COMMITMENTS
          ========================================================================= */}
      {commitmentsSec.is_active && (
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-14">
            <div className="max-w-3xl space-y-3">
              <ScrollReveal>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight whitespace-pre-line">
                  {commitmentsSec.title || 'Disciplined science, human focus.'}
                </h2>
                <p className="text-base sm:text-lg text-brand-muted leading-relaxed whitespace-pre-line">
                  {commitmentsSec.subtitle || 'Connecting clinical insight with dependable pharmaceutical manufacturing to deliver medicines people can trust.'}
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {commitmentsSec.items.map((item, idx) => (
                <ScrollReveal key={item.title || idx} delay={idx * 0.08}>
                  <div className="bg-brand-ivory p-8 sm:p-10 border border-brand-border rounded-sm h-full space-y-4 hover:border-brand-sage/50 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-brand-sage">
                      {renderCommitmentIcon(item.icon, idx)}
                    </div>
                    <h3 className="text-xl font-medium text-brand-dark tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                      {item.text || item.desc || item.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5 — EXPLORATION & CONTACT CTA
          ========================================================================= */}
      {finalCtaSec.is_active && (
        <section className="py-20 sm:py-24 bg-brand-dark text-white border-t border-brand-border-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-between">
              <div className="lg:col-span-8 space-y-3">
                <ScrollReveal>
                  <h2 className="editorial-heading text-3xl sm:text-4xl font-light text-white tracking-tight whitespace-pre-line">
                    {finalCtaSec.title || 'Explore our therapeutic specialties and quality disciplines.'}
                  </h2>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl whitespace-pre-line">
                    {finalCtaSec.body || 'Discover how our formulations serve diverse clinical disciplines with dependable consistency.'}
                  </p>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-4">
                <ScrollReveal delay={0.1}>
                  <Link
                    to={finalCtaSec.cta_url || '/areas-of-care'}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-sage-light text-brand-dark text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-white transition-all duration-200"
                  >
                    <span>{finalCtaSec.cta_text || 'Areas of Care'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {finalCtaSec.secondary_cta_text && (
                    <Link
                      to={finalCtaSec.secondary_cta_url || '/quality-manufacturing'}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-transparent border border-white/30 text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-white/10 transition-all duration-200"
                    >
                      <span>{finalCtaSec.secondary_cta_text}</span>
                    </Link>
                  )}
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
