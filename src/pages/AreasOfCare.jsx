import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, Check, FileText, Download, Building2, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import SectionEyebrow from '../components/SectionEyebrow';
import ScrollReveal from '../components/ScrollReveal';
import FallbackImage from '../components/FallbackImage';
import PageBanner from '../components/PageBanner';
import { useCmsPage } from '../hooks/useCmsPage';
import { useTherapeuticAreas } from '../hooks/useTherapeuticAreas';

export default function AreasOfCare() {
  const { getSection } = useCmsPage('areas-of-care');
  const { areas: dynamicAreas } = useTherapeuticAreas();

  const heroSec = getSection('hero', {
    eyebrow: 'THERAPEUTIC AREAS',
    title: 'Areas of Care',
    body: 'Explore the areas of care represented across the Onecore portfolio and discover the medicines and formulations within each specialty.',
    image_url: '/assets/therapeutic-hero.jpg',
  });

  const portfolioSec = getSection('portfolio_intro', {
    eyebrow: 'OUR PORTFOLIO',
    title: 'Explore by area of care.',
    body: 'Choose a specialty to discover the Onecore products and formulations within that area.',
  });

  const areasList = dynamicAreas || [];
  const [activeSpecialty, setActiveSpecialty] = useState(areasList[0]?.id || 'womens-health');
  
  const [formState, setFormState] = useState({
    fullName: '',
    organisation: '',
    workEmail: '',
    role: '',
    country: '',
    consent: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scrollspy observer to highlight active specialty as user scrolls
  useEffect(() => {
    if (!areasList || areasList.length === 0) return;

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSpecialty(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    areasList.forEach((area) => {
      const el = document.getElementById(area.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [areasList]);

  const scrollToSpecialty = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToCatalogueForm = () => {
    const el = document.getElementById('catalogue-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isFormValid =
    formState.fullName.trim() !== '' &&
    formState.organisation.trim() !== '' &&
    formState.workEmail.trim() !== '' &&
    formState.role.trim() !== '' &&
    formState.country.trim() !== '' &&
    formState.consent === true;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 400);
  };


  return (
    <div className="w-full">
      {/* =========================================================================
          SECTION 1 — HERO / BANNER
          ========================================================================= */}
      {heroSec.is_active && (
        <PageBanner
          title="Areas of Care"
          imageUrl={heroSec.image_url || '/assets/therapeutic-hero.jpg'}
          imageAlt="Areas of Care - Onecore Pharma"
        />
      )}

      {/* =========================================================================
          SECTION 2 — SPECIALTY NAVIGATION (Sticky Navigation with Scrollspy)
          ========================================================================= */}
      <nav
        aria-label="Browse by specialty"
        className="sticky top-0 z-40 bg-brand-ivory/95 backdrop-blur-md border-y border-brand-border/80 py-3.5 sm:py-4 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Horizontal Specialty Links */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none no-scrollbar">
            {areasList.map((area) => {
              const isActive = activeSpecialty === area.id;
              const label = area.divisionName && area.therapeuticArea 
                ? `${area.divisionName} — ${area.therapeuticArea}` 
                : area.displayName;
              return (
                <button
                  key={area.id}
                  onClick={() => scrollToSpecialty(area.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 font-medium ${
                    isActive
                      ? 'bg-brand-dark text-white shadow-sm'
                      : 'text-brand-muted hover:text-brand-dark hover:bg-brand-surface'
                  }`}
                >
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* =========================================================================
          SECTION 3 — SPECIALTIES PORTFOLIO (Alternating Editorial Divisions)
          ========================================================================= */}
      <section className="pt-10 sm:pt-14 lg:pt-16 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Alternating Editorial Sections */}
        <div className="space-y-16 sm:space-y-24 lg:space-y-28">
          {areasList.map((area, index) => {
            const isEven = index % 2 === 1;

            return (
              <article
                key={area.id}
                id={area.id}
                className={`scroll-mt-32 ${
                  index === 0 ? 'pt-0' : 'pt-12 sm:pt-16 lg:pt-20 border-t border-brand-border/70'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-stretch">
                  {/* Text Column */}
                  <div
                    className={`order-2 lg:col-span-6 flex flex-col justify-between py-1 lg:py-3 ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <ScrollReveal>
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-brand-dark tracking-tight leading-[1.05]">
                          {area.divisionName || area.displayName}
                        </h3>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-light text-brand-muted tracking-tight">
                          {area.therapeuticArea || area.displayName}
                        </p>
                      </div>
                    </ScrollReveal>

                    {/* Refined Editorial CTA Link */}
                    <ScrollReveal delay={0.1}>
                      <div className="pt-8 sm:pt-12 lg:pt-0">
                        <Link
                          to={`/areas-of-care/${area.slug || area.id}`}
                          className="inline-flex items-center gap-2.5 text-base sm:text-lg font-normal text-brand-dark hover:text-brand-sage transition-colors group cursor-pointer"
                        >
                          <span>Request {area.divisionName || area.displayName} Dossier →</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                        </Link>
                      </div>
                    </ScrollReveal>
                  </div>

                  {/* Image Column */}
                  <div
                    className={`order-1 lg:col-span-6 ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <ScrollReveal delay={0.15} direction={isEven ? 'right' : 'left'}>
                      <div className="relative rounded-sm overflow-hidden border border-brand-border shadow-sm group h-full">
                        <FallbackImage
                          src={area.image}
                          alt={`${area.divisionName || area.displayName} — ${area.therapeuticArea || area.displayName}`}
                          aspectRatio="aspect-[4/3] sm:aspect-[16/10]"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — PRODUCT CATALOGUE REQUEST FORM
          ========================================================================= */}
      <section
        id="catalogue-request-form"
        className="py-20 sm:py-28 bg-brand-surface border-t border-brand-border"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <ScrollReveal>
              <SectionEyebrow>SCIENTIFIC & PRODUCT DIALOGUE</SectionEyebrow>
              <h2 className="editorial-heading text-3xl sm:text-4xl font-light text-brand-dark tracking-tight">
                Request Product Dossier & Catalogue
              </h2>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                For registered medical practitioners, institutional buyers, and pharmaceutical distribution partners.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.1}>
            <div className="bg-white border border-brand-border p-6 sm:p-10 rounded-sm shadow-sm">
              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-xl font-medium text-brand-dark">Request Received</h3>
                  <p className="text-sm text-brand-muted max-w-md mx-auto">
                    Thank you, {formState.fullName}. A Onecore medical representative will reach out to <strong className="text-brand-dark">{formState.workEmail}</strong> with the requested catalogue materials.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.fullName}
                        onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                        placeholder="Dr. Rajesh Mehta"
                        className="w-full bg-brand-surface/60 border border-brand-border rounded-sm px-4 py-3 text-sm text-brand-dark focus:outline-hidden focus:border-brand-sage"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark font-medium mb-2">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.workEmail}
                        onChange={(e) => setFormState({ ...formState, workEmail: e.target.value })}
                        placeholder="doctor@hospital.org"
                        className="w-full bg-brand-surface/60 border border-brand-border rounded-sm px-4 py-3 text-sm text-brand-dark focus:outline-hidden focus:border-brand-sage"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark font-medium mb-2">
                        Organisation / Hospital *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.organisation}
                        onChange={(e) => setFormState({ ...formState, organisation: e.target.value })}
                        placeholder="Apollo Specialty Hospitals"
                        className="w-full bg-brand-surface/60 border border-brand-border rounded-sm px-4 py-3 text-sm text-brand-dark focus:outline-hidden focus:border-brand-sage"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark font-medium mb-2">
                        Professional Role *
                      </label>
                      <select
                        required
                        value={formState.role}
                        onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                        className="w-full bg-brand-surface/60 border border-brand-border rounded-sm px-4 py-3 text-sm text-brand-dark focus:outline-hidden focus:border-brand-sage"
                      >
                        <option value="">Select your role</option>
                        <option value="Physician / Consultant">Physician / Consultant</option>
                        <option value="Surgeon">Surgeon</option>
                        <option value="Clinical Pharmacist">Clinical Pharmacist</option>
                        <option value="Hospital Procurement">Hospital Procurement</option>
                        <option value="Distributor">Pharmaceutical Distributor</option>
                        <option value="Other Healthcare Professional">Other Healthcare Professional</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark font-medium mb-2">
                        Country / Jurisdiction *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.country}
                        onChange={(e) => setFormState({ ...formState, country: e.target.value })}
                        placeholder="India"
                        className="w-full bg-brand-surface/60 border border-brand-border rounded-sm px-4 py-3 text-sm text-brand-dark focus:outline-hidden focus:border-brand-sage"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="catalogue-consent"
                      required
                      checked={formState.consent}
                      onChange={(e) => setFormState({ ...formState, consent: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-brand-border text-brand-dark focus:ring-brand-sage"
                    />
                    <label htmlFor="catalogue-consent" className="text-xs text-brand-muted leading-relaxed">
                      I confirm that I am a healthcare professional or legitimate commercial healthcare buyer requesting technical product information for professional evaluation.
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || !isFormValid}
                      className="w-full sm:w-auto px-8 py-3.5 bg-brand-dark hover:bg-brand-sage disabled:bg-brand-border text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-sm cursor-pointer"
                    >
                      <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Catalogue Request'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
