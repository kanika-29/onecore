import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Search, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Pill, 
  Stethoscope, 
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';
import { allProducts, searchFormulations } from '../data/allProducts';
import { useTherapeuticAreas } from '../hooks/useTherapeuticAreas';
import { assetUrl } from '../utils/assetUrl';

export default function AreasOfCare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlQuery = searchParams.get('q') || '';

  const { areas: dynamicAreas } = useTherapeuticAreas();
  const areasList = dynamicAreas || [];

  // Local search input
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [activeTab, setActiveTab] = useState(urlQuery ? 'all-products' : 'divisions');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [activeSpecialtyId, setActiveSpecialtyId] = useState(areasList[0]?.id || 'femme');

  // Sync state if urlQuery changes
  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery);
      setActiveTab('all-products');
    }
  }, [urlQuery]);

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

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchFormulations(searchQuery);
  }, [searchQuery]);

  // Filtered Products for the All Products Directory tab
  const directoryProducts = useMemo(() => {
    let list = allProducts;

    if (selectedSpecialty !== 'ALL') {
      list = list.filter((p) => 
        p.division?.toUpperCase() === selectedSpecialty || 
        p.category?.toUpperCase().includes(selectedSpecialty)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.composition?.toLowerCase().includes(q) ||
          p.division?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.usedFor?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedSpecialty, searchQuery]);

  // Handle Search Input submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      setActiveTab('all-products');
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  // Scrollspy observer for division navigation
  const scrollToDivision = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSpecialtyId(id);
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

  const specialtyFilters = [
    { label: 'All Disciplines', value: 'ALL', count: allProducts.length },
    { label: "Women's Health (Femme)", value: 'FEMME' },
    { label: 'Orthopaedics (Ortheon)', value: 'ORTHEON' },
    { label: 'Neurology (Neurix)', value: 'NEURIX' },
    { label: 'Paediatrics (Pediaplus)', value: 'PEDIAPLUS' },
    { label: 'Dermatology (Vellis)', value: 'VELLIS' },
    { label: 'Ophthalmology (Eyerix)', value: 'EYERIX' },
    { label: 'ENT (Otira)', value: 'OTIRA' },
    { label: 'General Medicine (Omnara)', value: 'OMNARA' },
    { label: 'Oncology (Cytos)', value: 'CYTOS' },
  ];

  return (
    <div className="w-full bg-[#FAF9F6] text-[#121212] min-h-screen">
      
      {/* =========================================================================
          SECTION 1 — EDITORIAL HERO
          Inspired by Lilly's bold, quiet confidence and spacious typography
          ========================================================================= */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-8 border-b border-[#E5E3DC] bg-white">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E]">
            <Pill className="w-4 h-4 text-[#D52B1E]" />
            <span>Therapeutic Disciplines & Formulations</span>
          </div>

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
                  {allProducts.length}+
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

          {/* Search & Mode Switcher Bar */}
          <div className="pt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl">
              <Search className="w-5 h-5 text-[#888888] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formulations by brand name, active salt, or specialty..."
                className="w-full bg-[#FAF9F6] border border-[#E5E3DC] focus:border-[#D52B1E] rounded-full pl-12 pr-24 py-3 text-sm text-[#121212] placeholder-[#888888] focus:outline-none transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-[#777777] hover:text-[#121212] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors"
              >
                Search
              </button>
            </form>

            {/* View Mode Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-[#EBE9E1] rounded-full self-start md:self-auto shrink-0">
              <button
                onClick={() => setActiveTab('divisions')}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'divisions'
                    ? 'bg-[#121212] text-white shadow-sm'
                    : 'text-[#555555] hover:text-[#121212]'
                }`}
              >
                Specialty Divisions (9)
              </button>
              <button
                onClick={() => setActiveTab('all-products')}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'all-products'
                    ? 'bg-[#121212] text-white shadow-sm'
                    : 'text-[#555555] hover:text-[#121212]'
                }`}
              >
                All Products Directory ({allProducts.length}+)
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SEARCH RESULTS ACTIVE BANNER (When query is present)
          ========================================================================= */}
      {searchQuery.trim() && (
        <section className="bg-white border-b border-[#E5E3DC] py-4 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D52B1E]">
                Active Search:
              </span>
              <span className="text-sm font-serif font-bold text-[#121212]">
                "{searchQuery}"
              </span>
              <span className="text-xs text-[#777777] font-medium">
                ({searchResults.length} {searchResults.length === 1 ? 'Formulation Found' : 'Formulations Found'})
              </span>
            </div>
            <button
              onClick={handleClearSearch}
              className="text-xs font-semibold text-[#D52B1E] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Clear search and view all portfolio</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 1: ALL PRODUCTS DIRECTORY (Unified 60+ Formulations Grid)
          ========================================================================= */}
      {activeTab === 'all-products' && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {specialtyFilters.map((filt) => {
              const isSelected = selectedSpecialty === filt.value;
              return (
                <button
                  key={filt.value}
                  onClick={() => setSelectedSpecialty(filt.value)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-[#D52B1E] text-white border-[#D52B1E] shadow-sm'
                      : 'bg-white text-[#555555] border-[#E5E3DC] hover:border-[#121212] hover:text-[#121212]'
                  }`}
                >
                  {filt.label}
                </button>
              );
            })}
          </div>

          {/* Formulations Count Bar */}
          <div className="flex items-center justify-between text-xs text-[#777777] border-b border-[#E5E3DC] pb-4">
            <span>
              Showing <strong className="text-[#121212] font-semibold">{directoryProducts.length}</strong> registered formulations
            </span>
            <span className="hidden sm:inline">
              Click any formulation to view complete prescribing monograph
            </span>
          </div>

          {/* Formulations Grid */}
          {directoryProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-[#E5E3DC] p-8 space-y-4 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#E5E3DC] text-[#121212] flex items-center justify-center mx-auto">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#121212]">
                No matching formulations found
              </h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                We couldn't find any products matching "{searchQuery}". Try searching by generic active ingredient (e.g. Calcium, Folate, Glucosamine, Paracetamol) or browse by specialty.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleClearSearch}
                  className="px-6 py-2.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
                >
                  Clear Filters & Show All Formulations
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {directoryProducts.map((product) => {
                return (
                  <div
                    key={product.division + product.slug + product.name}
                    className="bg-white rounded-3xl border border-[#E5E3DC] hover:border-[#121212] transition-all duration-300 p-6 flex flex-col justify-between group shadow-xs hover:shadow-md"
                  >
                    <div>
                      {/* Division & Specialty Tag */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-semibold tracking-wider uppercase text-[#D52B1E]">
                          {product.division}
                        </span>
                        <span className="text-[11px] text-[#777777] truncate font-medium">
                          {product.category}
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#121212] group-hover:text-[#D52B1E] transition-colors mb-2 leading-snug">
                        {product.name}
                      </h3>

                      {/* Active Ingredients / Composition */}
                      {product.composition && (
                        <p className="text-xs text-[#555555] leading-relaxed line-clamp-3 font-mono bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E5E3DC]/60 mb-3">
                          {product.composition}
                        </p>
                      )}

                      {/* Primary Clinical Indication */}
                      {product.usedFor && (
                        <p className="text-xs text-[#777777] line-clamp-2 leading-relaxed italic">
                          {product.usedFor}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Row */}
                    <div className="pt-5 mt-5 border-t border-[#E5E3DC] space-y-2">
                      <Link
                        to={product.productUrl}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#121212] group-hover:bg-[#D52B1E] text-white text-xs font-semibold rounded-full transition-colors"
                      >
                        <span>View Monograph</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <Link
                        to={product.categoryUrl}
                        className="block text-center text-[11px] text-[#777777] hover:text-[#121212] transition-colors pt-1"
                      >
                        View all in {product.division} →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </section>
      )}

      {/* =========================================================================
          TAB 2: SPECIALTY DIVISIONS (9 Alternating Editorial Portfolios)
          ========================================================================= */}
      {activeTab === 'divisions' && (
        <>
          {/* Sticky Horizontal Specialty Navigation */}
          <nav
            aria-label="Browse by specialty"
            className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E3DC] py-3 shadow-xs"
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

          {/* 9 Alternating Editorial Division Cards */}
          <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
            <div className="space-y-20 sm:space-y-28">
              {areasList.map((area, index) => {
                const isEven = index % 2 === 1;
                const divisionSlug = (area.slug || area.id || area.divisionName || '').toLowerCase().trim();
                const divisionUrl = `/areas-of-care/${divisionSlug}`;
                
                // Count formulations in this division from allProducts
                const formulationCount = allProducts.filter(
                  p => p.division?.toLowerCase() === divisionSlug || p.division?.toLowerCase() === area.divisionName?.toLowerCase()
                ).length;

                return (
                  <article
                    key={area.id}
                    id={area.id}
                    className={`scroll-mt-28 ${
                      index === 0 ? 'pt-0' : 'pt-16 sm:pt-20 border-t border-[#E5E3DC]'
                    }`}
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

                        {/* Key Clinical Focus Items */}
                        {area.keyTherapeuticInfo && area.keyTherapeuticInfo.length > 0 && (
                          <div className="pt-2 space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#777777] block">
                              Clinical Scope & Formulations:
                            </span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#333333]">
                              {area.keyTherapeuticInfo.slice(0, 4).map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#D52B1E] mt-1.5 shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Direct Action Buttons */}
                        <div className="pt-4 flex flex-wrap items-center gap-4">
                          <Link
                            to={divisionUrl}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors shadow-xs group cursor-pointer"
                          >
                            <span>Explore {area.divisionName || area.displayName} Products</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>

                          <button
                            onClick={() => {
                              setSelectedSpecialty((area.divisionName || '').toUpperCase());
                              setActiveTab('all-products');
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#EBE9E1] border border-[#E5E3DC] text-[#121212] text-xs font-semibold rounded-full transition-colors cursor-pointer"
                          >
                            <span>Filter in Directory</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Image Column */}
                      <div
                        className={`order-1 lg:col-span-6 ${
                          isEven ? 'lg:order-1' : 'lg:order-2'
                        }`}
                      >
                        <Link to={divisionUrl} className="block group">
                          <div className="relative rounded-[28px] overflow-hidden border border-[#E5E3DC] shadow-sm aspect-[4/3] bg-white">
                            <img
                              src={assetUrl(area.image || area.heroImage)}
                              alt={`${area.divisionName || area.displayName} — Onecore Pharma`}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                              <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                                <span>Open Full {area.divisionName} Portfolio</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>

                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* =========================================================================
          SECTION 3 — INSTITUTIONAL DIALOGUE & PRODUCT DOSSIER REQUEST FORM
          Designed for physicians, hospital procurement, and commercial distribution
          ========================================================================= */}
      <section
        id="catalogue-request-form"
        className="py-20 sm:py-28 bg-[#F0EFEB] border-t border-[#E5E3DC]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E]">
              Scientific & Institutional Dialogue
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight">
              Request Technical Product Dossiers
            </h2>
            <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed font-sans">
              For registered medical practitioners, hospital formularies, and institutional procurement partners requiring prescribing dossiers, bioequivalence data, or commercial rate cards.
            </p>
          </div>

          <div className="bg-white border border-[#E5E3DC] p-6 sm:p-12 rounded-[28px] shadow-sm">
            {formSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#FAF9F6] border border-[#E5E3DC] text-[#00A859] flex items-center justify-center mx-auto">
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
                    className="text-xs font-semibold text-[#D52B1E] underline hover:text-[#121212]"
                  >
                    Submit another request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.fullName}
                      onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                      placeholder="Dr. Rajesh Mehta"
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl px-4 py-3 text-sm text-[#121212] placeholder-[#888888] focus:outline-none focus:border-[#D52B1E] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212] mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.workEmail}
                      onChange={(e) => setFormState({ ...formState, workEmail: e.target.value })}
                      placeholder="doctor@hospital.org"
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl px-4 py-3 text-sm text-[#121212] placeholder-[#888888] focus:outline-none focus:border-[#D52B1E] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212] mb-2">
                      Organisation / Hospital *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.organisation}
                      onChange={(e) => setFormState({ ...formState, organisation: e.target.value })}
                      placeholder="Apollo Specialty Hospitals"
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl px-4 py-3 text-sm text-[#121212] placeholder-[#888888] focus:outline-none focus:border-[#D52B1E] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212] mb-2">
                      Professional Role *
                    </label>
                    <select
                      required
                      value={formState.role}
                      onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl px-4 py-3 text-sm text-[#121212] focus:outline-none focus:border-[#D52B1E] transition-colors"
                    >
                      <option value="">Select professional role</option>
                      <option value="Physician / Consultant">Physician / Consultant Specialist</option>
                      <option value="Surgeon">Surgeon</option>
                      <option value="Clinical Pharmacist">Clinical Pharmacist</option>
                      <option value="Hospital Formulary Committee">Hospital Formulary Committee</option>
                      <option value="Procurement Director">Hospital Procurement Director</option>
                      <option value="Distributor">Pharmaceutical Distributor</option>
                      <option value="Other Healthcare Professional">Other Healthcare Professional</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212] mb-2">
                      Country / Jurisdiction *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.country}
                      onChange={(e) => setFormState({ ...formState, country: e.target.value })}
                      placeholder="India"
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl px-4 py-3 text-sm text-[#121212] placeholder-[#888888] focus:outline-none focus:border-[#D52B1E] transition-colors"
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
                    className="mt-1 h-4 w-4 rounded border-[#E5E3DC] text-[#D52B1E] focus:ring-[#D52B1E]"
                  />
                  <label htmlFor="catalogue-consent" className="text-xs text-[#555555] leading-relaxed">
                    I confirm that I am a registered healthcare professional or verified institutional buyer requesting official technical documentation for clinical evaluation or procurement purposes.
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#D52B1E] hover:bg-[#B52015] disabled:bg-[#E5E3DC] disabled:text-[#888888] text-white text-xs font-semibold rounded-full transition-all shadow-xs cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Dossier Request'}</span>
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
