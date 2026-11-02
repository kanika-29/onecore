import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import HeroResponsiveImage from '../components/HeroResponsiveImage';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCmsPage } from '../hooks/useCmsPage';
import { assetUrl } from '../utils/assetUrl';
import PageSkeleton from '../components/PageSkeleton';

export default function About() {
  const { getSection, loading: cmsLoading, isError: cmsError } = useCmsPage('about');

  useEffect(() => {
    document.title = "About Onecore | Purposeful Formulations, Dependable Quality";
  }, []);

  const heroSec = getSection('hero', {
    eyebrow: 'ABOUT ONECORE',
    title: 'Built around clinical reality. Guided by patient trust.',
    body: 'Onecore Pharma is built around the belief that modern pharmaceutical science achieves its highest impact when aligned closely with the clinical reality of patients and doctors.',
    image_url: '/assets/about-facility.jpg',
  });

  const visionMissionSec = getSection('mission_vision', {
    eyebrow: 'VISION & MISSION',
    items: [
      {
        title: 'Our Vision',
        desc: 'To become one of India’s most trusted healthcare companies, shaping better health and better lives through quality, innovation and purpose.'
      },
      {
        title: 'Our Mission',
        desc: 'To provide the medical fraternity with trusted medicines and innovative healthcare solutions, while empowering our people and stakeholders through intellectual, professional and financial growth.'
      }
    ]
  });

  const foundationSec = getSection('foundation', {
    eyebrow: 'OUR FOUNDATION',
    title: 'Our Foundation & Vision',
    body: 'At Onecore Pharma, every formulation starts with a distinct clinical question: How can this medicine make treatment more reliable, accessible, and comfortable for the patient?\n\nWe bring together rigorous research, disciplined quality oversight, and ethical supply chain standards across multi-therapeutic disciplines to serve patients and clinicians with dependable healthcare solutions.',
    image_url: '/assets/quality.jpg',
    items: [
      {
        stat: '60+',
        title: 'Prescription Formulations',
        desc: 'Formulations engineered across essential oral solids, liquids, and specialized complexes.'
      },
      {
        stat: '09',
        title: 'Therapeutic Disciplines',
        desc: 'Comprehensive portfolios spanning Gynaecology, Orthopaedics, Neurology, Pediatrics, and Oncology.'
      },
      {
        stat: '100%',
        title: 'Batch Quality Protocol',
        desc: 'Multi-tier analytical testing and disciplined batch release authorization before clinical distribution.'
      }
    ]
  });

  const principlesSec = getSection('principles', {
    eyebrow: 'FOUNDATIONAL PRINCIPLES',
    title: 'Principles guiding every decision.',
    subtitle: '',
    image_url: '/assets/healthcare-professionals.jpg',
    items: [
      {
        title: 'Clinical Relevance',
        description: 'Focusing formulation research on real-world medical challenges, physician feedback, and patient comfort.',
        detail: 'Aligning active ingredients and pharmacokinetic profiles with physician guidance and daily regimen realities.',
      },
      {
        title: 'Uncompromising Quality',
        description: 'Treating quality as an intrinsic requirement from raw material intake through to packaging and release.',
        detail: 'Adhering to strict cGMP parameters, validated analytical testing, and comprehensive batch traceability.',
      },
      {
        title: 'Responsible Stewardship',
        description: 'Building lasting clinical partnerships and upholding ethical standards across the healthcare supply chain.',
        detail: 'Committed to ethical commercial practices, continuous pharmacovigilance, and long-term medical trust.',
      },
    ]
  });

  const commitmentsSec = getSection('commitments', {
    eyebrow: 'OUR COMMITMENTS',
    title: 'Disciplined science, human focus.',
    subtitle: 'Connecting clinical insight with dependable pharmaceutical manufacturing to deliver medicines people can trust.',
    image_url: '/assets/two-perspectives.jpg',
    items: [
      {
        title: 'Therapeutic Breadth',
        text: 'Developing specialized portfolios across essential medical disciplines including General Medicine, Paediatrics, ENT, Orthopaedics, and Oncology.',
      },
      {
        title: 'Formulation Integrity',
        text: 'Every batch is verified through rigorous stability testing, identity verification, and multi-stage analytical checkpoints.',
      },
      {
        title: 'Patient Centricity',
        text: 'Creating clear, transparent product information and reliable supply chains to support continuity in everyday care.',
      },
    ]
  });

  const finalCtaSec = getSection('final_cta', {
    title: 'Explore our therapeutic specialties and quality disciplines.',
    body: 'Discover how our formulations serve diverse clinical disciplines with dependable consistency and uncompromising standards.',
    cta_text: 'Areas of Care',
    cta_url: '/areas-of-care',
    secondary_cta_text: 'Quality Standards',
    secondary_cta_url: '/quality-manufacturing',
  });

  const foundationParagraphs = (foundationSec.body || '').split('\n\n').filter(Boolean);

  // Filter out any extra items so there are STRICTLY the 2 authentic client cards
  const authenticVisionMission = (visionMissionSec.items || []).filter(
    (item) => item.title && !item.title.toLowerCase().includes('purpose')
  ).slice(0, 2);

  if (cmsLoading && !cmsError) {
    return <PageSkeleton />;
  }

  return (
    <div className="w-full bg-transparent text-[#121212] overflow-x-hidden">
      
      {/* =========================================================================
          SECTION 1 — HERO BANNER
          Clean, stately, high-contrast human photography with bold typography
          ========================================================================= */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-end pb-16 sm:pb-24 pt-32 px-4 sm:px-8 lg:px-12 bg-black">
        {/* Hero Background Responsive Photograph */}
        <div className="absolute inset-0 z-0">
          <HeroResponsiveImage
            desktopImage={heroSec.image_url}
            mobileImage={heroSec.image_mobile_url || heroSec.mobile_image_url}
            alt="Onecore Pharma formulation and manufacturing facility"
            fallback="/assets/about-facility.jpg"
            className="w-full h-full object-cover object-center"
          />
          {/* Directional contrast gradient — lessened intensity */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent pointer-events-none" />
        </div>

        {/* Hero Content Block */}
        <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-light text-white tracking-tight leading-[1.04] max-w-4xl">
              Built around clinical reality. <br />
              <span className="italic font-normal text-[#D52B1E]">Guided by patient trust.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-base sm:text-xl lg:text-2xl text-white/90 font-light leading-relaxed font-sans max-w-3xl">
              {heroSec.body || 'Onecore Pharma is built around the belief that modern pharmaceutical science achieves its highest impact when aligned closely with the clinical reality of patients and doctors.'}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — AUTHENTIC VISION & MISSION CARDS (STRICTLY 2 CARDS)
          Crimson accent styling matching the black, white, and red brand palette
          ========================================================================= */}
      <section className="py-10 sm:py-14 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#121212] tracking-tight">
              Vision & Mission
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-4">
            {authenticVisionMission.map((item, idx) => (
              <ScrollReveal key={item.title || idx} delay={idx * 0.1}>
                <div className="p-8 sm:p-12 rounded-3xl bg-white/80 backdrop-blur-xs border border-[#E5E3DC] border-l-[4px] border-l-[#D52B1E] shadow-xs hover:shadow-md transition-all duration-300 space-y-4 h-full flex flex-col justify-center">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#121212]">
                    {item.title}
                  </h3>
                  <p className="text-base sm:text-lg text-[#555555] leading-relaxed font-light font-sans">
                    {item.desc || item.description || item.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — STRATEGIC FOUNDATION & LABORATORY SCIENCE (RICH VISUALS)
          ========================================================================= */}
      {foundationSec.is_active && (
        <section className="py-12 sm:py-16 bg-transparent border-y border-[#E5E3DC]/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8 sm:space-y-10">
            
            <div className="space-y-8">
              <ScrollReveal>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#121212] tracking-tight leading-tight">
                  {foundationSec.title || 'Our Foundation & Vision'}
                </h2>
              </ScrollReveal>

              {/* Split Narrative with Laboratory Visual */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center pt-4">
                
                <div className="lg:col-span-6 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-serif font-medium text-[#121212]">
                      Clinical Question & Foundation
                    </h3>
                    <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed font-sans">
                      {foundationParagraphs[0] || 'At Onecore Pharma, every formulation starts with a distinct clinical question: How can this medicine make treatment more reliable, accessible, and comfortable for the patient?'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-2xl font-serif font-medium text-[#121212]">
                      Disciplined Science & Integrity
                    </h3>
                    <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed font-sans">
                      {foundationParagraphs[1] || 'We bring together rigorous research, disciplined quality oversight, and ethical supply chain standards across multi-therapeutic disciplines to serve patients and clinicians with dependable healthcare solutions.'}
                    </p>
                  </div>
                </div>

                {/* Laboratory Image */}
                <div className="lg:col-span-6">
                  <div className="rounded-3xl overflow-hidden border border-[#E5E3DC] shadow-sm aspect-[4/3] bg-[#FAF9F6]">
                    <img
                      src={assetUrl(foundationSec.image_url || '/assets/internet/lab-chemistry.jpg')}
                      alt="Onecore Pharma laboratory analytics and research"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/internet/lab-chemistry.jpg';
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Strategic Operational Benchmarks Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E5E3DC]">
              {foundationSec.items.map((statItem, idx) => (
                <ScrollReveal key={statItem.title || idx} delay={idx * 0.08}>
                  <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-xs border border-[#E5E3DC] space-y-3 h-full flex flex-col justify-between">
                    <div>
                      <span className="text-4xl sm:text-5xl font-serif font-light text-[#D52B1E] block mb-2">
                        {statItem.stat || statItem.num}
                      </span>
                      <h4 className="text-lg font-serif font-medium text-[#121212] tracking-tight">
                        {statItem.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#555555] font-light leading-relaxed pt-2">
                      {statItem.desc || statItem.description || statItem.text}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4 — FOUNDATIONAL PRINCIPLES WITH CLINICAL DIALOGUE IMAGERY
          ========================================================================= */}
      {principlesSec.is_active && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10">
          
          {/* Full-Width Image Banner with Text Overlay */}
          <ScrollReveal>
            <div className="relative rounded-[28px] sm:rounded-3xl overflow-hidden border border-[#E5E3DC] shadow-sm min-h-[320px] sm:min-h-[400px] lg:min-h-[440px] flex items-end bg-black">
              {/* Background Doctor Consultation Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={assetUrl(principlesSec.image_url || '/assets/healthcare-professionals.jpg')}
                  alt="Principles guiding every decision — Healthcare professional consultation in Indian clinical practice"
                  className="w-full h-full object-cover object-center opacity-85 brightness-90"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/healthcare-professionals.jpg';
                  }}
                />
                {/* Contrast Gradients for Clear Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
              </div>

              {/* Text Overlay directly on top of the image */}
              <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-3xl">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-white tracking-tight leading-[1.08] text-balance">
                  {principlesSec.title || 'Principles guiding every decision.'}
                </h2>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {principlesSec.items.map((pillar, idx) => (
              <ScrollReveal key={pillar.title || idx} delay={idx * 0.08}>
                <div className="bg-white/80 backdrop-blur-xs p-8 sm:p-10 rounded-3xl border border-[#E5E3DC] hover:border-[#121212] transition-all duration-300 h-full flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md">
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-[#D52B1E] font-semibold block">
                      0{idx + 1}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#121212] tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed font-sans">
                      {pillar.description || pillar.desc || pillar.text}
                    </p>
                  </div>
                  {(pillar.detail || pillar.footer) && (
                    <div className="pt-4 border-t border-[#E5E3DC] text-xs text-[#777777] font-light leading-relaxed">
                      {pillar.detail || pillar.footer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

        </section>
      )}

      {/* =========================================================================
          SECTION 5 — DISCIPLINED COMMITMENTS (RICH PATIENT PERSPECTIVE)
          ========================================================================= */}
      {commitmentsSec.is_active && (
        <section className="py-12 sm:py-16 bg-transparent border-t border-[#E5E3DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <ScrollReveal>
              <div className="relative rounded-[28px] sm:rounded-3xl overflow-hidden border border-[#E5E3DC] shadow-sm bg-black">
                {/* Background Two-Perspectives Photograph */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={assetUrl(commitmentsSec.image_url || '/assets/two-perspectives.jpg')}
                    alt="Doctor and patient perspective in everyday care — Disciplined science, human focus"
                    className="w-full h-full object-cover object-center opacity-75 brightness-90"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/two-perspectives.jpg';
                    }}
                  />
                  {/* Contrast Gradients for Clear Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/45" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
                </div>

                {/* Overlay Content Block */}
                <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col justify-between space-y-10 sm:space-y-12">
                  {/* Top: Header & Description */}
                  <div className="max-w-3xl space-y-4">
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-white tracking-tight leading-[1.08] text-balance">
                      {commitmentsSec.title || 'Disciplined science, human focus.'}
                    </h2>
                    <p className="text-base sm:text-xl text-white/90 font-light leading-relaxed font-sans max-w-2xl">
                      {commitmentsSec.subtitle || 'Connecting clinical insight with dependable pharmaceutical manufacturing to deliver medicines people can trust.'}
                    </p>
                  </div>

                  {/* Bottom: 3 Content Blocks over the image */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-6 border-t border-white/20">
                    {commitmentsSec.items.map((item, idx) => (
                      <div key={item.title || idx} className="space-y-2.5">
                        <span className="text-xs font-mono text-red-400 font-bold block">
                          0{idx + 1}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-serif font-medium text-white tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed font-sans">
                          {item.text || item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 6 — STATELY EDITORIAL CTA
          ========================================================================= */}
      <section className="py-12 sm:py-16 bg-[#121212] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight leading-tight text-balance">
            Explore our therapeutic specialties <br className="hidden sm:inline" />and quality disciplines.
          </h2>
          <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            {finalCtaSec.body || 'Discover how our formulations serve diverse clinical disciplines with dependable consistency and uncompromising standards.'}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={finalCtaSec.cta_url || '/areas-of-care'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-lg"
            >
              <span>{finalCtaSec.cta_text || 'Areas of Care'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={finalCtaSec.secondary_cta_url || '/quality-manufacturing'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors border border-white/15"
            >
              <span>{finalCtaSec.secondary_cta_text || 'Quality Standards'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
