import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Microscope, Layers } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import HeroResponsiveImage from '../components/HeroResponsiveImage';
import { useCmsPage } from '../hooks/useCmsPage';
import { assetUrl } from '../utils/assetUrl';
import PageSkeleton from '../components/PageSkeleton';

export default function QualityManufacturing() {
  const { getSection, loading: cmsLoading, isError: cmsError } = useCmsPage('quality-manufacturing');
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    document.title = "Quality & Manufacturing | Onecore Pharma";

    if (videoRef.current) {
      videoRef.current.playbackRate = 0.95;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
      }
    }
  }, []);

  const heroSec = getSection('hero', {
    eyebrow: 'QUALITY & MANUFACTURING',
    title: 'Quality is part of the product from the beginning.',
    body: 'At Onecore Pharma, quality is not treated as a final checkpoint. It is considered throughout the product journey, from formulation and sourcing to manufacturing, testing and responsible release.',
    image_url: '/assets/quality.jpg',
    video_url: '/assets/quality-manufacturing.mp4',
    cta_text: 'Quality Principles',
    cta_url: '#principles',
    secondary_cta_text: 'Explore Formulations',
    secondary_cta_url: '/areas-of-care',
  });

  const principlesSec = getSection('principles', {
    eyebrow: 'FOUNDATIONAL PRINCIPLES',
    title: 'Principles that guide our quality approach.',
    body: '',
    items: [
      {
        title: "Consistent Standards",
        desc: "Quality begins with clear specifications, controlled processes and consistent standards across the entire product lifecycle.",
      },
      {
        title: "Responsible Release",
        desc: "Products are released only after the appropriate quality requirements, testing assays, and regulatory checks have been completed.",
      },
      {
        title: "Controlled Processes",
        desc: "Manufacturing and quality processes are designed to support consistency, traceability and dependable clinical product performance.",
      },
      {
        title: "Continuous Improvement",
        desc: "We continuously look for opportunities to strengthen analytical methods, improve batch reliability and support better healthcare outcomes.",
      },
    ]
  });

  const manufacturingSec = getSection('manufacturing_standards') || getSection('manufacturing_excellence') || getSection('manufacturing_standards', {
    eyebrow: 'MANUFACTURING DISCIPLINES',
    title: 'Manufacturing with discipline and control.',
    body: 'Onecore formulations are produced in qualified manufacturing environments adhering strictly to cGMP and regulatory standards.',
    image_url: '/assets/pharma.jpg',
    items: [
      {
        title: 'Validated Processes',
        desc: 'Equipment calibration, automated dosing precision, and continuous environmental cleanroom monitoring.'
      },
      {
        title: 'Batch Traceability',
        desc: 'End-to-end documentation, analytical audit logs, and complete ingredient traceability across the supply chain.'
      }
    ]
  });

  const assuranceSec = getSection('assurance_steps', {
    eyebrow: 'QUALITY ASSURANCE',
    title: 'Controls throughout the lifecycle.',
    subtitle: '',
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

  if (cmsLoading && !cmsError) {
    return <PageSkeleton />;
  }

  return (
    <div className="w-full bg-transparent text-[#121212]">
      
      {/* =========================================================================
          SECTION 1 — CINEMATIC MANUFACTURING VIDEO HERO
          Headline & body overlaid directly on video with contrast grading & smooth looping
          ========================================================================= */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-end pb-16 sm:pb-24 pt-32 px-4 sm:px-8 lg:px-12 bg-[#071324] overflow-hidden">
        {/* Background Video or Responsive Mobile Image */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#071324]">
          {/* Mobile view if a dedicated mobile hero image is uploaded */}
          {heroSec.image_mobile_url ? (
            <div className="block md:hidden w-full h-full">
              <HeroResponsiveImage
                desktopImage={heroSec.image_url}
                mobileImage={heroSec.image_mobile_url}
                alt={heroSec.heading || heroSec.title || 'Onecore Pharma Quality and Manufacturing'}
                fallback="/assets/quality.jpg"
                className="w-full h-full object-cover object-center"
              />
            </div>
          ) : null}

          {/* High Performance Video (Desktop or default fallback) */}
          <div className={`w-full h-full ${heroSec.image_mobile_url ? 'hidden md:block' : 'block'}`}>
            <video
              ref={videoRef}
              src={assetUrl(heroSec.video_url || '/assets/quality-manufacturing.mp4')}
              poster={assetUrl(heroSec.poster_url || heroSec.image_url || '/assets/quality.jpg')}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              onLoadedData={() => setVideoReady(true)}
              className={`w-full h-full object-cover object-center scale-[1.01] transition-opacity duration-500 ${videoReady ? 'opacity-100' : 'opacity-90'}`}
            />
          </div>

          {/* Clean minimal readable vignette — heavy black film removed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Hero Content Block Overlaid On Video */}
        <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-light text-white tracking-tight leading-[1.05] max-w-4xl text-balance">
              Quality is part of the product <br />
              <span className="italic font-normal text-[#FF5A4E]">from the beginning.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="text-base sm:text-xl lg:text-2xl text-white/90 font-light leading-relaxed font-sans max-w-3xl">
              {heroSec.body || 'At Onecore Pharma, quality is not treated as a final checkpoint. It is considered throughout the product journey, from formulation and sourcing to manufacturing, testing and responsible release.'}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.14}>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  const targetId = (heroSec.cta_url || '#principles').replace(/^#/, '');
                  const el = document.getElementById(targetId);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#D52B1E] hover:bg-[#B52015] text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <span>{heroSec.cta_text || 'Quality Principles'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/areas-of-care"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors border border-white/25 backdrop-blur-sm"
              >
                <span>Explore Formulations</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — FOUNDATIONAL PRINCIPLES (4 Cards)
          ========================================================================= */}
      {principlesSec.is_active && (
        <section id="principles" className="py-10 sm:py-14 px-4 sm:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-tight">
                {principlesSec.title || 'Principles that guide our quality approach.'}
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principlesSec.items.map((item, idx) => (
              <ScrollReveal key={item.title || idx} delay={idx * 0.08}>
                <div className="bg-white/80 backdrop-blur-xs border border-[#E5E3DC] hover:border-[#121212] p-8 rounded-3xl h-full flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all duration-300">
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-[#D52B1E] font-bold block">
                      0{idx + 1}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#121212] tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#555555] leading-relaxed font-sans">
                      {item.desc || item.description || item.text}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3 — MANUFACTURING DISCIPLINES & EMBEDDED VIDEO
          Client-provided manufacturing process video embed
          ========================================================================= */}
      {manufacturingSec.is_active && (
        <section className="py-12 sm:py-16 bg-transparent border-y border-[#E5E3DC]/80 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Image Visual Frame */}
              <div className="lg:col-span-7 order-2 lg:order-1">
                <ScrollReveal delay={0.1}>
                  <div className="relative rounded-[28px] overflow-hidden border border-[#E5E3DC] shadow-lg aspect-video bg-[#FAF9F6]">
                    <img
                      src={assetUrl(manufacturingSec.image_url || '/assets/pharma.jpg')}
                      alt="Onecore Pharma Manufacturing & Facility Operations"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/pharma.jpg';
                      }}
                    />
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
                <ScrollReveal>
                  <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-tight">
                    {manufacturingSec.title || 'Manufacturing with discipline and control.'}
                  </h2>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed">
                    {manufacturingSec.body || 'Onecore formulations are produced in qualified manufacturing environments adhering strictly to cGMP and regulatory standards.'}
                  </p>
                </ScrollReveal>

                {manufacturingSec.items && manufacturingSec.items.length > 0 && (
                  <ScrollReveal delay={0.15}>
                    <div className="pt-4 border-t border-[#E5E3DC] space-y-4">
                      {manufacturingSec.items.map((bullet, idx) => (
                        <div key={bullet.title || idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#E5E3DC]">
                          <CheckCircle2 className="w-5 h-5 text-[#00A859] shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-bold text-[#121212]">{bullet.title}</h4>
                            <p className="text-xs text-[#555555] mt-1 leading-relaxed">{bullet.desc || bullet.description || bullet.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>
                )}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4 — QUALITY ASSURANCE (6-Step Lifecycle Grid)
          ========================================================================= */}
      {assuranceSec.is_active && (
        <section className="pt-10 sm:pt-14 pb-16 sm:pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-tight">
                {assuranceSec.title || 'Controls throughout the lifecycle.'}
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assuranceSec.items.map((step, idx) => (
              <ScrollReveal key={step.title || idx} delay={idx * 0.06}>
                <div className="bg-white/80 backdrop-blur-xs border border-[#E5E3DC] hover:border-[#121212] p-8 rounded-3xl h-full flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all duration-300">
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-[#D52B1E] font-bold block">
                      Stage 0{idx + 1}
                    </span>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-[#121212] tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#555555] leading-relaxed font-sans">
                      {step.desc || step.description || step.text}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
