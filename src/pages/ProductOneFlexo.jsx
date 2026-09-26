import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ArrowDown } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import PrescriptionDisclaimer from '../components/PrescriptionDisclaimer';
import { useProduct } from '../hooks/useProduct';
import { assetUrl } from '../utils/assetUrl';

export default function ProductOneFlexo() {
  const [activeSection, setActiveSection] = useState('description');
  const { product } = useProduct('oneflexo');

  useEffect(() => {
    document.title = "OneFLEXO | Orthopaedics Portfolio | Onecore Pharma";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Clinical product monograph for OneFLEXO, its formulation, composition and joint health information from Onecore Pharma."
      );
    }
  }, []);

  // Sticky sub-navigation scrollspy
  useEffect(() => {
    const sectionIds = ['description', 'composition', 'benefits', 'dosage', 'safety'];
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
    { id: 'dosage', label: 'Dosage & Use' },
    { id: 'safety', label: 'Safety Information' },
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
          role: "Standardized Boswellia extract specialized in supporting joint comfort and mobility."
        },
        {
          num: "02",
          name: "Native Type II Collagen",
          subtitle: "Undenatured collagen Type II",
          amount: "40 mg",
          role: "Intact molecular collagen supporting joint cartilage integrity and structural resilience."
        },
        {
          num: "03",
          name: "Mobilee®",
          subtitle: "Sodium hyaluronate, polysaccharides and collagen complex",
          amount: "40 mg",
          role: "Patented hyaluronic acid matrix supporting joint fluid nourishment and lubrication."
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
          title: "Joint Comfort",
          description: "Supports the formulation’s role in maintaining comfort during everyday movement and weight-bearing activities."
        },
        {
          num: "02",
          title: "Mobility & Flexibility",
          description: "Designed to support range of motion and functional mobility as part of a disciplined musculoskeletal care protocol."
        },
        {
          num: "03",
          title: "Cartilage Matrix Nourishment",
          description: "Combines three synergistic ingredients selected for complementary roles in synovial fluid health and connective tissue stability."
        }
      ];

  // Dynamic Safety or Fallback
  const safetyCategories = (product?.safety_sections && product.safety_sections.length > 0)
    ? product.safety_sections.map((s) => ({
        title: s.section_title?.toUpperCase(),
        placeholder: s.content || "Approved clinical safety information provided by treating physician.",
      }))
    : [
        {
          title: "Contraindications & Precautions",
          placeholder: "Do not use if known hypersensitivity exists to Boswellia extract, avian collagen, or sodium hyaluronate complexes."
        },
        {
          title: "Pregnancy & Lactation",
          placeholder: "Consult treating healthcare specialist prior to administration during pregnancy or nursing periods."
        },
        {
          title: "Concomitant Therapy",
          placeholder: "No adverse pharmaceutical interactions noted. Consult your doctor if taking anticoagulant therapy."
        },
        {
          title: "Storage & Stability",
          placeholder: "Store below 25°C in original blister packaging, protected from direct sunlight, moisture, and high humidity."
        }
      ];

  const brandName = product?.brand_name || 'OneFLEXO';
  const packshotUrl = product?.packshot_url || '/assets/products/oneflexo-packshot.png';

  return (
    <div className="w-full bg-[#FAF9F6] text-[#121212]">
      
      {/* 1. Breadcrumbs Context Bar */}
      <div className="pt-24 sm:pt-28 pb-4 border-b border-[#E5E3DC] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#777777] gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/areas-of-care" className="hover:text-[#121212] transition-colors font-medium">
              Areas of Care
            </Link>
            <span>›</span>
            <Link to="/areas-of-care/orthopaedics" className="hover:text-[#121212] transition-colors font-medium">
              Orthopaedics (Ortheon)
            </Link>
            <span>›</span>
            <span className="text-[#121212] font-semibold">{brandName}</span>
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#D52B1E]">
            Prescription Formulation Monograph
          </div>
        </div>
      </div>

      {/* 2. Editorial Product Hero */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-white border-b border-[#E5E3DC]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D52B1E] block">
                SPECIALISED JOINT HEALTH FORMULATION
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif font-light text-[#121212] tracking-tight leading-[1.05]">
                {brandName}. <br />
                <span className="italic font-normal text-[#D52B1E]">Targeted joint mobility & comfort.</span>
              </h1>
              <p className="text-base sm:text-xl text-[#555555] font-light leading-relaxed font-sans max-w-2xl">
                {product?.description || `${brandName} is a specialised joint health formulation combining Aflapin®, native undenatured Type II collagen and Mobilee® in a single standardized capsule.`}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => scrollToSection('composition')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
                >
                  <span>View Compositions</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF9F6] hover:bg-[#EBE9E1] text-[#121212] text-xs font-semibold rounded-full transition-colors border border-[#E5E3DC]"
                >
                  <span>Request Clinical Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] aspect-square bg-[#FAF9F6] border border-[#E5E3DC] rounded-3xl p-6 flex items-center justify-center shadow-xs">
                <img
                  src={assetUrl(packshotUrl)}
                  alt={`${brandName} - Onecore Pharma`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = assetUrl('/assets/therapeutic-orthopaedics.jpg');
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Sticky Sub-Navigation */}
      <nav
        aria-label="Product sections"
        className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E3DC] py-3 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#121212] hidden md:inline">
              {brandName} Clinical Monograph
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full md:w-auto justify-start md:justify-end">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                      isActive
                        ? 'bg-[#121212] text-white border-[#121212]'
                        : 'bg-white text-[#555555] border-[#E5E3DC] hover:border-[#121212] hover:text-[#121212]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* 4. Section: Description */}
      <section id="description" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E] block">
              CLINICAL RATIONALE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#121212] tracking-tight">
              Complementary Joint Support Architecture
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-[#555555] text-base sm:text-lg font-light leading-relaxed font-sans">
            <p>
              {product?.description || `${brandName} is a specialised joint health formulation that combines Aflapin®, native undenatured Type II collagen and Mobilee® in a single capsule.`}
            </p>
            <p>
              The formulation is engineered to bring together complementary ingredients with verified mechanisms in musculoskeletal comfort, cartilage preservation, and synovial fluid nourishment.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Section: Composition */}
      <section id="composition" className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-y border-[#E5E3DC] scroll-mt-24">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E] block">
              FORMULATION PROFILE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#121212] tracking-tight">
              Active Ingredients & Quantities
            </h2>
            <p className="text-base text-[#555555] font-light leading-relaxed font-sans">
              Each capsule delivers a standardized triad of active joint health components manufactured under cGMP controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {compositionItems.map((item, idx) => (
              <ScrollReveal key={item.name} delay={idx * 0.08}>
                <div className="bg-[#FAF9F6] border border-[#E5E3DC] p-8 rounded-3xl h-full flex flex-col justify-between space-y-6 hover:border-[#121212] transition-all duration-300 shadow-xs">
                  <div className="space-y-4">
                    <span className="text-3xl font-serif font-light text-[#888888] block">
                      {item.num}
                    </span>
                    <div>
                      <h3 className="text-xl font-serif font-medium text-[#121212] tracking-tight">
                        {item.name}
                      </h3>
                      {item.subtitle && (
                        <p className="text-xs text-[#777777] italic mt-0.5 font-serif">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="py-2.5 border-y border-[#E5E3DC]">
                      <span className="text-2xl font-mono text-[#121212] font-semibold">
                        {item.amount}
                      </span>
                    </div>
                    <p className="text-sm text-[#555555] font-light leading-relaxed">
                      {item.role}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Section: Benefits */}
      <section id="benefits" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-12 scroll-mt-24">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E] block">
            CLINICAL OUTCOMES
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#121212] tracking-tight">
            Designed for Functional Mobility
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefitItems.map((item, idx) => (
            <ScrollReveal key={item.title} delay={idx * 0.08}>
              <div className="p-8 bg-white border border-[#E5E3DC] rounded-3xl space-y-4 h-full flex flex-col justify-between shadow-xs hover:border-[#121212] transition-colors">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#777777]">
                    BENEFIT // {item.num}
                  </span>
                  <h3 className="text-xl font-serif font-medium text-[#121212] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#555555] font-light leading-relaxed font-sans pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 7. Section: Dosage & Guidelines */}
      <section id="dosage" className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-y border-[#E5E3DC] scroll-mt-24">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E] block">
              DOSAGE & INSTRUCTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#121212] tracking-tight">
              Administration Protocol
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="bg-[#FAF9F6] p-8 sm:p-10 border border-[#E5E3DC] rounded-3xl flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#777777] font-semibold">
                  STANDARD REGIMEN
                </span>
                <p className="text-2xl sm:text-3xl font-serif font-light text-[#121212]">
                  1 Capsule Daily
                </p>
                <p className="text-sm text-[#555555] font-light leading-relaxed">
                  Or as directed by the treating orthopaedic surgeon or physician. Take with water, preferably alongside a meal.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF9F6] p-8 sm:p-10 border border-[#E5E3DC] rounded-3xl flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#777777] font-semibold">
                  CLINICAL GUIDELINES
                </span>
                <ul className="space-y-2 text-sm text-[#555555] font-light">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00A859] mt-0.5 shrink-0" />
                    <span>Swallow whole with adequate fluids. Do not chew or crush.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00A859] mt-0.5 shrink-0" />
                    <span>Store below 25°C in a cool, dry environment away from direct sunlight.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00A859] mt-0.5 shrink-0" />
                    <span>Keep securely out of reach and sight of children.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Section: Safety & Precautions */}
      <section id="safety" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-10 scroll-mt-24">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E] block">
            PRESCRIBING PRECAUTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#121212] tracking-tight">
            Important Safety Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safetyCategories.map((item, idx) => (
            <ScrollReveal key={item.title} delay={idx * 0.05}>
              <div className="bg-white p-6 sm:p-8 border border-[#E5E3DC] rounded-2xl space-y-2 hover:border-[#121212] transition-colors shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#555555] font-light leading-relaxed font-sans">
                  {item.placeholder}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Mandatory Prescription Disclaimer */}
      <PrescriptionDisclaimer />

      {/* 9. Final Stately CTA */}
      <section className="py-20 sm:py-24 bg-[#121212] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight">
            Request Technical Monograph & Literature
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto font-light leading-relaxed">
            Registered healthcare professionals and orthopaedic specialists can request clinical dossiers, stability assays, and hospital formulary listings.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-lg"
            >
              <span>Connect with Medical Affairs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
