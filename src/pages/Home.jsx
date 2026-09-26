import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
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

  // Smooth scroll controls for the Areas of Care carousel
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 100% AUTHENTIC ONECORE CONTENT PRESERVED FROM CMS & STATIC DATABASE
  const heroSec = getSection('hero', {
    title: 'Prescribing a better tomorrow',
    image_url: '/assets/internet/doctors-walking-corridor.jpg',
  });

  const aboutSec = getSection('about_onecore', {
    eyebrow: '',
    title: 'Healthcare is personal. \nOur approach should be too.',
    body: 'Onecore Pharma is a pharmaceutical company focused on purposeful formulations, dependable quality and the needs of patients and healthcare professionals.',
    cta_text: 'Discover Onecore',
    cta_url: '/about',
    image_url: '/assets/internet/healthcare-team-discussion.jpg',
  });

  const areasSec = getSection('areas_of_care', {
    eyebrow: '',
    title: 'Areas of Care',
  });

  const purposeSec = getSection('our_purpose', {
    eyebrow: '',
    title: 'Improve care through medicines and healthcare solutions that matter.',
    items: [
      {
        title: 'Our Vision',
        desc: 'To be a trusted partner for healthcare professionals across India, known for our innovation, reliability, and commitment to excellence in prescription medicine.'
      },
      {
        title: 'Our Mission',
        desc: 'To improve patient health outcomes by delivering high-quality, prescription-based products that address the unique needs of Orthopaedic, Gynaecological, Paediatric and General Segment.'
      }
    ]
  });

  const qualitySec = getSection('quality_assurance', {
    eyebrow: '',
    title: 'Quality is part of the product from the beginning.',
    body: 'Medicines carry responsibility. That is why quality needs to be considered across manufacturing, testing, review and release, not treated as a final checkpoint.',
    subheading: 'Our approach is centered on qualified manufacturing environments, appropriate quality controls and disciplined review before products reach the market.',
    image_url: '/assets/internet/lab-chemistry.jpg',
    items: [
      {
        title: 'Consistent standards',
        desc: 'Quality expectations aligned to the nature and regulatory requirements of each product.'
      },
      {
        title: 'Responsible release',
        desc: 'Review and controls designed to support product consistency and reliability.'
      }
    ]
  });

  const sustainabilitySec = getSection('sustainability', {
    eyebrow: '',
    title: 'Better health and a healthier future belong together.',
    body: 'Our responsibility extends beyond the products we provide. As Onecore grows, we want responsible choices to become part of how we operate, how we source and how we work with our partners.',
    items: [
      {
        eyebrow: '',
        title: 'Use resources thoughtfully.',
        desc: 'Work toward more efficient use of energy, water and materials across the operations and manufacturing network that support our products.',
      },
      {
        eyebrow: '',
        title: 'Reduce what is unnecessary.',
        desc: 'Evaluate packaging choices with the aim of reducing avoidable material use while protecting product quality, safety and stability.',
      },
      {
        eyebrow: '',
        title: 'Grow with shared standards.',
        desc: 'Build relationships with partners who share expectations around quality, compliance, ethical conduct and environmental responsibility.',
      }
    ]
  });

  const lookingAheadSec = getSection('looking_ahead', {
    eyebrow: '',
    title: 'Building depth. \nExpanding thoughtfully.',
    body: 'Our roadmap prioritizes therapeutic rigor, medical dialogue, and disciplined expansion that preserves trust.',
    items: [
      {
        title: "Deepen therapeutic expertise",
        desc: "Build stronger portfolios within our core areas of care."
      },
      {
        title: "Strengthen medical engagement",
        desc: "Stay closer to clinical practice and evolving healthcare needs."
      },
      {
        title: "Expand thoughtfully",
        desc: "Enter new areas where the portfolio can add meaningful value."
      },
      {
        title: "Grow responsibly",
        desc: "Strengthen quality, partnerships and sustainable practices as the organisation scales."
      }
    ]
  });

  const newsSec = getSection('news_preview', {
    eyebrow: '',
    title: 'News & perspectives.',
  });

  const finalCtaSec = getSection('final_cta', {
    title: 'Purposeful healthcare, across every area we serve.',
    body: 'Explore the therapeutic areas and formulations that make up the Onecore portfolio.',
    cta_text: 'Explore areas of care',
    cta_url: '/areas-of-care',
    secondary_cta_text: 'Connect With Us',
    secondary_cta_url: '/contact',
  });

  // Map dynamic areas to division cards
  const divisions = (dynamicAreas && dynamicAreas.length > 0)
    ? dynamicAreas.map((a) => ({
      name: a.divisionName || a.displayName || a.title,
      specialty: a.therapeuticArea || a.displayName || a.title,
      description: a.description || a.shortDescription || 'Targeted therapeutic formulations developed to address real clinical needs.',
      image: a.image || a.image_url || '/assets/therapeutic-general-medicine.jpg',
      path: `/areas-of-care/${(a.slug || a.id || a.divisionName || '').toLowerCase().trim()}`,
    }))
    : [
      { name: "CYTOS", specialty: "Oncology", description: "Targeted therapeutics and supportive oncology care.", image: "/assets/cytos.jpg", path: "/areas-of-care/cytos" },
      { name: "FEMME", specialty: "Women’s Health", description: "Formulations supporting maternal wellness and hormonal balance.", image: "/assets/therapeutic-womens-health.jpg", path: "/areas-of-care/femme" },
      { name: "NEURIX", specialty: "Neurology", description: "Neuroprotective and cognitive formulations for CNS care.", image: "/assets/neurix.jpg", path: "/areas-of-care/neurix" },
      { name: "ORTHEON", specialty: "Orthopaedics", description: "Musculoskeletal mobility and cartilage protection solutions.", image: "/assets/ortheon.jpg", path: "/areas-of-care/ortheon" },
      { name: "VELLIS", specialty: "Dermatology", description: "Dermatological formulations restoring barrier integrity.", image: "/assets/vellis.webp", path: "/areas-of-care/vellis" },
      { name: "EYERIX", specialty: "Ophthalmology", description: "Precision ocular care and anti-inflammatory eye formulations.", image: "/assets/eyerix.jpg", path: "/areas-of-care/eyerix" },
      { name: "OTIRA", specialty: "ENT", description: "Targeted airway and otolaryngology formulations.", image: "/assets/otira.jpg", path: "/areas-of-care/otira" },
      { name: "PEDIAPLUS", specialty: "Paediatrics", description: "Safe, child-friendly dosage forms and pediatric wellness.", image: "/assets/pediaplus.jpg", path: "/areas-of-care/pediaplus" },
      { name: "OMNARA", specialty: "General Medicine", description: "Essential broad-spectrum therapeutics for daily practice.", image: "/assets/therapeutic-general-medicine.jpg", path: "/areas-of-care/omnara" },
    ];

  return (
    <div className="w-full bg-white overflow-hidden">

      {/* =========================================================================
          SECTION 1 — HERO BANNER
          Clean, stately, high-contrast human photography with bold typography
          ========================================================================= */}
      {heroSec.is_active && (
        <section className="relative min-h-[90vh] sm:min-h-screen flex items-end pb-16 sm:pb-24 pt-32 px-4 sm:px-8 lg:px-12 bg-black">
          {/* Hero Background Photograph */}
          <div className="absolute inset-0 z-0">
            <img
              src={assetUrl(heroSec.image_url || '/assets/hero-healthcare.jpg')}
              alt="Onecore Pharma — Prescribing a better tomorrow"
              className="w-full h-full object-cover object-center opacity-85 brightness-90"
              loading="eager"
            />
            {/* Directional contrast gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          </div>

          {/* Hero Content Block */}
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
            <ScrollReveal>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tightest leading-[1.04] max-w-4xl">
                {heroSec.title || 'Prescribing a better tomorrow'}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-base sm:text-xl text-white/85 font-normal max-w-2xl leading-relaxed">
                Purposeful formulations, dependable quality, and healthcare solutions centered on patients and healthcare professionals.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/areas-of-care"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#D52B1E] hover:bg-[#B52015] text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <span>Explore Areas of Care</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-sm font-medium rounded-full transition-all duration-200"
                >
                  <span>About Onecore</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 2 — ABOUT ONECORE (EDITORIAL STATEMENT & 3 PILLARS)
          Pure typography, generous white space, stately Cormorant Garamond serif
          ========================================================================= */}
      {aboutSec.is_active && (
        <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-16 sm:space-y-20">

            {/* Editorial Title with Italicized Punchline */}
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <ScrollReveal>
                <h2 className="lilly-serif text-3xl sm:text-5xl lg:text-6xl text-[#121212] tracking-tight leading-[1.12] pt-2 text-balance">
                  Healthcare is personal. <br className="hidden sm:inline" /><em className="lilly-serif-italic font-normal text-[#121212]">Our approach should be too.</em>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed pt-2">
                  {aboutSec.body || 'Onecore Pharma is a pharmaceutical company focused on purposeful formulations, dependable quality and the needs of patients and healthcare professionals.'}
                </p>
              </ScrollReveal>
            </div>

            {/* 3 Editorial Pillars (Pure typography, no fake icon boxes) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pt-4">

              {/* Pillar 1 */}
              <ScrollReveal delay={0.1}>
                <div className="flex flex-col h-full space-y-4 p-2 border-t border-stone-200 pt-6">
                  <h3 className="text-2xl font-bold text-[#121212] tracking-tight">
                    Purposeful Formulations
                  </h3>
                  <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed flex-1">
                    Developed to address real clinical needs across 9 specialized disciplines, offering healthcare professionals dependable choices.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/areas-of-care"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-all duration-200 group"
                    >
                      <span>Explore Formulations</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

              {/* Pillar 2 */}
              <ScrollReveal delay={0.15}>
                <div className="flex flex-col h-full space-y-4 p-2 border-t border-stone-200 pt-6">
                  <h3 className="text-2xl font-bold text-[#121212] tracking-tight">
                    Dependable Quality
                  </h3>
                  <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed flex-1">
                    Quality is considered across manufacturing, testing, review and release — never treated as a mere final checkpoint.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/quality-manufacturing"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-all duration-200 group"
                    >
                      <span>View Quality Standards</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

              {/* Pillar 3 */}
              <ScrollReveal delay={0.2}>
                <div className="flex flex-col h-full space-y-4 p-2 border-t border-stone-200 pt-6">
                  <h3 className="text-2xl font-bold text-[#121212] tracking-tight">
                    Patient & Doctor Focus
                  </h3>
                  <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed flex-1">
                    Staying close to everyday clinical practice and patients’ daily realities to ensure treatments remain accessible and effective.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-all duration-200 group"
                    >
                      <span>Discover Onecore</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3 — AREAS OF CARE (ONECORE DIVISIONS + LILLY CAROUSEL)
          Generous rounded-[28px] cards, horizontal scroll controls, authentic photography
          ========================================================================= */}
      {areasSec.is_active && (
        <section className="py-20 sm:py-28 bg-[#FAF9F6] border-y border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <ScrollReveal>
                <h2 className="lilly-serif text-4xl sm:text-6xl lg:text-7xl text-[#121212] tracking-tight leading-tight">
                  Areas of Care
                </h2>
              </ScrollReveal>

              {/* Circular Carousel Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="w-12 h-12 rounded-full border border-stone-300 hover:border-black bg-white flex items-center justify-center text-stone-800 hover:text-black transition-colors shadow-sm focus:outline-none"
                  aria-label="Previous Division"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="w-12 h-12 rounded-full border border-stone-300 hover:border-black bg-white flex items-center justify-center text-stone-800 hover:text-black transition-colors shadow-sm focus:outline-none"
                  aria-label="Next Division"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Horizontal Condition Carousel */}
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-none pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory"
            >
              {divisions.map((item) => (
                <div
                  key={item.name}
                  className="snap-start flex-shrink-0 w-[280px] sm:w-[340px] lg:w-[380px]"
                >
                  <Link
                    to={item.path || '/areas-of-care'}
                    className="group relative block aspect-[4/5] rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-stone-900 border border-stone-200/80"
                  >
                    {/* Background Imagery */}
                    <img
                      src={assetUrl(item.image)}
                      alt={`${item.name} — ${item.specialty}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Gradient Mask for High Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                    {/* Card Content Overlay (Clean bottom alignment, no top chip) */}
                    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-300">
                          {item.name}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                          {item.specialty}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed font-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4 — OUR PURPOSE & IMPACT
          High-stature numbers, clean horizontal hairline dividers
          ========================================================================= */}
      {purposeSec.is_active && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-16 sm:space-y-20">

            {/* Header */}
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <ScrollReveal>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280] block">
                  {purposeSec.eyebrow || 'OUR PURPOSE'}
                </span>
                <h2 className="lilly-serif text-3xl sm:text-5xl lg:text-6xl text-[#121212] tracking-tight leading-[1.1] text-balance">
                  Improve care through medicines <br className="hidden sm:inline" /><em className="lilly-serif-italic">and healthcare solutions that matter.</em>
                </h2>
              </ScrollReveal>
            </div>

            {/* Impact Numbers */}
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-stone-200">
                <div className="space-y-2">
                  <span className="text-5xl sm:text-6xl font-black text-[#121212] tracking-tight block">
                    60+
                  </span>
                  <p className="text-sm font-medium text-[#4B5563]">
                    Purposeful formulations across core specialties
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
                    Batch verification and disciplined quality release
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Rich Visual Storytelling & Editorial Link to About (Eliminates duplicate Vision/Mission) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-6">
              <div className="lg:col-span-7">
                <ScrollReveal delay={0.15}>
                  <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-sm aspect-[16/10] bg-[#FAF9F6]">
                    <img
                      src={assetUrl(aboutSec.image_url || '/assets/internet/healthcare-team-discussion.jpg')}
                      alt="Onecore Pharma healthcare professionals and clinical dialogue"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <ScrollReveal delay={0.2}>
                  <h3 className="lilly-serif text-2xl sm:text-4xl text-[#121212] tracking-tight leading-snug">
                    Connecting Clinical Science with Real Patient Needs
                  </h3>
                  <p className="text-base text-[#4B5563] leading-relaxed font-normal">
                    Onecore Pharma brings together disciplined formulation research, stringent cGMP batch authorization, and compassionate healthcare solutions to serve doctors and patients across India.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-[#121212] hover:bg-[#D52B1E] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-sm"
                    >
                      <span>Read Our Vision & Story</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5 — QUALITY ASSURANCE (FULL-BLEED PHOTOGRAPHIC OVERLAY)
          Full-page sized authentic imagery with dignified typography overlay
          ========================================================================= */}
      {qualitySec.is_active && (
        <section className="relative min-h-[640px] sm:min-h-[720px] flex items-center py-20 sm:py-28 text-white overflow-hidden">
          {/* Full-bleed background imagery */}
          <div className="absolute inset-0 z-0">
            <img
              src={assetUrl(qualitySec.image_url || '/assets/quality.jpg')}
              alt="Onecore Pharma quality assurance and laboratory testing"
              className="w-full h-full object-cover object-center brightness-50"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/35" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl space-y-8">
              <ScrollReveal>
                <h2 className="lilly-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight text-balance">
                  Quality is part of the product <br className="hidden sm:inline" />from the beginning.
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="space-y-4 text-stone-200 text-base sm:text-lg leading-relaxed">
                  <p>
                    {qualitySec.body || 'Medicines carry responsibility. That is why quality needs to be considered across manufacturing, testing, review and release, not treated as a final checkpoint.'}
                  </p>
                  {qualitySec.subheading && (
                    <p className="text-sm sm:text-base text-stone-300">
                      {qualitySec.subheading}
                    </p>
                  )}
                </div>
              </ScrollReveal>

              {/* Principles */}
              <ScrollReveal delay={0.15}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/20">
                  {qualitySec.items.map((principle, idx) => (
                    <div key={principle.title || idx} className="space-y-2">
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-[#D52B1E]" />
                        <span>{principle.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                        {principle.desc || principle.description || principle.text}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="pt-2">
                  <Link
                    to="/areas-of-care"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-lg"
                  >
                    <span>Explore Areas of Care</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 6 — SUSTAINABILITY & RESPONSIBILITY
          Clean editorial cards, pure typography, signature red underline links
          ========================================================================= */}
      {sustainabilitySec.is_active && (
        <section className="py-24 sm:py-32 bg-[#FAF9F6] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

            {/* Header */}
            <div className="max-w-3xl space-y-4">
              <ScrollReveal>
                <h2 className="lilly-serif text-3xl sm:text-5xl lg:text-6xl text-[#121212] tracking-tight leading-tight text-balance">
                  Better health and a healthier future <br className="hidden sm:inline" />belong together.
                </h2>
                <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed pt-2">
                  {sustainabilitySec.body || 'Our responsibility extends beyond the products we provide. As Onecore grows, we want responsible choices to become part of how we operate, how we source and how we work with our partners.'}
                </p>
              </ScrollReveal>
            </div>

            {/* 3 Sustainability Cards (Clean typography, no tacky icon containers) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 pt-4">
              {sustainabilitySec.items.map((col, idx) => (
                <ScrollReveal key={col.title || idx} delay={0.05 + idx * 0.05}>
                  <div className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200/80 shadow-sm flex flex-col h-full space-y-4 group">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#121212] tracking-tight">
                      {col.title}
                    </h3>
                    <p className="text-sm text-[#4B5563] leading-relaxed flex-1">
                      {col.desc || col.description || col.text}
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/about"
                        className="lilly-red-underline text-xs inline-flex items-center gap-1"
                      >
                        <span>Learn about our practices</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 7 — LOOKING AHEAD (ONECORE STRATEGIC ROADMAP)
          ========================================================================= */}
      {lookingAheadSec.is_active && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left Header */}
            <div className="lg:col-span-5 space-y-6">
              <ScrollReveal>
                <h2 className="lilly-serif text-3xl sm:text-5xl text-[#121212] tracking-tight leading-tight whitespace-pre-line pt-2">
                  {lookingAheadSec.title || 'Building depth. \nExpanding thoughtfully.'}
                </h2>
                <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed pt-2 whitespace-pre-line">
                  {lookingAheadSec.body || 'Our roadmap prioritizes therapeutic rigor, medical dialogue, and disciplined expansion that preserves trust.'}
                </p>
              </ScrollReveal>
            </div>

            {/* Right Strategic Rows */}
            <div className="lg:col-span-7">
              <div className="border-t border-stone-200 divide-y divide-stone-200">
                {lookingAheadSec.items.map((item, idx) => (
                  <ScrollReveal key={item.title || idx} delay={idx * 0.08}>
                    <div className="py-6 sm:py-7 space-y-2 group hover:bg-[#FAF9F6] transition-colors px-4 -mx-4 rounded-2xl">
                      <h3 className="text-lg sm:text-xl font-bold text-[#121212] tracking-tight group-hover:text-[#D52B1E] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#4B5563] leading-relaxed">
                        {item.desc || item.description || item.text}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 8 — NEWS PREVIEW
          ========================================================================= */}
      {newsSec.is_active && (
        <section className="py-24 sm:py-32 bg-[#FAF9F6] border-t border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <ScrollReveal>
                <h2 className="lilly-serif text-3xl sm:text-5xl text-[#121212] tracking-tight leading-tight pt-2">
                  {newsSec.title || 'News & perspectives.'}
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <Link
                  to={newsSec.cta_url || '/news'}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#121212] hover:text-[#D52B1E] transition-colors group"
                >
                  <span>{newsSec.cta_text || 'View all news'}</span>
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
                      <FallbackImage
                        src={article.image}
                        alt={article.title}
                        aspectRatio="aspect-[16/10]"
                        className="group-hover:scale-105 transition-transform duration-500"
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
      )}

      {/* =========================================================================
          SECTION 9 — FINAL CTA
          ========================================================================= */}
      {finalCtaSec.is_active && (
        <section className="py-24 sm:py-32 bg-white border-t border-[#E5E7EB] text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <ScrollReveal>
              <h2 className="lilly-serif text-3xl sm:text-5xl lg:text-6xl text-[#121212] tracking-tight leading-tight text-balance">
                Purposeful healthcare, <br className="hidden sm:inline" />across every area we serve.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
                {finalCtaSec.body || 'Explore the therapeutic areas and formulations that make up the Onecore portfolio.'}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
                <Link
                  to={finalCtaSec.cta_url || '/areas-of-care'}
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#D52B1E] hover:bg-[#B52015] text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <span>{finalCtaSec.cta_text || 'Explore areas of care'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                {finalCtaSec.secondary_cta_text && (
                  <Link
                    to={finalCtaSec.secondary_cta_url || '/contact'}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-stone-300 text-[#121212] hover:bg-stone-50 text-sm font-medium rounded-full transition-all duration-200"
                  >
                    <span>{finalCtaSec.secondary_cta_text}</span>
                  </Link>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

    </div>
  );
}
