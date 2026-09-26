import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, Building2, MapPin, Mail, Phone, Users, TrendingUp } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useSettings } from '../hooks/useSettings';
import { assetUrl } from '../utils/assetUrl';

export default function DistributionPartnerships() {
  const { contact } = useSettings();

  useEffect(() => {
    document.title = "Distribution & Franchise Partnerships | Onecore Pharma";
  }, []);

  const displayEmail = contact?.general_email || 'info@onecorepharma.in';
  const displayPhone = contact?.phone || '8169255034';

  const [formData, setFormData] = useState({
    partnerName: '',
    firmName: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    experienceYears: '',
    drugLicense: '',
    gstNumber: '',
    therapeuticInterest: 'All Divisions',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const partnerAdvantages = [
    {
      title: 'Broad Portfolio',
      desc: 'Access clinically engineered products across 9 specialized therapeutic areas, enabling you to build a resilient and diversified business.',
      icon: TrendingUp,
    },
    {
      title: 'Territory Focused Approach',
      desc: 'Clearly defined operating boundaries and structured regional agreements to foster long-term, sustainable commercial growth in your market.',
      icon: MapPin,
    },
    {
      title: 'Dependable Supply & Quality',
      desc: '100% cGMP-certified manufacturing with disciplined batch release, verified stability protocols, and punctual supply chain fulfillment.',
      icon: ShieldCheck,
    },
    {
      title: 'Commercial & Medical Support',
      desc: 'Comprehensive clinical monographs, doctor visual aids, regulatory dossiers, and dedicated operational desks to empower your field team.',
      icon: Users,
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F6] text-[#121212]">

      {/* =========================================================================
          SECTION 1 — HERO
          ========================================================================= */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 border-b border-[#E5E3DC] bg-white">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-[#121212] tracking-tight leading-[1.05]">
              Distribution & Franchise Partnerships
            </h1>

            <p className="text-2xl sm:text-3xl font-serif italic text-[#D52B1E]">
              Grow with Onecore.
            </p>

            <p className="text-lg sm:text-xl text-[#555555] font-light leading-relaxed font-sans max-w-3xl">
              We are expanding our distribution network across India and are looking to partner with pharmaceutical distributors and franchise partners who understand their markets and want to build for the long term.
            </p>

            <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed font-sans max-w-3xl">
              With a growing portfolio across multiple therapeutic areas, Onecore offers partners access to relevant products, dependable supply, and structured commercial support.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#partner-form"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors shadow-xs"
              >
                <span>Apply for Partnership</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/areas-of-care"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FAF9F6] hover:bg-[#EBE9E1] text-[#121212] text-xs font-semibold rounded-full transition-colors border border-[#E5E3DC]"
              >
                <span>View Product Portfolio</span>
              </Link>
            </div>
          </div>

          {/* Stately Indian Corporate / Clinical Photo Frame */}
          <div className="relative rounded-[28px] overflow-hidden border border-[#E5E3DC] shadow-sm aspect-[16/9] lg:aspect-[21/9] bg-[#FAF9F6]">
            <img
              src={assetUrl('/assets/about-facility.jpg')}
              alt="Onecore Pharma pan-India pharmaceutical supply network"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — WHY PARTNER WITH ONECORE (4 PILLARS)
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto space-y-14">
        <div className="max-w-3xl space-y-4">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-tight">
              Why partner with Onecore
            </h2>
            <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed">
              We partner with ethical distributors, PCD franchises, and institutional supply associates who share our vision for medical integrity and clinical excellence.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerAdvantages.map((pillar, idx) => {
            const IconComp = pillar.icon;
            return (
              <ScrollReveal key={pillar.title} delay={idx * 0.08}>
                <div className="bg-white border border-[#E5E3DC] hover:border-[#121212] p-8 rounded-3xl h-full flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md transition-all duration-300">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#D52B1E]/10 flex items-center justify-center text-[#D52B1E]">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-[#121212] tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[#555555] leading-relaxed font-sans font-light">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2.5 — COMMERCIAL SYNERGY & ETHICAL BUSINESS PARTNERSHIP
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-white border-t border-[#E5E3DC] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal>
                <div className="space-y-3">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#D52B1E]">
                    COMMERCIAL ALLIANCES
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-tight">
                    Ethical Alliances Built on Trust & Territory Integrity.
                  </h2>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed">
                  At Onecore Pharma, distribution partnerships are not merely transactional vendor agreements; they are long-term commercial relationships designed to deliver quality medicines to healthcare practitioners and patients across India.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#D52B1E]/10 flex items-center justify-center text-[#D52B1E] shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#121212]">Protected Operating Territories</h4>
                      <p className="text-xs text-[#666666] leading-relaxed pt-0.5">Definitive regional allocations preventing channel conflict and fostering sustainable enterprise growth.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#D52B1E]/10 flex items-center justify-center text-[#D52B1E] shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#121212]">Dedicated Medical & Visual Collaterals</h4>
                      <p className="text-xs text-[#666666] leading-relaxed pt-0.5">Product monographs, leave-behind literatures (LBLs), doctor detailing folders, and clinical reference decks.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#D52B1E]/10 flex items-center justify-center text-[#D52B1E] shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#121212]">Predictable Supply & Zero Backorders</h4>
                      <p className="text-xs text-[#666666] leading-relaxed pt-0.5">Disciplined manufacturing forecasting ensuring consistent inventory across all 9 therapeutic divisions.</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Authentic Indian Business Handshake Card */}
              <ScrollReveal delay={0.2}>
                <div className="relative rounded-2xl overflow-hidden border border-[#E5E3DC] aspect-[16/8] shadow-xs mt-4">
                  <img
                    src={assetUrl('/assets/internet/partnership-handshake.jpg')}
                    alt="Authentic Indian pharmaceutical business partnership agreement"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </ScrollReveal>
            </div>

            {/* Right Stately Photo Frame — Bangalore / Indian Corporate Meeting */}
            <div className="lg:col-span-6">
              <ScrollReveal delay={0.15}>
                <div className="relative rounded-[28px] overflow-hidden border border-[#E5E3DC] shadow-md aspect-[4/3] bg-[#FAF9F6]">
                  <img
                    src={assetUrl('/assets/internet/partnership-meeting.jpg')}
                    alt="Onecore Pharma business development review meeting with regional franchise partners"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2.7 — LOGISTICS & INFRASTRUCTURE SHOWCASE
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto space-y-14">
        <div className="max-w-3xl space-y-3">
          <ScrollReveal>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#D52B1E]">
              DISTRIBUTION INFRASTRUCTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-tight">
              Pan-India Cold Chain & High-Throughput Logistics
            </h2>
            <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed">
              Every shipment leaving our central hubs is protected by disciplined temperature logging, certified primary packaging, and rapid logistics dispatch.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Card 1: Warehouse / Cold-Chain Logistics */}
          <ScrollReveal delay={0.08}>
            <div className="bg-white border border-[#E5E3DC] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col h-full">
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={assetUrl('/assets/internet/distribution-logistics.jpg')}
                  alt="Automated pharmaceutical warehousing and cold-chain logistics facility"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-8 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#121212] tracking-tight">
                    Temperature-Controlled Cold Chain
                  </h3>
                  <p className="text-sm text-[#555555] leading-relaxed font-sans font-light pt-2">
                    Calibrated cold storage (2°C–8°C) and automated climate chambers protecting thermo-sensitive formulations from manufacturing release through final distributor delivery.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5E3DC] text-xs font-mono text-[#D52B1E] uppercase tracking-wider font-semibold">
                  Zero Temperature Excursion Protocol
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Packaging Integrity & Serialization */}
          <ScrollReveal delay={0.16}>
            <div className="bg-white border border-[#E5E3DC] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col h-full">
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={assetUrl('/assets/internet/pharma-packaging.jpg')}
                  alt="Quality pharmaceutical blister packaging and tamper-evident batch serialization"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-8 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#121212] tracking-tight">
                    Tamper-Evident Packaging & Serialization
                  </h3>
                  <p className="text-sm text-[#555555] leading-relaxed font-sans font-light pt-2">
                    Every formulation is enclosed in moisture-barrier Alu-Alu / blister packaging with standardized 2D matrix barcoding and batch serialization for complete traceability.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5E3DC] text-xs font-mono text-[#D52B1E] uppercase tracking-wider font-semibold">
                  National Pharmacopeial Quality Standards
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — PARTNERSHIP INQUIRY FORM
          ========================================================================= */}
      <section id="partner-form" className="py-20 sm:py-28 bg-white border-t border-[#E5E3DC] px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight">
              Submit Your Partnership Application
            </h2>
            <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed max-w-2xl mx-auto">
              Share details about your distribution capabilities, target territory, and existing pharmaceutical presence. Our commercial expansion desk will respond within 48 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF9F6] border border-[#E5E3DC] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#00A859]/10 text-[#00A859] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#121212]">
                Application Received
              </h3>
              <p className="text-sm sm:text-base text-[#555555] max-w-lg mx-auto">
                Thank you for your interest in partnering with Onecore Pharma. Our regional business development head will review your territory application and contact you directly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-[#121212] text-white text-xs font-semibold rounded-full hover:bg-[#D52B1E] transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 sm:p-12 rounded-3xl bg-[#FAF9F6] border border-[#E5E3DC] space-y-6 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.partnerName}
                    onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#D52B1E] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
                    Firm / Agency Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firmName}
                    onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                    placeholder="e.g. Medico Pharma Distributors"
                    className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#D52B1E] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.in"
                    className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#D52B1E] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#D52B1E] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Maharashtra, Uttar Pradesh"
                    className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#D52B1E] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
                    City / Target Headquarters *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Mumbai, Lucknow"
                    className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#D52B1E] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
                    Drug License (DL No.)
                  </label>
                  <input
                    type="text"
                    value={formData.drugLicense}
                    onChange={(e) => setFormData({ ...formData, drugLicense: e.target.value })}
                    placeholder="Enter 20B/21B License No."
                    className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#D52B1E] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
                    GSTIN Number
                  </label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    placeholder="Enter GSTIN Number"
                    className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#D52B1E] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
                  Existing Experience & Message
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your distribution experience, current doctor coverage, and therapeutic areas of interest..."
                  className="w-full px-4 py-3 bg-white border border-[#E5E3DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#D52B1E] transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <p className="text-xs text-[#777777]">
                  All partner submissions are strictly confidential.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}

          {/* Quick Direct Desk */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E3DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#555555]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#D52B1E]" />
              <span className="font-semibold text-[#121212]">Corporate Distribution Desk:</span>
              <span>{displayEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D52B1E]" />
              <span className="font-semibold text-[#121212]">Partner Hotline:</span>
              <span>+91 {displayPhone}</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — FINAL CTA
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#121212] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight leading-tight text-balance">
            Building Long-Term Commercial Relationships.
          </h2>
          <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            Discover how partnering with Onecore Pharma can expand your therapeutic portfolio with reliable supply and sustained commercial growth.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/areas-of-care"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-lg"
            >
              <span>Explore Formulations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors border border-white/15"
            >
              <span>Contact Corporate Office</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
