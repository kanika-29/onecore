import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, ArrowRight, ArrowDown, CheckCircle2, ArrowUpRight, MapPin } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import HeroResponsiveImage from '../components/HeroResponsiveImage';
import PageSkeleton from '../components/PageSkeleton';
import { useCmsPage } from '../hooks/useCmsPage';
import { useSettings } from '../hooks/useSettings';
import { assetUrl } from '../utils/assetUrl';

export default function Contact() {
  const { getSection, loading: cmsLoading, isError: cmsError } = useCmsPage('contact');
  const { contact } = useSettings();

  useEffect(() => {
    document.title = "Contact Onecore | Product Inquiries & Direct Channels";

    const hash = window.location.hash;
    const match = hash.match(/#(enquiry-form|contact-details)/);
    if (match && match[1]) {
      setTimeout(() => {
        scrollToSection(match[1]);
      }, 250);
    }
  }, []);

  const scrollToSection = (id) => {
    const cleanId = (id || '').replace(/^#/, '');
    const element = document.getElementById(cleanId);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const heroSec = getSection('contact_hero', getSection('hero', {
    eyebrow: 'CONNECT WITH US',
    title: 'Get in Touch with Onecore Pharma',
    heading: 'Get in Touch with Onecore Pharma',
    body: 'Whether you are looking for product information, exploring a business opportunity or simply want to reach our team, we will help direct your enquiry to the appropriate place.',
    cta_text: 'Send an Enquiry',
    cta_url: '#enquiry-form',
    secondary_cta_text: 'Contact Details',
    secondary_cta_url: '#contact-details',
    image_url: '/assets/internet/contact-direct-helpline.jpg',
  }));

  const channelsSec = getSection('contact_info_cards', getSection('direct_channels', {
    eyebrow: 'GET IN TOUCH',
    title: 'Company Contact Coordinates',
    heading: 'Company Contact Coordinates',
    subheading: 'Direct channels and operational hours for healthcare professionals, patients, and partners.',
    body: 'Onecore Pharma Headquarters, Industrial Area, Hyderabad, India',
    items: [],
  }));

  // Parse contact coordinates from MySQL content_json or fallback to settings/defaults
  const coords = channelsSec.content || (channelsSec.content_json ? (() => {
    try { return typeof channelsSec.content_json === 'string' ? JSON.parse(channelsSec.content_json) : channelsSec.content_json; }
    catch { return {}; }
  })() : {}) || {};

  const displayEmail = coords.support_email || contact?.general_email || contact?.email || 'info@onecorepharma.in';
  const displayBusinessEmail = coords.business_email || contact?.business_email || 'info@onecorepharma.in';
  const displayPhone = coords.primary_phone || contact?.phone || '8169255034';
  const displayHours = coords.working_hours || contact?.office_hours || contact?.business_hours || '10 AM to 7 PM';
  const displayOffice = coords.registered_office || channelsSec.body || 'Onecore Pharma Headquarters, Industrial Area, Hyderabad, India';

  // Resolved dynamic cards list: use database items if present, otherwise build from coordinates
  const channelCards = (channelsSec.items && channelsSec.items.length > 0)
    ? channelsSec.items
    : [
        {
          channel: 'SUPPORT EMAIL',
          value: displayEmail,
          desc: 'For general company, medical affairs, and product related enquiries.',
          cta_text: 'Write to info desk',
          cta_url: `mailto:${displayEmail}`,
        },
        {
          channel: 'PRIMARY PHONE',
          value: displayPhone,
          desc: 'Available during regular corporate business hours.',
          cta_text: 'Call our team',
          cta_url: `tel:${displayPhone.replace(/[^0-9+]/g, '')}`,
        },
        {
          channel: 'BUSINESS HOURS',
          value: displayHours,
          desc: 'Dedicated corporate operations & support hours.',
          cta_text: 'WORKING DAYS // MON – SAT',
          cta_url: null,
        },
        {
          channel: 'BUSINESS EMAIL',
          value: displayBusinessEmail,
          desc: 'For institutional distribution, franchise partnerships, and commercial procurement.',
          cta_text: 'Email business desk',
          cta_url: `mailto:${displayBusinessEmail}`,
        },
        {
          channel: 'REGISTERED OFFICE',
          value: displayOffice,
          desc: 'Registered corporate office and official correspondence location.',
          cta_text: 'Corporate Office',
          cta_url: '#contact-details',
        },
      ];

  const enquiryOptions = [
    { value: 'Product information', label: 'Product information' },
    { value: 'Business and distribution', label: 'Business & distribution' },
    { value: 'Careers', label: 'Careers' },
    { value: 'General enquiry', label: 'General enquiry' },
  ];

  const partnershipSec = getSection('partnerships_section', {
    eyebrow: 'Distribution & Franchise Partnerships',
    title: 'Grow with Onecore.',
    lead: 'We are expanding our distribution network across India and are looking to partner with pharmaceutical distributors and franchise partners who understand their markets and want to build for the long term.',
    body: 'With a growing portfolio across multiple therapeutic areas, Onecore offers partners access to relevant products, dependable supply and structured commercial support.',
    why_title: 'Why partner with Onecore',
    items: [
      {
        num: '01',
        title: 'Broad portfolio',
        description: 'Access products across multiple therapeutic areas, helping you build a more diversified business.',
      },
      {
        num: '02',
        title: 'Territory focused approach',
        description: 'Work within clearly discussed markets with a focus on sustainable product movement and growth.',
      },
      {
        num: '03',
        title: 'Better inventory planning',
        description: 'We believe in practical stock planning and consistent replenishment rather than unnecessary inventory loading.',
      },
      {
        num: '04',
        title: 'Partner support',
        description: 'Receive product information, promotional support and a dedicated point of contact for smoother day to day coordination.',
      },
    ],
    pillars: [
      {
        num: '01',
        title: 'Broad portfolio',
        description: 'Access products across multiple therapeutic areas, helping you build a more diversified business.',
      },
      {
        num: '02',
        title: 'Territory focused approach',
        description: 'Work within clearly discussed markets with a focus on sustainable product movement and growth.',
      },
      {
        num: '03',
        title: 'Better inventory planning',
        description: 'We believe in practical stock planning and consistent replenishment rather than unnecessary inventory loading.',
      },
      {
        num: '04',
        title: 'Partner support',
        description: 'Receive product information, promotional support and a dedicated point of contact for smoother day to day coordination.',
      },
    ],
    closing: "Let’s build your market together.",
    cta_text: 'Become a Onecore Partner',
    cta_url: '/partnerships',
  });

  const formIntroSec = getSection('form_intro', {
    eyebrow: 'SEND AN ENQUIRY',
    title: 'Tell us how we can help.',
    body: 'Complete the form below and your enquiry will be directed directly to the appropriate functional team.',
    subheading: 'Please do not use this form for medical emergencies or to request individual diagnosis, treatment or changes to prescribed medicines. For personal medical advice, contact a qualified healthcare professional.',
  });

  const safetySec = getSection('patient_safety', {
    eyebrow: 'PATIENT SAFETY',
    title: 'Reporting a safety or quality concern?',
    body: 'Suspected side effects and product quality concerns should be reported through the appropriate safety channel so the information can be reviewed correctly.',
    items: [
      {
        eyebrow: 'PATIENTS & CAREGIVERS',
        title: 'Patient safety reporting',
        description: 'Submit observations regarding side effects or product quality issues directly to our pharmacovigilance team.',
        cta_text: 'Report a safety or product quality concern',
        cta_url: '/patients-caregivers#patient-safety'
      },
      {
        eyebrow: 'HEALTHCARE PROFESSIONALS',
        title: 'Clinical safety desk',
        description: 'Medical practitioners can log adverse drug observations or quality documentation for formal regulatory evaluation.',
        cta_text: 'Submit safety information',
        cta_url: '/patients-caregivers#patient-safety'
      }
    ]
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organisation: '',
    contactType: '',
    natureOfEnquiry: '',
    message: '',
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSelectEnquiryType = (val) => {
    setFormData((prev) => ({ ...prev, natureOfEnquiry: val }));
    scrollToSection('enquiry-form');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.contactType) {
      newErrors.contactType = "Please select your contact profile.";
    }

    if (!formData.natureOfEnquiry) {
      newErrors.natureOfEnquiry = "Please select the nature of your enquiry.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please provide your message or enquiry details.";
    }

    if (!formData.consent) {
      newErrors.consent = "Please confirm your agreement before submitting.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'We could not submit your enquiry at this time. Please try again or reach out via phone.');
      }

      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        organisation: '',
        contactType: '',
        natureOfEnquiry: '',
        message: '',
        consent: false,
      });
    } catch (err) {
      console.error('Contact submission error:', err);
      setSubmitError(err.message || 'We encountered a connection issue. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderChannelIcon = (ch, idx) => {
    const upper = (ch || '').toUpperCase();
    if (upper.includes('EMAIL')) {
      return <Mail className="w-4 h-4 text-[#888888] group-hover:text-[#D52B1E] transition-colors" />;
    }
    if (upper.includes('PHONE')) {
      return <Phone className="w-4 h-4 text-[#888888] group-hover:text-[#D52B1E] transition-colors" />;
    }
    if (upper.includes('OFFICE') || upper.includes('HEADQUARTERS') || upper.includes('ADDRESS')) {
      return <MapPin className="w-4 h-4 text-[#888888] group-hover:text-[#D52B1E] transition-colors" />;
    }
    return <Clock className="w-4 h-4 text-[#888888] group-hover:text-[#D52B1E] transition-colors" />;
  };

  if (cmsLoading && !cmsError && !channelsSec.heading) {
    return <PageSkeleton />;
  }

  return (
    <div className="w-full bg-transparent text-[#121212]">

      {/* =========================================================================
          SECTION 1 — EDITORIAL HERO
          Spacious, dignified, human-scale typography (The Lilly Model)
          ========================================================================= */}
      {heroSec.is_active && (
        <section className="relative min-h-[90vh] sm:min-h-screen flex items-end pb-16 sm:pb-24 pt-32 px-4 sm:px-8 lg:px-12 bg-black">
          {/* Hero Background Responsive Photograph */}
          <div className="absolute inset-0 z-0">
            <HeroResponsiveImage
              desktopImage={heroSec.image_url}
              mobileImage={heroSec.image_mobile_url || heroSec.mobile_image_url}
              alt="Onecore Pharma medical communication and direct helpline desk"
              fallback="/assets/internet/contact-direct-helpline.jpg"
              className="w-full h-full object-cover object-center"
            />
            {/* Directional contrast gradient — lessened intensity */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent pointer-events-none" />
          </div>

          {/* Hero Content Block */}
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
            <ScrollReveal>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-light text-white tracking-tight leading-[1.04] max-w-4xl">
                {heroSec.title && heroSec.title !== 'Contact' ? heroSec.title : 'Get in Touch with Onecore Pharma'} <br />
                <span className="italic font-normal text-[#D52B1E]">Direct dialogue, dedicated care.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <p className="text-base sm:text-xl lg:text-2xl text-white/90 font-light leading-relaxed font-sans max-w-3xl">
                {heroSec.body || 'Whether you are looking for product information, exploring a business opportunity or simply want to reach our team, we will help direct your enquiry to the appropriate place.'}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.14}>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection(heroSec.cta_url || 'enquiry-form')}
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#D52B1E] hover:bg-[#B52015] text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <span>{heroSec.cta_text || 'Send an Enquiry'}</span>
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection(heroSec.secondary_cta_url || 'contact-details')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-sm font-medium rounded-full transition-all duration-200 cursor-pointer"
                >
                  <span>{heroSec.secondary_cta_text || 'Contact Details'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 2 — GET IN TOUCH / DIRECT CHANNELS
          ========================================================================= */}
      {channelsSec.is_active && (
        <section id="contact-details" className="py-12 sm:py-16 px-4 sm:px-8 border-b border-[#E5E3DC]/80 scroll-mt-24">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">

            <div className="max-w-3xl space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#121212] tracking-tight">
                {channelsSec.heading || channelsSec.title || 'Company Contact Coordinates'}
              </h2>
              {(channelsSec.subheading || channelsSec.body) && (
                <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed pt-1 font-sans">
                  {channelsSec.subheading || channelsSec.body}
                </p>
              )}
            </div>

            {/* Direct Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {channelCards.map((card, idx) => {
                const channelName = card.channel || card.title || (idx === 0 ? 'EMAIL' : idx === 1 ? 'PHONE' : 'BUSINESS HOURS');
                const channelVal = card.value || (idx === 0 ? displayEmail : idx === 1 ? displayPhone : displayHours);

                return (
                  <ScrollReveal key={channelName + idx} delay={0.06 * (idx + 1)}>
                    <div className="bg-white/80 backdrop-blur-xs p-8 sm:p-10 border border-[#E5E3DC] rounded-3xl h-full flex flex-col justify-between space-y-6 group hover:border-[#121212] transition-all duration-300 shadow-xs hover:shadow-md">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#777777]">
                            {channelName}
                          </span>
                          {renderChannelIcon(channelName, idx)}
                        </div>

                        {channelVal && ((card.cta_url && card.cta_url.startsWith('mailto:')) || channelName.includes('EMAIL')) ? (
                          <a
                            href={`mailto:${String(channelVal).trim()}`}
                            className="text-xl sm:text-2xl font-serif font-medium text-[#121212] group-hover:text-[#D52B1E] transition-colors block break-all tracking-tight leading-snug"
                          >
                            {channelVal}
                          </a>
                        ) : channelVal && ((card.cta_url && card.cta_url.startsWith('tel:')) || channelName.includes('PHONE')) ? (
                          <a
                            href={`tel:${String(channelVal).replace(/[^0-9+]/g, '')}`}
                            className="text-2xl sm:text-3xl font-serif font-medium text-[#121212] group-hover:text-[#D52B1E] transition-colors block whitespace-nowrap tracking-tight"
                          >
                            {channelVal}
                          </a>
                        ) : (
                          <span className="text-xl sm:text-2xl font-serif font-medium text-[#121212] block tracking-tight leading-snug">
                            {channelVal}
                          </span>
                        )}

                        <p className="text-sm text-[#555555] font-light leading-relaxed pt-1">
                          {card.desc || card.description || card.text}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#E5E3DC]">
                        {card.cta_url ? (
                          <a
                            href={card.cta_url}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#121212] group-hover:text-[#D52B1E] transition-colors"
                          >
                            <span>{card.cta_text || 'Contact'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs font-mono text-[#888888] uppercase">
                            {card.cta_text || 'WORKING DAYS // MON – SAT'}
                          </span>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3 — DISTRIBUTION & FRANCHISE PARTNERSHIPS
          Clean editorial layout matching Lilly aesthetic and client brief
          ========================================================================= */}
      {partnershipSec.is_active && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10">

          {/* Header & Strategic Mission */}
          <div className="max-w-4xl space-y-6">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#121212] tracking-tight text-balance">
                {partnershipSec.title || 'Grow with Onecore.'}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <div className="space-y-4 text-base sm:text-lg lg:text-xl text-[#333333] font-light leading-relaxed font-sans max-w-3xl">
                <p>
                  {partnershipSec.lead}
                </p>
                <p className="text-sm sm:text-base text-[#666666]">
                  {partnershipSec.body}
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Why partner with Onecore — 4 Strategic Pillars */}
          <div className="space-y-8 border-t border-[#E5E3DC] pt-12">
            <ScrollReveal>
              <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#121212] tracking-tight">
                {partnershipSec.why_title || 'Why partner with Onecore'}
              </h3>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {(partnershipSec.pillars || partnershipSec.items || []).map((pillar, idx) => (
                <ScrollReveal key={pillar.title} delay={idx * 0.08}>
                  <div className="p-8 sm:p-10 rounded-3xl bg-[#FAFAF8] border border-[#E5E3DC] hover:border-[#121212] hover:bg-white transition-all duration-300 space-y-3 group">
                    <span className="text-2xl sm:text-3xl font-serif font-light text-[#888888] group-hover:text-[#D52B1E] transition-colors">
                      {pillar.num}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#121212] tracking-tight">
                      {pillar.title}
                    </h4>
                    <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed font-sans">
                      {pillar.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Closing & CTA Action Banner */}
          <ScrollReveal delay={0.15}>
            <div className="p-8 sm:p-12 rounded-3xl bg-[#071324] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 max-w-xl">
                <h4 className="text-2xl sm:text-3xl font-serif font-light tracking-tight">
                  {partnershipSec.closing || 'Let’s build your market together.'}
                </h4>
                <p className="text-sm sm:text-base text-white/70 font-light">
                  Join our expanding network of authorized distributors and franchise partners across India.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to={partnershipSec.cta_url || '/partnerships'}
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#D52B1E] hover:bg-[#B52015] text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <span>{partnershipSec.cta_text || 'Become a Onecore Partner'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    handleSelectEnquiryType('Business and distribution');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/30 hover:border-white text-white text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <span>Quick Commercial Inquiry</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ScrollReveal>

        </section>
      )}

      {/* =========================================================================
          SECTION 4 — SEND AN ENQUIRY (Clean Editorial Form)
          ========================================================================= */}
      {formIntroSec.is_active && (
        <section id="enquiry-form" className="py-12 sm:py-16 bg-transparent border-t border-[#E5E3DC] scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8 sm:space-y-10">

            {/* Header */}
            <div className="text-center space-y-3">
              <ScrollReveal>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#121212] tracking-tight">
                  {formIntroSec.title || 'Tell us how we can help.'}
                </h2>
                <p className="text-base sm:text-lg text-[#555555] max-w-xl mx-auto font-light leading-relaxed font-sans pt-1">
                  {formIntroSec.body || 'Complete the form and your enquiry can be directed to the appropriate team.'}
                </p>
              </ScrollReveal>
            </div>

            {/* Medical Affairs & Support Desk Photo Frame */}
            <ScrollReveal delay={0.08}>
              <div className="relative rounded-3xl overflow-hidden border border-[#E5E3DC] shadow-sm aspect-[16/9] sm:aspect-[21/9] bg-stone-100">
                <img
                  src={assetUrl('/assets/internet/contact-medical-liaison.jpg')}
                  alt="Onecore Pharma medical affairs and commercial liaison team"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>

            {/* Form Container */}
            <ScrollReveal delay={0.1}>
              <div className="bg-[#FAF9F6] p-8 sm:p-14 border border-[#E5E3DC] rounded-[28px] shadow-xs">
                {isSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-white border border-[#E5E3DC] text-[#00A859] mx-auto flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-serif font-light text-[#121212]">
                      Thank you. Your enquiry has been received.
                    </h3>
                    <div className="p-6 bg-white border border-[#E5E3DC] max-w-md mx-auto rounded-2xl text-sm text-[#555555] leading-relaxed">
                      <p className="font-semibold text-[#121212]">Enquiry Logged with Onecore Corporate Affairs</p>
                      <p className="text-xs text-[#777777] mt-1.5">
                        Our team will review your message regarding <strong className="text-[#121212]">{formData.natureOfEnquiry || 'your enquiry'}</strong> and connect with you shortly.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          organisation: '',
                          contactType: '',
                          natureOfEnquiry: '',
                          message: '',
                          consent: false,
                        });
                      }}
                      className="mt-4 px-8 py-3.5 text-xs font-bold uppercase tracking-wider bg-[#121212] hover:bg-[#D52B1E] text-white rounded-full transition-colors cursor-pointer"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {submitError && (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
                        <span className="text-base">⚠️</span>
                        <div>
                          <p className="font-semibold text-rose-900">Unable to Submit Message</p>
                          <p className="mt-0.5 text-rose-700">{submitError}</p>
                        </div>
                      </div>
                    )}

                    {/* Row 1: Full name * & Email address * */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-[#121212] block">
                          Full name <span className="text-[#D52B1E]">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData({ ...formData, fullName: e.target.value });
                            if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                          }}
                          placeholder="e.g. Dr. Arthur Vance"
                          className={`w-full px-4 py-3.5 bg-white border text-sm rounded-xl focus:outline-none transition-all ${errors.fullName
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500'
                            : 'border-[#E5E3DC] focus:border-[#D52B1E] focus:ring-1 focus:ring-[#D52B1E]'
                            }`}
                        />
                        {errors.fullName && <p className="text-xs text-red-600 font-medium">{errors.fullName}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-[#121212] block">
                          Email address <span className="text-[#D52B1E]">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          placeholder="e.g. arthur.vance@medicalcenter.org"
                          className={`w-full px-4 py-3.5 bg-white border text-sm rounded-xl focus:outline-none transition-all ${errors.email
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500'
                            : 'border-[#E5E3DC] focus:border-[#D52B1E] focus:ring-1 focus:ring-[#D52B1E]'
                            }`}
                        />
                        {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Row 2: Phone number & Organisation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-[#121212] block">
                          Phone number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-4 py-3.5 bg-white border border-[#E5E3DC] text-sm rounded-xl focus:outline-none focus:border-[#D52B1E] focus:ring-1 focus:ring-[#D52B1E] transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="organisation" className="text-xs font-semibold uppercase tracking-wider text-[#121212] block">
                          Organisation
                        </label>
                        <input
                          id="organisation"
                          type="text"
                          value={formData.organisation}
                          onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                          placeholder="e.g. Hospital / Clinic / Distribution Co."
                          className="w-full px-4 py-3.5 bg-white border border-[#E5E3DC] text-sm rounded-xl focus:outline-none focus:border-[#D52B1E] focus:ring-1 focus:ring-[#D52B1E] transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 3: Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="contactType" className="text-xs font-semibold uppercase tracking-wider text-[#121212] block">
                          I am contacting Onecore as <span className="text-[#D52B1E]">*</span>
                        </label>
                        <select
                          id="contactType"
                          required
                          value={formData.contactType}
                          onChange={(e) => {
                            setFormData({ ...formData, contactType: e.target.value });
                            if (errors.contactType) setErrors({ ...errors, contactType: undefined });
                          }}
                          className={`w-full px-4 py-3.5 bg-white border text-sm rounded-xl focus:outline-none transition-all text-[#121212] ${errors.contactType
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500'
                            : 'border-[#E5E3DC] focus:border-[#D52B1E] focus:ring-1 focus:ring-[#D52B1E]'
                            }`}
                        >
                          <option value="">Select</option>
                          <option value="Healthcare professional">Healthcare professional</option>
                          <option value="Patient or caregiver">Patient or caregiver</option>
                          <option value="Distributor or business partner">Distributor or business partner</option>
                          <option value="Institutional buyer">Institutional buyer</option>
                          <option value="Job applicant">Job applicant</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.contactType && <p className="text-xs text-red-600 font-medium">{errors.contactType}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="natureOfEnquiry" className="text-xs font-semibold uppercase tracking-wider text-[#121212] block">
                          Nature of enquiry <span className="text-[#D52B1E]">*</span>
                        </label>
                        <select
                          id="natureOfEnquiry"
                          required
                          value={formData.natureOfEnquiry}
                          onChange={(e) => {
                            setFormData({ ...formData, natureOfEnquiry: e.target.value });
                            if (errors.natureOfEnquiry) setErrors({ ...errors, natureOfEnquiry: undefined });
                          }}
                          className={`w-full px-4 py-3.5 bg-white border text-sm rounded-xl focus:outline-none transition-all text-[#121212] ${errors.natureOfEnquiry
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500'
                            : 'border-[#E5E3DC] focus:border-[#D52B1E] focus:ring-1 focus:ring-[#D52B1E]'
                            }`}
                        >
                          <option value="">Select enquiry type</option>
                          {enquiryOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {errors.natureOfEnquiry && <p className="text-xs text-red-600 font-medium">{errors.natureOfEnquiry}</p>}
                      </div>
                    </div>

                    {/* Row 4: Your message * */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-[#121212] block">
                        Your message <span className="text-[#D52B1E]">*</span>
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: undefined });
                        }}
                        placeholder="Please provide details regarding your clinical, distribution, or general enquiry..."
                        className={`w-full px-4 py-3.5 bg-white border text-sm rounded-xl focus:outline-none transition-all resize-none ${errors.message
                          ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500'
                          : 'border-[#E5E3DC] focus:border-[#D52B1E] focus:ring-1 focus:ring-[#D52B1E]'
                          }`}
                      />
                      {errors.message && <p className="text-xs text-red-600 font-medium">{errors.message}</p>}
                    </div>

                    {/* Row 5: Privacy Consent Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={formData.consent}
                          onChange={(e) => {
                            setFormData({ ...formData, consent: e.target.checked });
                            if (errors.consent) setErrors({ ...errors, consent: undefined });
                          }}
                          className="mt-1 w-4 h-4 text-[#D52B1E] rounded border-[#E5E3DC] focus:ring-[#D52B1E] accent-[#D52B1E]"
                        />
                        <span className="text-xs text-[#555555] leading-relaxed">
                          I agree that Onecore may use the information provided to respond to this enquiry in accordance with its{' '}
                          <Link to="/privacy" className="text-[#121212] underline font-medium hover:text-[#D52B1E]">
                            privacy policy
                          </Link>
                          .
                        </span>
                      </label>
                      {errors.consent && <p className="text-xs text-red-600 font-medium mt-1">{errors.consent}</p>}
                    </div>

                    {/* Row 6: Submit Button */}
                    <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer shadow-sm hover:shadow disabled:bg-gray-300"
                      >
                        {isSubmitting ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <span>{formIntroSec.cta_text || 'Submit enquiry'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <span className="text-xs text-[#888888]">
                        * Required fields for clinical and corporate routing
                      </span>
                    </div>

                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Disclaimer under form */}
            {formIntroSec.subheading && (
              <ScrollReveal delay={0.15}>
                <div className="p-6 bg-[#FAF9F6] border border-[#E5E3DC] rounded-2xl text-center max-w-3xl mx-auto">
                  <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
                    {formIntroSec.subheading}
                  </p>
                </div>
              </ScrollReveal>
            )}

          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5 — PATIENT SAFETY REPORTING
          ========================================================================= */}
      {safetySec.is_active && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <div className="max-w-4xl space-y-3">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#121212] tracking-tight text-balance">
                Reporting a safety <br className="hidden sm:inline" />or quality concern?
              </h2>
              <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed pt-2 font-sans">
                {safetySec.body}
              </p>
            </ScrollReveal>
          </div>

          {/* Pharmacovigilance & Safety Advisory Desk Frame */}
          <ScrollReveal delay={0.05}>
            <div className="relative rounded-[28px] overflow-hidden border border-[#E5E3DC] shadow-sm aspect-[16/8] sm:aspect-[21/8] bg-[#FAF9F6]">
              <img
                src={assetUrl('/assets/internet/contact-medical-inquiry.jpg')}
                alt="Onecore Pharma adverse event reporting and medical inquiry desk"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </ScrollReveal>

          {/* Two Editorial Safety Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {safetySec.items.map((card, idx) => (
              <ScrollReveal key={card.title || idx} delay={idx * 0.08}>
                <div className="bg-white/80 backdrop-blur-xs p-8 sm:p-10 border border-[#E5E3DC] rounded-3xl h-full flex flex-col justify-between space-y-8 hover:border-[#121212] transition-all duration-300 shadow-xs hover:shadow-md">
                  <div className="space-y-3">
                    <h4 className="text-2xl font-serif font-medium text-[#121212] tracking-tight">
                      {card.title}
                    </h4>
                    <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed font-sans">
                      {card.description || card.desc || card.text}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E5E3DC]">
                    <Link
                      to={card.cta_url || '/patients-caregivers#patient-safety'}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#121212] hover:text-[#D52B1E] transition-colors group"
                    >
                      <span>{card.cta_text || 'Report a safety concern'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
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
