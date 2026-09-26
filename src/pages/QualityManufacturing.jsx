import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Microscope, Layers } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useCmsPage } from '../hooks/useCmsPage';
import { assetUrl } from '../utils/assetUrl';

export default function QualityManufacturing() {
  const { getSection } = useCmsPage('quality-manufacturing');

  useEffect(() => {
    document.title = "Quality & Manufacturing | Onecore Pharma";
  }, []);

  const heroSec = getSection('hero', {
    eyebrow: 'QUALITY & MANUFACTURING',
    title: 'Quality is part of the product from the beginning.',
    body: 'At Onecore Pharma, quality is not treated as a final checkpoint. It is considered throughout the product journey, from formulation and sourcing to manufacturing, testing and responsible release.',
    image_url: '/assets/quality.jpg',
    cta_text: 'Quality Principles',
    cta_url: '#principles',
    secondary_cta_text: 'Explore Formulations',
    secondary_cta_url: '/areas-of-care',
  });

  const principlesSec = getSection('principles', {
    eyebrow: 'FOUNDATIONAL PRINCIPLES',
    title: 'Principles that guide our quality approach.',
    body: 'A disciplined commitment to patient safety, regulatory compliance, and formulation excellence across every batch.',
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

  const manufacturingSec = getSection('manufacturing_standards', {
    eyebrow: 'MANUFACTURING DISCIPLINES',
    title: 'Manufacturing with discipline and control.',
    body: 'Onecore formulations are produced in qualified manufacturing environments adhering strictly to cGMP and regulatory standards.',
    image_url: '/assets/hero-healthcare.jpg',
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
    body: 'Explore the therapeutic areas and formulations that make up the Onecore portfolio, or speak with our Medical & Quality Affairs desk.',
    cta_text: 'Explore Areas of Care',
    cta_url: '/areas-of-care',
    secondary_cta_text: 'Contact Quality Team',
    secondary_cta_url: '/contact',
  });

  return (
    <div className="w-full bg-[#FAF9F6] text-[#121212]">
      
      {/* =========================================================================
          SECTION 1 — EDITORIAL HERO
          Spacious, dignified typography with signature crimson accent
          ========================================================================= */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 border-b border-[#E5E3DC] bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-[#121212] tracking-tight leading-[1.05]">
              Quality is part of the product <br />
              <span className="italic font-normal text-[#D52B1E]">from the beginning.</span>
            </h1>

            <p className="text-lg sm:text-2xl text-[#555555] font-light leading-relaxed font-sans max-w-3xl">
              {heroSec.body || 'At Onecore Pharma, quality is not treated as a final checkpoint. It is considered throughout the product journey, from formulation and sourcing to manufacturing, testing and responsible release.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={heroSec.cta_url || '#principles'}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors shadow-xs"
              >
                <span>{heroSec.cta_text || 'Quality Principles'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/areas-of-care"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FAF9F6] hover:bg-[#EBE9E1] text-[#121212] text-xs font-semibold rounded-full transition-colors border border-[#E5E3DC]"
              >
                <span>Explore Formulations</span>
              </Link>
            </div>
          </div>

          {/* Stately Full-Bleed Laboratory Visual Frame */}
          <div className="relative rounded-[28px] overflow-hidden border border-[#E5E3DC] shadow-sm aspect-[16/9] lg:aspect-[21/9] bg-[#FAF9F6]">
            <img
              src={assetUrl(heroSec.image_url || '/assets/quality.jpg')}
              alt="Quality assurance laboratory testing and analytical verification"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — FOUNDATIONAL PRINCIPLES (4 Cards)
          ========================================================================= */}
      {principlesSec.is_active && (
        <section id="principles" className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto space-y-14">
          <div className="max-w-3xl space-y-3">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-tight">
                {principlesSec.title || 'Principles that guide our quality approach.'}
              </h2>
              <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed">
                {principlesSec.body}
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principlesSec.items.map((item, idx) => (
              <ScrollReveal key={item.title || idx} delay={idx * 0.08}>
                <div className="bg-white border border-[#E5E3DC] hover:border-[#121212] p-8 rounded-3xl h-full flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all duration-300">
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
        <section className="py-20 sm:py-28 bg-white border-y border-[#E5E3DC] px-4 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Video Embed */}
              <div className="lg:col-span-7 order-2 lg:order-1">
                <ScrollReveal delay={0.1}>
                  <div className="relative rounded-[28px] overflow-hidden border border-[#E5E3DC] shadow-lg aspect-video bg-black">
                    <iframe
                      src="https://www.youtube-nocookie.com/embed/ZPH-TVw0t6Y?rel=0&modestbranding=1"
                      title="Onecore Pharma Manufacturing & Facility Operations"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
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
                        <div key={bullet.title || idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAF9F6] border border-[#E5E3DC]">
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
        <section className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto space-y-14">
          <div className="max-w-3xl space-y-3">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-tight">
                {assuranceSec.title || 'Controls throughout the lifecycle.'}
              </h2>
              <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed">
                {assuranceSec.subtitle || 'Key assurance stages designed to support formulation reliability from raw ingredient selection to clinical availability.'}
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assuranceSec.items.map((step, idx) => (
              <ScrollReveal key={step.title || idx} delay={idx * 0.06}>
                <div className="bg-white border border-[#E5E3DC] hover:border-[#121212] p-8 rounded-3xl h-full flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all duration-300">
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

      {/* =========================================================================
          SECTION 5 — FINAL CTA
          ========================================================================= */}
      {finalCtaSec.is_active && (
        <section className="py-20 sm:py-28 bg-[#121212] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center justify-between">
              
              <div className="lg:col-span-8 space-y-4">
                <ScrollReveal>
                  <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight leading-tight">
                    {finalCtaSec.title || 'Quality you can depend on.'}
                  </h2>
                  <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-2xl font-sans pt-1">
                    {finalCtaSec.body || 'Explore the therapeutic areas and formulations that make up the Onecore portfolio.'}
                  </p>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-4">
                <ScrollReveal delay={0.1}>
                  <Link
                    to="/areas-of-care"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Explore Areas of Care</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </ScrollReveal>
              </div>

            </div>
          </div>
        </section>
      )}

    </div>
  );
}
