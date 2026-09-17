import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldAlert, Sparkles, ArrowDown, ArrowRight, Layers, FileCheck2, Info, Plus } from 'lucide-react';
import SectionEyebrow from '../components/SectionEyebrow';
import ScrollReveal from '../components/ScrollReveal';
import FallbackImage from '../components/FallbackImage';
import PageBanner from '../components/PageBanner';
import { useProduct } from '../hooks/useProduct';

export default function ProductOneFlexo() {
  const [activeSection, setActiveSection] = useState('description');
  const { product } = useProduct('oneflexo');

  useEffect(() => {
    document.title = "OneFLEXO | Orthopaedics | Onecore Pharma";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Learn about OneFLEXO, its formulation, composition and product information from Onecore Pharma."
      );
    }
  }, []);

  // Sticky sub-navigation scrollspy
  useEffect(() => {
    const sectionIds = ['description', 'composition', 'benefits', 'dosage', 'mechanism', 'safety'];
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'description', label: 'Description' },
    { id: 'composition', label: 'Composition' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'dosage', label: 'Dosage' },
    { id: 'mechanism', label: 'Mechanism' },
    { id: 'safety', label: 'Safety' },
  ];

  // Dynamic Compositions or Fallback
  const compositionItems = (product?.compositions && product.compositions.length > 0)
    ? product.compositions.map((c, i) => ({
        num: String(i + 1).padStart(2, '0'),
        name: c.ingredient_name,
        subtitle: c.ingredient_subtitle || '',
        amount: c.amount || '',
        role: c.role_description || '',
      }))
    : [
        {
          num: "01",
          name: "Aflapin®",
          subtitle: "Boswellia serrata gum resin extract",
          amount: "100 mg",
          role: "Standardized Boswellia extract specialized in joint comfort."
        },
        {
          num: "02",
          name: "Native Type II Collagen",
          subtitle: "Undenatured collagen Type II",
          amount: "40 mg",
          role: "Intact molecular collagen supporting joint cartilage integrity."
        },
        {
          num: "03",
          name: "Mobilee®",
          subtitle: "Sodium hyaluronate, polysaccharides and collagen complex",
          amount: "40 mg",
          role: "Patented hyaluronic acid matrix supporting joint fluid nourishment."
        }
      ];

  // Dynamic Benefits or Fallback
  const benefitItems = (product?.benefits && product.benefits.length > 0)
    ? product.benefits.map((b, i) => ({
        num: String(i + 1).padStart(2, '0'),
        title: b.title,
        description: b.description,
      }))
    : [
        {
          num: "01",
          title: "JOINT COMFORT",
          description: "Supports the formulation’s role in maintaining comfort during everyday movement."
        },
        {
          num: "02",
          title: "MOBILITY",
          description: "Designed to support mobility as part of an overall musculoskeletal care approach."
        },
        {
          num: "03",
          title: "JOINT STRUCTURE SUPPORT",
          description: "Combines ingredients selected for complementary roles in joint and connective tissue support."
        }
      ];

  // Dynamic Safety or Fallback
  const safetyCategories = (product?.safety_sections && product.safety_sections.length > 0)
    ? product.safety_sections.map((s) => ({
        title: s.section_title?.toUpperCase(),
        placeholder: s.content || "Approved product safety information to be added.",
      }))
    : [
        {
          title: "WHO SHOULD NOT USE THIS PRODUCT",
          placeholder: "Approved product safety information to be added."
        },
        {
          title: "WARNINGS AND PRECAUTIONS",
          placeholder: "Approved product safety information to be added."
        },
        {
          title: "PREGNANCY AND BREASTFEEDING",
          placeholder: "Approved product safety information to be added."
        },
        {
          title: "POSSIBLE SIDE EFFECTS",
          placeholder: "Approved product safety information to be added."
        },
        {
          title: "INTERACTIONS",
          placeholder: "Approved product safety information to be added."
        }
      ];

  const brandName = product?.brand_name || 'OneFLEXO';
  const packshotUrl = product?.packshot_url || '/assets/products/oneflexo-packshot.png';
  const tagline = product?.tagline || 'ONECORE PHARMA // SPECIALISED JOINT FORMULATION';

  return (
    <div className="w-full bg-brand-ivory text-brand-text">
      {/* =========================================================================
          SECTION 1 — HERO / BANNER
          ========================================================================= */}
      <PageBanner
        title="OneFLEXO"
        imageUrl="/assets/therapeutic-orthopaedics.jpg"
        imageAlt="OneFLEXO - Onecore Pharma"
      />

      {/* =========================================================================
          SECTION 9 — STICKY SUB-NAVIGATION
          ========================================================================= */}
      <nav
        aria-label="Product sections"
        className="sticky top-[72px] z-30 bg-brand-ivory/95 backdrop-blur-md border-y border-brand-border py-3.5 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-dark hidden md:inline">
              {brandName} Monograph
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none no-scrollbar w-full md:w-auto justify-start md:justify-end">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-brand-dark text-white shadow-sm'
                        : 'text-brand-muted hover:text-brand-dark hover:bg-brand-surface'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          SECTION 2 — DESCRIPTION
          ========================================================================= */}
      <section id="description" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left 40% Heading & Label */}
          <div className="lg:col-span-5 space-y-4">
            <ScrollReveal>
              <SectionEyebrow>DESCRIPTION</SectionEyebrow>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight">
                {brandName}
              </h2>
              <div className="h-[2px] w-12 bg-brand-sage/40 mt-4" />
            </ScrollReveal>
          </div>

          {/* Right 60% Editorial Text Block */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal delay={0.1}>
              <div className="space-y-4 text-brand-muted text-lg sm:text-xl leading-relaxed">
                <p>
                  {product?.description || `${brandName} is a specialised joint health formulation that combines Aflapin®, native undenatured Type II collagen and Mobilee® in a single capsule.`}
                </p>
                <p className="text-base sm:text-lg text-brand-muted/90">
                  The formulation is designed to bring together complementary ingredients used in musculoskeletal and joint support.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — COMPOSITION
          ========================================================================= */}
      <section id="composition" className="py-20 sm:py-28 bg-brand-surface border-y border-brand-border scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-3xl space-y-4">
            <ScrollReveal>
              <SectionEyebrow>COMPOSITION</SectionEyebrow>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight">
                Active Formulation Ingredients
              </h2>
              <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
                Each hard gelatin capsule delivers a standardized triad of active joint health components.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {compositionItems.map((item, idx) => (
              <ScrollReveal key={item.name} delay={idx * 0.08}>
                <div className="bg-brand-ivory border border-brand-border p-8 rounded-sm h-full flex flex-col justify-between space-y-6 shadow-sm">
                  <div className="space-y-4">
                    <span className="text-3xl font-light font-mono text-brand-sage block">
                      {item.num}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-brand-dark tracking-tight">
                        {item.name}
                      </h3>
                      {item.subtitle && (
                        <p className="text-xs text-brand-muted italic mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="py-2 border-y border-brand-border/60">
                      <span className="text-2xl font-light font-mono text-brand-dark font-bold">
                        {item.amount}
                      </span>
                    </div>
                    <p className="text-sm text-brand-muted leading-relaxed">
                      {item.role}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — BENEFITS
          ========================================================================= */}
      <section id="benefits" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="space-y-16">
          <div className="max-w-3xl space-y-4">
            <ScrollReveal>
              <SectionEyebrow>PURPOSE & BENEFITS</SectionEyebrow>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight">
                Designed for Functional Support
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-brand-border pt-8">
            {benefitItems.map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 0.08}>
                <div className="space-y-4 p-6 bg-brand-surface/40 border border-brand-border/70 rounded-sm">
                  <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-sage">
                    BENEFIT // {item.num}
                  </span>
                  <h3 className="text-xl font-medium text-brand-dark tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — DOSAGE & ADMINISTRATION
          ========================================================================= */}
      <section id="dosage" className="py-20 sm:py-28 bg-brand-surface border-y border-brand-border scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ScrollReveal>
            <SectionEyebrow>DOSAGE & ADMINISTRATION</SectionEyebrow>
            <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight">
              Recommended Use
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-6 bg-brand-ivory p-8 sm:p-10 border border-brand-border rounded-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-sage font-semibold">
                  STANDARD REGIMEN
                </span>
                <p className="text-2xl sm:text-3xl font-light text-brand-dark">
                  1 Capsule Daily
                </p>
                <p className="text-sm text-brand-muted leading-relaxed">
                  Or as directed by your treating healthcare professional. Take with water, preferably alongside a meal.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 bg-brand-ivory p-8 sm:p-10 border border-brand-border rounded-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-sage font-semibold">
                  CLINICAL GUIDELINES
                </span>
                <ul className="space-y-2 text-sm text-brand-muted">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-sage mt-2 shrink-0" />
                    <span>Swallow whole. Do not open or chew the capsule.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-sage mt-2 shrink-0" />
                    <span>Store below 25°C in a dry place away from direct sunlight.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-sage mt-2 shrink-0" />
                    <span>Keep out of reach of children.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — SAFETY INFORMATION
          ========================================================================= */}
      <section id="safety" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <ScrollReveal>
              <SectionEyebrow>SAFETY & PRECAUTIONS</SectionEyebrow>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight">
                Important Safety Information
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safetyCategories.map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 0.05}>
                <div className="bg-brand-surface p-6 sm:p-8 border border-brand-border rounded-sm space-y-3">
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-brand-dark">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {item.placeholder}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — FINAL CTA
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-brand-dark text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <ScrollReveal>
            <h2 className="editorial-heading text-3xl sm:text-4xl font-light text-white tracking-tight">
              Request Technical Monograph & Literature
            </h2>
            <p className="text-base text-gray-300 max-w-xl mx-auto pt-2">
              Registered physicians and orthopaedic specialists can request clinical dossiers and batch documentation.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="pt-4 flex justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-sage hover:bg-brand-sage-light text-brand-dark text-sm font-semibold uppercase tracking-wider rounded-full transition-all duration-300 shadow-sm"
              >
                <span>Request Clinical Dossier</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
