import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Building2, 
  Microscope, 
  Users,
  Quote
} from 'lucide-react';
import SectionEyebrow from '../components/SectionEyebrow';
import ScrollReveal from '../components/ScrollReveal';
import FallbackImage from '../components/FallbackImage';
import { useCmsPage } from '../hooks/useCmsPage';
import { useTherapeuticAreas } from '../hooks/useTherapeuticAreas';
import { useNews } from '../hooks/useNews';
import { assetUrl } from '../utils/assetUrl';

export default function Home() {
  const { getSection } = useCmsPage('home');
  const { areas: dynamicAreas } = useTherapeuticAreas();
  const { articles: dynamicNews } = useNews();
  const carouselRef = useRef(null);

  // Scroll controls for the Condition Support carousel
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 9 Specialized Therapeutic Divisions (Condition Showcase)
  const conditions = [
    {
      id: 'cancer',
      division: 'CYTOS',
      name: 'Oncology',
      description: 'Advancing targeted therapeutics and supportive oncology care with clinical precision.',
      image: '/assets/cytos.jpg',
      path: '/areas-of-care',
    },
    {
      id: 'womens-health',
      division: 'FEMME',
      name: 'Women’s Health',
      description: 'Comprehensive formulations supporting maternal health, hormonal balance, and wellness.',
      image: '/assets/therapeutic-womens-health.jpg',
      path: '/areas-of-care/femme',
    },
    {
      id: 'neurology',
      division: 'NEURIX',
      name: 'Neurology',
      description: 'Neuroprotective and cognitive formulations developed for central nervous system disorders.',
      image: '/assets/neurix.jpg',
      path: '/areas-of-care',
    },
    {
      id: 'orthopaedics',
      division: 'ORTHEON',
      name: 'Orthopaedics',
      description: 'Bone density, cartilage protection, and musculoskeletal rehabilitation solutions.',
      image: '/assets/ortheon.jpg',
      path: '/areas-of-care',
    },
    {
      id: 'dermatology',
      division: 'VELLIS',
      name: 'Dermatology',
      description: 'Dermatological formulations restoring barrier integrity and skin vitality.',
      image: '/assets/vellis.webp',
      path: '/areas-of-care',
    },
    {
      id: 'ophthalmology',
      division: 'EYERIX',
      name: 'Ophthalmology',
      description: 'Ocular lubricants, anti-inflammatory drops, and retinal care formulations.',
      image: '/assets/eyerix.jpg',
      path: '/areas-of-care',
    },
    {
      id: 'ent',
      division: 'OTIRA',
      name: 'Ear, Nose & Throat',
      description: 'Targeted airway and otolaryngology formulations for prompt clinical relief.',
      image: '/assets/otira.jpg',
      path: '/areas-of-care',
    },
    {
      id: 'paediatrics',
      division: 'PEDIAPLUS',
      name: 'Paediatrics',
      description: 'Child-friendly dosage forms and pediatric wellness therapies designed for safety.',
      image: '/assets/pediaplus.jpg',
      path: '/areas-of-care',
    },
    {
      id: 'general-medicine',
      division: 'OMNARA',
      name: 'General Medicine',
      description: 'Essential primary care therapeutics and broad-spectrum health management.',
      image: '/assets/therapeutic-general-medicine.jpg',
      path: '/areas-of-care',
    },
  ];

  return (
    <div className="w-full bg-white overflow-hidden">
      
      {/* =========================================================================
          SECTION 1 — PRIMARY HERO (THE LILLY HUMAN-CENTRIC HERO)
          Screenshot 1 Pattern: Full-bleed photograph with heavy grotesque headline
          ========================================================================= */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-end pb-16 sm:pb-24 pt-32 px-4 sm:px-8 lg:px-12 bg-black">
        {/* Background Photograph with Subtle Contrast Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src={assetUrl('/assets/hero-healthcare.jpg')}
            alt="Onecore Pharma — Healthcare centered on people"
            className="w-full h-full object-cover object-center opacity-85 brightness-90"
            loading="eager"
          />
          {/* Directional gradient ensuring high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Hero Content Block (Lilly Heavy Typography Layout) */}
        <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="w-2 h-2 rounded-full bg-[#D52B1E] animate-pulse" />
              <span>A Medicine Company</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tightest leading-[1.04] pt-2 max-w-4xl">
              A medicine company that puts health above all.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-base sm:text-xl text-white/85 font-normal max-w-2xl leading-relaxed">
              Onecore Pharma develops purposeful formulations and dependable medicines centered on patients, families, and healthcare professionals.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/areas-of-care"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#D52B1E] hover:bg-[#B52015] text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <span>Explore Medicines</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-sm font-medium rounded-full transition-all duration-200"
              >
                <span>Our Approach</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — EDITORIAL STATEMENT & 3 ACTION CARDS (LILLY MODEL)
          Screenshot 2 & 3 Pattern: Garamond headline with italics & 3 red pill actions
          ========================================================================= */}
      <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-16 sm:space-y-20">
          
          {/* Centered Brand Mark & Monumental Garamond Title */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <ScrollReveal>
              <div className="inline-block">
                <span className="font-serif text-3xl font-bold tracking-tight text-[#D52B1E]">
                  Onecore
                </span>
              </div>
              <h2 className="lilly-serif text-3xl sm:text-5xl lg:text-6xl text-[#121212] tracking-tight leading-[1.12] pt-3">
                A medicine company should do more <em className="lilly-serif-italic font-normal text-[#121212]">than just make medicine.</em>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed pt-2">
                Healthcare is personal. Beyond discovering and manufacturing quality formulations, our role is supporting the informed decisions that empower healing.
              </p>
            </ScrollReveal>
          </div>

          {/* 3-Column Action Cards with Custom Line Icons & Red Pill CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pt-4">
            
            {/* Action Card 1: Find Care */}
            <ScrollReveal delay={0.1}>
              <div className="flex flex-col h-full space-y-5 p-2">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1F0] flex items-center justify-center text-[#D52B1E]">
                  <Heart className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="text-2xl font-bold text-[#121212] tracking-tight">
                  Find care
                </h3>
                <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed flex-1">
                  Connect with specialized physicians and clinical partners who understand your therapeutic needs and treatment options.
                </p>
                <div className="pt-2">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-all duration-200 group"
                  >
                    <span>Get started</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Action Card 2: Access Pharmacy / Medicines */}
            <ScrollReveal delay={0.15}>
              <div className="flex flex-col h-full space-y-5 p-2">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1F0] flex items-center justify-center text-[#D52B1E]">
                  <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="text-2xl font-bold text-[#121212] tracking-tight">
                  Access medicines
                </h3>
                <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed flex-1">
                  Explore Onecore’s portfolio of over 60 purposefully engineered formulations across 9 distinct medical areas of care.
                </p>
                <div className="pt-2">
                  <Link
                    to="/areas-of-care"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-all duration-200 group"
                  >
                    <span>Get medicine</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Action Card 3: Clinical Trials & Standards */}
            <ScrollReveal delay={0.2}>
              <div className="flex flex-col h-full space-y-5 p-2">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1F0] flex items-center justify-center text-[#D52B1E]">
                  <Sparkles className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="text-2xl font-bold text-[#121212] tracking-tight">
                  View clinical standards
                </h3>
                <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed flex-1">
                  Discover how our qualified manufacturing protocols, batch verifications, and safety standards safeguard every dose.
                </p>
                <div className="pt-2">
                  <Link
                    to="/quality-manufacturing"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-all duration-200 group"
                  >
                    <span>View standards</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — CONDITION SUPPORT CAROUSEL (LILLY MODEL)
          Screenshot 3 & 4 Pattern: Tracked eyebrow, Garamond title, rounded-3xl cards
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#FAF9F6] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header & Description */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <ScrollReveal>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#4B5563] block">
                  CONDITION SUPPORT
                </span>
                <h2 className="lilly-serif text-3xl sm:text-5xl lg:text-6xl text-[#121212] tracking-tight leading-tight">
                  Get a better understanding of a condition.
                </h2>
                <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed pt-2 max-w-2xl">
                  One of the healthiest actions a patient or loved one can take is getting informed about a condition. Part of our job is providing the information and purposeful medicines you need to help make the best decisions for health.
                </p>
              </ScrollReveal>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-12 h-12 rounded-full border border-stone-300 hover:border-black bg-white flex items-center justify-center text-stone-800 hover:text-black transition-colors shadow-sm focus:outline-none"
                aria-label="Previous Condition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-12 h-12 rounded-full border border-stone-300 hover:border-black bg-white flex items-center justify-center text-stone-800 hover:text-black transition-colors shadow-sm focus:outline-none"
                aria-label="Next Condition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontally Scrollable Condition Cards (Lilly rounded-[28px] geometry) */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-none pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory"
          >
            {conditions.map((item, idx) => (
              <div
                key={item.id}
                className="snap-start flex-shrink-0 w-[280px] sm:w-[340px] lg:w-[380px]"
              >
                <Link
                  to={item.path}
                  className="group relative block aspect-[4/5] rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-stone-900 border border-stone-200/80"
                >
                  {/* Background Condition Imagery */}
                  <img
                    src={assetUrl(item.image)}
                    alt={`${item.name} — ${item.division}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Mask for Perfect Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                  {/* Card Content Overlay */}
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
                        {item.division}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed font-normal">
                        {item.description}
                      </p>

                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white group-hover:text-red-300 underline underline-offset-4 decoration-white/60 group-hover:decoration-red-300 transition-all">
                          <span>Explore Condition</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — PATIENT VOICE / TESTIMONIAL SPOTLIGHT (LILLY MODEL)
          Screenshot 6 Pattern: Large rounded photographic card with quote marks & voice
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden min-h-[480px] sm:min-h-[540px] flex items-end p-8 sm:p-12 lg:p-16 bg-stone-900 border border-stone-200 shadow-xl">
            
            {/* Warm Portrait Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={assetUrl('/assets/patients-caregivers.jpg')}
                alt="Patient Story — Real clinical perspectives"
                className="w-full h-full object-cover object-top sm:object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Testimonial Overlay Content */}
            <div className="relative z-10 max-w-3xl space-y-6 text-white">
              <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
                <Quote className="w-6 h-6 stroke-[2]" />
              </div>

              <blockquote className="lilly-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.2] tracking-tight">
                “Advice I can give to anyone navigating recovery? Consult your doctor early, understand your regimen, and choose formulations built on dependable quality.”
              </blockquote>

              <div className="pt-2 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Patient Perspective
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70">
                    Navigating Chronic Care & Daily Wellness
                  </p>
                </div>

                <Link
                  to="/patients-caregivers"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 hover:bg-[#D52B1E] backdrop-blur-md border border-white/20 hover:border-transparent text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                >
                  <span>Read Patient Support Guides</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* =========================================================================
          SECTION 5 — ABOUT ONECORE, IMPACT METRICS & INITIATIVES (LILLY MODEL)
          Screenshots 7 & 8 Pattern: Serif statement, bold metrics, 3 story cards with red links
          ========================================================================= */}
      <section className="py-24 sm:py-32 bg-[#FAF9F6] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Header Block */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <ScrollReveal>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#4B5563] block">
                ABOUT ONECORE
              </span>
              <h2 className="lilly-serif text-3xl sm:text-5xl lg:text-6xl text-[#121212] tracking-tight leading-[1.1]">
                Our job is to put health <em className="lilly-serif-italic text-[#121212]">above all.</em>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
                Our research and operations focus on developing purposeful, dependable medicines for patients and physicians. We know our most meaningful advancements in healthcare are still ahead of us.
              </p>
            </ScrollReveal>
          </div>

          {/* Key Metrics Row (Lilly 3-column impact numbers) */}
          <ScrollReveal delay={0.15}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-stone-300">
              <div className="space-y-2">
                <span className="text-5xl sm:text-6xl font-black text-[#121212] tracking-tight block">
                  150+
                </span>
                <p className="text-sm font-medium text-[#4B5563]">
                  Purposeful formulations in circulation
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-5xl sm:text-6xl font-black text-[#121212] tracking-tight block">
                  9
                </span>
                <p className="text-sm font-medium text-[#4B5563]">
                  Specialized therapeutic divisions
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-5xl sm:text-6xl font-black text-[#121212] tracking-tight block">
                  100%
                </span>
                <p className="text-sm font-medium text-[#4B5563]">
                  Qualified manufacturing & QA testing
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* 3 Story / Initiative Cards (Screenshot 8 Pattern) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 pt-4">
            
            {/* Story Card 1 */}
            <ScrollReveal delay={0.1}>
              <article className="space-y-4 flex flex-col h-full group">
                <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-stone-200 border border-stone-300/80">
                  <img
                    src={assetUrl('/assets/about-facility.jpg')}
                    alt="Onecore manufacturing environment"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#121212] tracking-tight leading-snug">
                  Medicine starts with quality
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed flex-1">
                  Dedicated teams work across our network to ensure formulations are produced consistently to the highest standards. Manufacturing discipline is the cornerstone of our patient promise.
                </p>
                <div className="pt-2">
                  <Link
                    to="/quality-manufacturing"
                    className="lilly-red-underline text-sm inline-block"
                  >
                    Examine our process
                  </Link>
                </div>
              </article>
            </ScrollReveal>

            {/* Story Card 2 */}
            <ScrollReveal delay={0.15}>
              <article className="space-y-4 flex flex-col h-full group">
                <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-stone-200 border border-stone-300/80">
                  <img
                    src={assetUrl('/assets/quality.jpg')}
                    alt="Laboratory verification and quality testing"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#121212] tracking-tight leading-snug">
                  Protecting formulation integrity
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed flex-1">
                  We implement multi-stage batch controls, verified packaging seals, and strict quality documentation so physicians and pharmacists receive genuine, uncompromised medicines.
                </p>
                <div className="pt-2">
                  <Link
                    to="/quality-manufacturing"
                    className="lilly-red-underline text-sm inline-block"
                  >
                    View testing protocols
                  </Link>
                </div>
              </article>
            </ScrollReveal>

            {/* Story Card 3 */}
            <ScrollReveal delay={0.2}>
              <article className="space-y-4 flex flex-col h-full group">
                <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-stone-200 border border-stone-300/80">
                  <img
                    src={assetUrl('/assets/hero-patients-professionals.jpg')}
                    alt="Healthcare focused on real clinical needs"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#121212] tracking-tight leading-snug">
                  Healthcare focused on real clinical needs
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed flex-1">
                  Our pipeline is shaped by continuous dialogue with healthcare practitioners, targeting common clinical gaps to improve patient adherence, tolerability, and healing.
                </p>
                <div className="pt-2">
                  <Link
                    to="/about"
                    className="lilly-red-underline text-sm inline-block"
                  >
                    Learn about our approach
                  </Link>
                </div>
              </article>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — QUALITY ASSURANCE (DRAMATIC DARK CONTRAST SECTION)
          ========================================================================= */}
      <section className="py-24 sm:py-32 bg-[#0F1115] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <ScrollReveal>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D52B1E] block">
                  QUALITY ASSURANCE & STANDARDS
                </span>
                <h2 className="lilly-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight pt-2">
                  Quality is part of the product from the beginning.
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed">
                  Medicines carry responsibility. That is why quality needs to be considered across manufacturing, testing, review, and release — not treated as an afterthought or a final checkpoint.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/15">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#D52B1E]" />
                      <span>Consistent Standards</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                      Quality expectations aligned to the therapeutic nature and regulatory requirements of each formulation.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#D52B1E]" />
                      <span>Disciplined Release</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                      Batch-level QA verification and analytical review before any product enters distribution.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="pt-2">
                  <Link
                    to="/quality-manufacturing"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
                  >
                    <span>Explore Manufacturing & QA</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5">
              <ScrollReveal delay={0.2} direction="left">
                <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                  <img
                    src={assetUrl('/assets/quality.jpg')}
                    alt="Onecore Pharma quality control laboratory"
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="bg-[#16191F] p-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D52B1E]" />
                      Batch Verification
                    </span>
                    <span className="font-mono text-[11px] text-stone-500">QA PROTOCOL V.26</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — LATEST FROM ONECORE (NEWS & PERSPECTIVES)
          ========================================================================= */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-16">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <ScrollReveal>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#4B5563] block">
                LATEST FROM ONECORE
              </span>
              <h2 className="lilly-serif text-3xl sm:text-5xl text-[#121212] tracking-tight leading-tight pt-2">
                News & perspectives.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <Link
                to="/news"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#121212] hover:text-[#D52B1E] transition-colors group"
              >
                <span>View all news</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </ScrollReveal>
          </div>

          {/* 3 News Articles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {dynamicNews.slice(0, 3).map((article, idx) => (
              <ScrollReveal key={article.id} delay={idx * 0.08}>
                <article className="group flex flex-col h-full space-y-4">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-stone-200 bg-stone-100">
                    <img
                      src={assetUrl(article.image)}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                    <span className="font-bold tracking-wider text-[#D52B1E] uppercase">
                      {article.category}
                    </span>
                    <time dateTime={article.date}>{article.date}</time>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#121212] group-hover:text-[#D52B1E] transition-colors leading-snug">
                    <Link to="/news">
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-[#4B5563] leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="pt-2 mt-auto">
                    <Link
                      to="/news"
                      className="lilly-red-underline text-xs inline-flex items-center gap-1"
                    >
                      <span>Read article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 8 — FINAL CALL TO ACTION
          ========================================================================= */}
      <section className="py-24 sm:py-32 bg-[#FAF9F6] border-t border-[#E5E7EB] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <ScrollReveal>
            <h2 className="lilly-serif text-3xl sm:text-5xl lg:text-6xl text-[#121212] tracking-tight leading-tight">
              Purposeful healthcare, <em className="lilly-serif-italic">across every area we serve.</em>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
              Explore the 9 specialized divisions and over 60 therapeutic formulations that make up the Onecore portfolio.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
              <Link
                to="/areas-of-care"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#D52B1E] hover:bg-[#B52015] text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <span>Explore Areas of Care</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-stone-300 text-[#121212] hover:bg-stone-50 text-sm font-medium rounded-full transition-all duration-200"
              >
                <span>Connect With Us</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
