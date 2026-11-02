import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowRight, 
  Search, 
  X, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';
import { useTherapeuticAreas } from '../hooks/useTherapeuticAreas';
import { THERAPEUTIC_DIVISIONS } from '../data/areasOfCare';
import { useCmsPage } from '../hooks/useCmsPage';
import { assetUrl } from '../utils/assetUrl';
import { formatProductName } from '../utils/formatProductName';
import PageSkeleton from '../components/PageSkeleton';

export default function AreasOfCare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const { areas: dynamicAreas, loading: areasLoading } = useTherapeuticAreas();
  const areasList = dynamicAreas || [];
  const { getSection, loading: cmsLoading, isError: cmsError } = useCmsPage('areas-of-care');
  const heroSection = getSection('hero');

  // Local search input
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [activeSpecialtyId, setActiveSpecialtyId] = useState(areasList[0]?.id || 'femme');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalProductsCount, setTotalProductsCount] = useState(null);

  // Form state for institutional catalogue request
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

  // Sync state if urlQuery changes
  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, [urlQuery]);

  // Fetch total products count from database for stats counter
  useEffect(() => {
    fetch('/api/products', {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        setTotalProductsCount(items.length);
      })
      .catch(() => {});
  }, []);

  // Search exclusively from database
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    let isMounted = true;
    setSearchLoading(true);

    fetch(`/api/products?q=${encodeURIComponent(searchQuery.trim())}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const items = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        setSearchResults(items);
      })
      .catch(() => {
        if (isMounted) setSearchResults([]);
      })
      .finally(() => {
        if (isMounted) setSearchLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery]);

  // Handle Search Input submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  // Scroll to division
  const scrollToDivision = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSpecialtyId(id);
    }
  };

  const [formError, setFormError] = useState(null);

  const isFormValid =
    formState.fullName.trim() !== '' &&
    formState.organisation.trim() !== '' &&
    formState.workEmail.trim() !== '' &&
    formState.role.trim() !== '' &&
    formState.country.trim() !== '' &&
    formState.consent === true;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formState.fullName,
          workEmail: formState.workEmail,
          organisation: formState.organisation,
          role: formState.role,
          country: formState.country,
          contactType: formState.role || 'Institutional Healthcare Representative',
          natureOfEnquiry: 'Institutional Access & Dossier Request',
          message: `Institutional access and dossier request for ${formState.organisation} (Country/Region: ${formState.country}). Designated Role: ${formState.role}.`,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Unable to submit your institutional request. Please verify your details.');
      }

      setFormSubmitted(true);
    } catch (err) {
      console.error('Institutional request error:', err);
      setFormError(err.message || 'Connection error. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (areasLoading || (cmsLoading && !cmsError && !dynamicAreas)) {
    return <PageSkeleton />;
  }

  return (
    <div className="w-full bg-transparent text-[#121212] min-h-screen overflow-x-hidden">
      
      {/* =========================================================================
          SECTION 1 — EDITORIAL HERO
          Inspired by Lilly's bold, quiet confidence and spacious typography
          ========================================================================= */}
      <section className="pt-20 sm:pt-24 pb-8 sm:pb-10 px-4 sm:px-8 border-b border-[#E5E3DC]/80 bg-[#FAF9F6]/50 backdrop-blur-[1px]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-[#121212] tracking-tight leading-[1.05]">
                Our medicines & <br />
                <span className="italic font-normal text-[#D52B1E]">areas of care.</span>
              </h1>
              <p className="text-base sm:text-xl text-[#555555] font-light leading-relaxed max-w-2xl font-sans">
                Explore Onecore’s 9 specialized therapeutic divisions and over 60 clinically engineered prescription medicines, supportive therapies, and micronutrient formulations.
              </p>
            </div>

            {/* Global Catalog Stats */}
            <div className="flex items-center gap-6 sm:gap-8 pb-2 border-t lg:border-t-0 border-[#E5E3DC] pt-4 lg:pt-0 shrink-0">
              <div>
                <span className="block text-3xl sm:text-4xl font-serif font-light text-[#121212]">
                  {areasList.length || 9}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
                  Divisions
                </span>
              </div>
              <div className="h-10 w-[1px] bg-[#E5E3DC]" />
              <div>
                <span className="block text-3xl sm:text-4xl font-serif font-light text-[#D52B1E]">
                  {totalProductsCount !== null ? `${totalProductsCount}+` : '60+'}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
                  Formulations
                </span>
              </div>
              <div className="h-10 w-[1px] bg-[#E5E3DC]" />
              <div>
                <span className="block text-3xl sm:text-4xl font-serif font-light text-[#121212]">
                  100%
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
                  cGMP Standard
                </span>
              </div>
            </div>
          </div>

          {/* Clean Integrated Search Bar (No redundant tab buttons) */}
          <div className="pt-8 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 text-[#888888] absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formulations by brand name or active salt..."
                className="w-full bg-[#FAF9F6] border border-[#E5E3DC] focus:border-[#D52B1E] rounded-full pl-12 pr-24 py-3 text-sm text-[#121212] placeholder-[#888888] focus:outline-none transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-14 text-xs text-[#777777] hover:text-[#121212] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 px-4 py-1.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* =========================================================================
          ACTIVE SEARCH RESULTS (Displayed directly when user searches)
          ========================================================================= */}
      {searchQuery.trim() && (
        <section className="bg-transparent border-b border-[#E5E3DC] py-10 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E3DC]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D52B1E]">
                  Search Results:
                </span>
                <span className="text-base font-serif font-bold text-[#121212]">
                  "{searchQuery}"
                </span>
                <span className="text-xs text-[#777777] font-medium">
                  ({searchResults.length} {searchResults.length === 1 ? 'Formulation Found' : 'Formulations Found'})
                </span>
              </div>
              <button
                onClick={handleClearSearch}
                className="text-xs font-semibold text-[#D52B1E] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>Clear search and view divisions</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {searchLoading ? (
              <div className="py-12 text-center text-xs text-[#777777] font-mono tracking-wider uppercase">
                Searching active database formulations...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-12 text-center bg-[#FAF9F6] rounded-3xl border border-[#E5E3DC] p-8 space-y-3 max-w-lg mx-auto">
                <p className="text-base font-serif font-medium text-[#121212]">
                  No matching formulations found
                </p>
                <p className="text-xs text-[#555555]">
                  Try searching by generic active ingredient (e.g. Calcium, Folate, Glucosamine) or explore the division portfolios below.
                </p>
                <button
                  onClick={handleClearSearch}
                  className="px-6 py-2.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((product) => {
                  const divSlug = product.division || product.divisionSlug || product.therapeutic_area_slug || 'general-medicine';
                  const productUrl = product.productUrl || (product.slug === 'oneflexo' ? '/areas-of-care/orthopaedics/oneflexo' : `/areas-of-care/${divSlug}/${product.slug}`);
                  const title = product.brandName || product.name || product.brand_name || 'Unnamed Product';
                  const comp = product.composition || product.composition_summary || product.shortDescription || '';
                  const productImage = product.packshot_url || product.productPrimaryPackshotImage || product.image || '/assets/therapeutic-general-medicine.jpg';

                  return (
                    <Link
                      key={product.id || divSlug + product.slug + title}
                      to={productUrl}
                      className="bg-white/80 backdrop-blur-xs border border-[#E5E3DC] hover:border-[#D52B1E] transition-all duration-300 rounded-3xl overflow-hidden flex flex-col group shadow-xs hover:shadow-md block cursor-pointer"
                    >
                      {/* Product Image — Contained with padding to avoid carton clipping */}
                      <div className="w-full aspect-[4/3] bg-[#FAF9F6] overflow-hidden flex items-center justify-center p-3 sm:p-4">
                        <img
                          src={assetUrl(productImage)}
                          alt={`${title} - Onecore Pharma`}
                          className={`w-full h-full ${productImage.includes('/products/') ? 'object-contain mix-blend-multiply' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/assets/therapeutic-general-medicine.jpg';
                          }}
                        />
                      </div>

                      {/* Product Details: Clear Legible Name and Active Salt */}
                      <div className="p-5 sm:p-6 flex flex-col flex-1">
                        <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#121212] group-hover:text-[#D52B1E] transition-colors mb-2 leading-snug">
                          {formatProductName(title)}
                        </h3>

                        <p className="text-sm sm:text-base text-[#222222] font-normal leading-relaxed line-clamp-3">
                          {comp}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          HORIZONTAL SPECIALTY JUMP BAR (RELATIVE — NO OVERLAP WITH GLOBAL NAVBAR)
          ========================================================================= */}
      <nav
        aria-label="Browse by specialty"
        className="relative bg-white border-b border-[#E5E3DC] py-3.5 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {areasList.map((area) => {
            const isActive = activeSpecialtyId === area.id;
            const label = area.divisionName && area.therapeuticArea
              ? `${area.divisionName} — ${area.therapeuticArea}`
              : area.displayName;
            return (
              <button
                key={area.id}
                onClick={() => scrollToDivision(area.id)}
                className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 font-medium ${
                  isActive
                    ? 'bg-[#121212] text-white shadow-xs'
                    : 'text-[#555555] hover:text-[#121212] hover:bg-[#FAF9F6]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* =========================================================================
          SECTION 2 — THE 9 SPECIALTY DIVISIONS (ALTERNATING EDITORIAL SHOWCASE)
          ========================================================================= */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {areasLoading && (!areasList || areasList.length === 0) ? (
          // Neutral loading skeleton state directly inside layout to prevent visual flash/jitter
          <div className="space-y-12">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="border-b border-[#E5E3DC] pb-14 sm:pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                  <div className="order-2 lg:col-span-6 space-y-6">
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                    <div className="h-10 w-3/4 bg-gray-200 animate-pulse rounded" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                      <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
                    </div>
                    <div className="h-12 w-48 bg-gray-200 animate-pulse rounded-full" />
                  </div>
                  <div className="order-1 lg:col-span-6">
                    <div className="rounded-3xl border border-[#E5E3DC] aspect-[16/11] bg-gray-200 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          areasList.map((area, index) => {
            const isEven = index % 2 === 0;
            const divisionSlug = (area.divisionName || area.slug || area.id || '').toLowerCase();
            const divisionUrl = `/areas-of-care/${divisionSlug}`;
            const formulationCount = area.products ? area.products.length : 0;
            const divisionConfig = THERAPEUTIC_DIVISIONS[divisionSlug] || THERAPEUTIC_DIVISIONS[area.slug] || THERAPEUTIC_DIVISIONS[area.id] || {};
            const unifiedHeroImage = area.image_url || area.image || divisionConfig.heroImage;

            return (
              <div
                key={area.id}
                id={area.id}
                className="scroll-mt-28 border-b border-[#E5E3DC] pb-14 sm:pb-20 last:border-b-0"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                  
                  {/* Text Column */}
                  <div
                    className={`order-2 lg:col-span-6 space-y-6 ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D52B1E]">
                          {area.divisionName || area.displayName}
                        </span>
                        {formulationCount > 0 && (
                          <span className="text-xs font-mono text-[#777777]">
                            ({formulationCount} Formulations)
                          </span>
                        )}
                      </div>
                      <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-[1.1]">
                        {area.therapeuticArea || area.displayName}
                      </h2>
                    </div>

                    <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed font-sans">
                      {area.description || area.heading}
                    </p>

                    {/* Single Clean Action Button */}
                    <div className="pt-2">
                      <Link
                        to={divisionUrl}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-xs group cursor-pointer"
                      >
                        <span>Explore {area.divisionName || area.displayName} Products</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Image Column */}
                  <div
                    className={`order-1 lg:col-span-6 ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <Link
                      to={divisionUrl}
                      className="block group rounded-3xl overflow-hidden border border-[#E5E3DC] shadow-sm aspect-[16/11] bg-white division-hero-media"
                    >
                      <img
                        src={assetUrl(unifiedHeroImage)}
                        alt={`${divisionConfig.brand || area.therapeuticArea} ${divisionConfig.name || area.displayName} Portfolio - Onecore Pharma`}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/therapeutic-general-medicine.jpg';
                        }}
                      />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </section>

      {/* =========================================================================
          SECTION 3 — INSTITUTIONAL PRODUCT DOSSIER INQUIRY
          ========================================================================= */}
      <section className="py-12 sm:py-16 bg-transparent border-t border-[#E5E3DC]/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E] block">
              INSTITUTIONAL ACCESS
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-tight text-balance">
              Request Full Product Portfolio <br className="hidden sm:inline" />&amp; Monographs
            </h2>
            <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed font-sans max-w-2xl mx-auto">
              For registered medical practitioners, hospital formularies, and institutional procurement partners requiring prescribing dossiers, bioequivalence data, or commercial rate cards.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs border border-[#E5E3DC] p-6 sm:p-12 rounded-3xl shadow-xs">
            {formSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-white border border-[#E5E3DC] text-[#00A859] flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 size={26} />
                </div>
                <h3 className="text-2xl font-serif font-medium text-[#121212]">
                  Dossier Request Transmitted
                </h3>
                <p className="text-sm text-[#555555] max-w-md mx-auto leading-relaxed">
                  Thank you, {formState.fullName}. Our Medical Affairs & Distribution team will verify your credentials and deliver the requested portfolio materials to <strong className="text-[#121212]">{formState.workEmail}</strong>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormState({
                        fullName: '',
                        organisation: '',
                        workEmail: '',
                        role: '',
                        country: '',
                        consent: false,
                      });
                    }}
                    className="px-6 py-2.5 bg-[#121212] hover:bg-[#D52B1E] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {formError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
                    <span className="text-base">⚠️</span>
                    <div>
                      <p className="font-semibold text-rose-900">Request Submission Issue</p>
                      <p className="mt-0.5 text-rose-700">{formError}</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#121212] block">
                      Full Name <span className="text-[#D52B1E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.fullName}
                      onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm focus:outline-none focus:border-[#D52B1E] focus:ring-1 focus:ring-[#D52B1E] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#121212] block">
                      Institution / Hospital <span className="text-[#D52B1E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.organisation}
                      onChange={(e) => setFormState({ ...formState, organisation: e.target.value })}
                      placeholder="e.g. Apollo Hospitals / Formulary Committee"
                      className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm focus:outline-none focus:border-[#D52B1E] focus:ring-1 focus:ring-[#D52B1E] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#121212] block">
                      Official Work Email <span className="text-[#D52B1E]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.workEmail}
                      onChange={(e) => setFormState({ ...formState, workEmail: e.target.value })}
                      placeholder="e.g. rajesh@hospital.org"
                      className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm focus:outline-none focus:border-[#D52B1E] focus:ring-1 focus:ring-[#D52B1E] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#121212] block">
                      Professional Role <span className="text-[#D52B1E]">*</span>
                    </label>
                    <select
                      required
                      value={formState.role}
                      onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#D52B1E] focus:ring-1 focus:ring-[#D52B1E] transition-all"
                    >
                      <option value="">Select Role</option>
                      <option value="Consultant Physician">Consultant Physician</option>
                      <option value="Hospital Pharmacist">Hospital Pharmacist</option>
                      <option value="Procurement Manager">Procurement Manager</option>
                      <option value="Distribution Partner">Distribution Partner</option>
                      <option value="Regulatory / QA Officer">Regulatory / QA Officer</option>
                      <option value="Other Medical Professional">Other Medical Professional</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#121212] block">
                      Territory / Country <span className="text-[#D52B1E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.country}
                      onChange={(e) => setFormState({ ...formState, country: e.target.value })}
                      placeholder="e.g. India (Maharashtra)"
                      className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm focus:outline-none focus:border-[#D52B1E] focus:ring-1 focus:ring-[#D52B1E] transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formState.consent}
                      onChange={(e) => setFormState({ ...formState, consent: e.target.checked })}
                      className="mt-1 w-4 h-4 text-[#D52B1E] rounded border-[#E5E3DC] focus:ring-[#D52B1E] accent-[#D52B1E]"
                    />
                    <span className="text-xs text-[#555555] leading-relaxed">
                      I confirm that I am requesting pharmaceutical product dossiers and clinical data for professional medical, formulary, or distribution evaluation.
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#121212] hover:bg-[#D52B1E] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors disabled:bg-gray-300 cursor-pointer shadow-xs"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Request...</span>
                    ) : (
                      <>
                        <span>Submit Dossier Request</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
