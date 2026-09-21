import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, ArrowRight, ArrowDown, CheckCircle2, ArrowUpRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useCmsPage } from '../hooks/useCmsPage';
import { useSettings } from '../hooks/useSettings';

export default function Contact() {
  const { getSection } = useCmsPage('contact');
  const { contact } = useSettings();

  useEffect(() => {
    document.title = "Contact Onecore | Product Inquiries & Direct Channels";
  }, []);

  const displayEmail = contact?.general_email || contact?.email || 'info@onecorepharma.in';
  const displayPhone = contact?.phone || '8169255034';
  const displayHours = contact?.office_hours || contact?.business_hours || '10 AM - 7 PM';

  const heroSec = getSection('hero', {
    eyebrow: 'CONTACT ONECORE',
    title: 'Contact',
    body: 'Whether you are looking for product information, exploring a business opportunity or simply want to reach our team, we will help direct your enquiry to the appropriate place.',
    cta_text: 'Send an Enquiry',
    cta_url: '#enquiry-form',
    secondary_cta_text: 'Contact Details',
    secondary_cta_url: '#contact-details',
  });

  const channelsSec = getSection('direct_channels', {
    eyebrow: 'GET IN TOUCH',
    title: 'Direct Channels',
    subheading: 'We’d love to hear from you. Whether you’re a healthcare professional interested in our products or a patient seeking more information, reach out to us',
    items: [
      {
        channel: 'EMAIL',
        value: displayEmail,
        desc: 'For general company, medical affairs, and product related enquiries.',
        cta_text: 'Write to info desk',
        cta_url: `mailto:${displayEmail}`
      },
      {
        channel: 'PHONE',
        value: displayPhone,
        desc: 'Available during regular corporate business hours.',
        cta_text: 'Call our team',
        cta_url: `tel:${displayPhone.replace(/[^0-9+]/g, '')}`
      },
      {
        channel: 'BUSINESS HOURS',
        value: displayHours,
        desc: 'Dedicated corporate operations & support hours.',
        cta_text: 'WORKING DAYS // MON – SAT',
        cta_url: null
      }
    ]
  });

  const enquirySec = getSection('enquiry_types', {
    eyebrow: 'HOW CAN WE HELP?',
    title: 'Choose the reason for getting in touch.',
    subtitle: 'Selecting the right enquiry type helps your message reach the relevant Onecore team without delay.',
    items: [
      {
        num: "01",
        title: "Product information",
        description: "For factual information about Onecore products, compositions and available dosage forms.",
        value: "Product information",
      },
      {
        num: "02",
        title: "Business & distribution",
        description: "For distribution, institutional supply and other commercial partnership discussions.",
        value: "Business and distribution",
      },
      {
        num: "03",
        title: "Careers",
        description: "For opportunities to work with Onecore and career related communication.",
        value: "Careers",
      },
      {
        num: "04",
        title: "General enquiries",
        description: "For company related questions that do not fall into another category.",
        value: "General enquiry",
      },
    ]
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
    subheading: 'Use the dedicated safety reporting route.',
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

  const handleSelectEnquiryType = (val) => {
    setFormData((prev) => ({ ...prev, natureOfEnquiry: val }));
    const formElement = document.getElementById('enquiry-form');
    if (formElement) {
      const yOffset = -90;
      const y = formElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
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
    // Simulate static form submission
    setTimeout(() => {
      setIsSubmitting(false);
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
    }, 400);
  };

  const renderChannelIcon = (ch, idx) => {
    const upper = (ch || '').toUpperCase();
    if (upper.includes('EMAIL') || idx === 0) {
      return <Mail className="w-4 h-4 text-[#888888] group-hover:text-[#D52B1E] transition-colors" />;
    }
    if (upper.includes('PHONE') || idx === 1) {
      return <Phone className="w-4 h-4 text-[#888888] group-hover:text-[#D52B1E] transition-colors" />;
    }
    return <Clock className="w-4 h-4 text-[#888888] group-hover:text-[#D52B1E] transition-colors" />;
  };

  return (
    <div className="w-full bg-[#FAF9F6] text-[#121212]">
      
      {/* =========================================================================
          SECTION 1 — EDITORIAL HERO
          Spacious, dignified, human-scale typography (The Lilly Model)
          ========================================================================= */}
      {heroSec.is_active && (
        <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 border-b border-[#E5E3DC] bg-white">
          <div className="max-w-7xl mx-auto space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E] block">
              {heroSec.eyebrow || 'CONTACT ONECORE'}
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-[#121212] tracking-tight leading-[1.05]">
              {heroSec.title || 'Contact'}. <br />
              <span className="italic font-normal text-[#D52B1E]">Direct dialogue, dedicated care.</span>
            </h1>

            <p className="text-lg sm:text-2xl text-[#555555] font-light leading-relaxed font-sans max-w-3xl">
              {heroSec.body || 'Whether you are looking for product information, exploring a business opportunity or simply want to reach our team, we will help direct your enquiry to the appropriate place.'}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={heroSec.cta_url || '#enquiry-form'}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors shadow-xs"
              >
                <span>{heroSec.cta_text || 'Send an Enquiry'}</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
              <a
                href={heroSec.secondary_cta_url || '#contact-details'}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FAF9F6] hover:bg-[#EBE9E1] text-[#121212] text-xs font-semibold rounded-full transition-colors border border-[#E5E3DC]"
              >
                <span>{heroSec.secondary_cta_text || 'Direct Channels'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 2 — GET IN TOUCH / DIRECT CHANNELS
          ========================================================================= */}
      {channelsSec.is_active && (
        <section id="contact-details" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-[#E5E3DC] scroll-mt-24">
          <div className="max-w-7xl mx-auto space-y-16">
            
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E] block">
                {channelsSec.eyebrow || 'GET IN TOUCH'}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#121212] tracking-tight">
                {channelsSec.title || 'Direct Channels'}
              </h2>
              {(channelsSec.subheading || channelsSec.body) && (
                <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed pt-1 font-sans">
                  {channelsSec.subheading || channelsSec.body}
                </p>
              )}
            </div>

            {/* Direct Contact Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              {channelsSec.items.map((card, idx) => {
                const channelName = card.channel || (idx === 0 ? 'EMAIL' : idx === 1 ? 'PHONE' : 'BUSINESS HOURS');
                const channelVal = card.value || (idx === 0 ? displayEmail : idx === 1 ? displayPhone : displayHours);

                return (
                  <ScrollReveal key={channelName} delay={0.08 * (idx + 1)}>
                    <div className="bg-white p-8 sm:p-10 border border-[#E5E3DC] rounded-3xl h-full flex flex-col justify-between space-y-6 group hover:border-[#121212] transition-all duration-300 shadow-xs hover:shadow-md">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#777777]">
                            {channelName}
                          </span>
                          {renderChannelIcon(channelName, idx)}
                        </div>

                        {idx === 0 ? (
                          <a
                            href={`mailto:${channelVal}`}
                            className="text-xl sm:text-2xl font-serif font-medium text-[#121212] group-hover:text-[#D52B1E] transition-colors block break-all tracking-tight leading-snug"
                          >
                            {channelVal}
                          </a>
                        ) : idx === 1 ? (
                          <a
                            href={`tel:${String(channelVal).replace(/[^0-9+]/g, '')}`}
                            className="text-2xl sm:text-3xl font-serif font-medium text-[#121212] group-hover:text-[#D52B1E] transition-colors block whitespace-nowrap tracking-tight"
                          >
                            {channelVal}
                          </a>
                        ) : (
                          <span className="text-2xl sm:text-3xl font-serif font-medium text-[#121212] block whitespace-nowrap tracking-tight">
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
          SECTION 3 — HOW CAN WE HELP? (Numbered Reason Selection)
          ========================================================================= */}
      {enquirySec.is_active && (
        <section className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <ScrollReveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E] block">
                {enquirySec.eyebrow || 'HOW CAN WE HELP?'}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#121212] tracking-tight">
                {enquirySec.title || 'Choose the reason for getting in touch.'}
              </h2>
              <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed font-sans pt-1">
                {enquirySec.subtitle || enquirySec.body || 'Selecting the right enquiry type helps your message reach the relevant Onecore team.'}
              </p>
            </ScrollReveal>
          </div>

          {/* Clean Numbered Editorial Rows */}
          <div className="border-t border-[#E5E3DC] divide-y divide-[#E5E3DC]">
            {enquirySec.items.map((opt, idx) => (
              <ScrollReveal key={opt.num || idx} delay={idx * 0.06}>
                <div
                  onClick={() => handleSelectEnquiryType(opt.value || opt.title)}
                  className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline group hover:bg-white transition-colors px-6 -mx-6 rounded-2xl cursor-pointer"
                >
                  <div className="md:col-span-2">
                    <span className="text-3xl sm:text-4xl font-serif font-light text-[#888888] group-hover:text-[#D52B1E] transition-colors">
                      {opt.num || String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="md:col-span-4">
                    <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#121212] tracking-tight group-hover:text-[#D52B1E] transition-colors">
                      {opt.title}
                    </h3>
                  </div>

                  <div className="md:col-span-5">
                    <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed font-sans">
                      {opt.description || opt.desc || opt.text}
                    </p>
                  </div>

                  <div className="md:col-span-1 flex justify-end">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#E5E3DC] group-hover:border-[#121212] group-hover:bg-[#121212] group-hover:text-white transition-all text-[#888888]">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </section>
      )}

      {/* =========================================================================
          SECTION 4 — SEND AN ENQUIRY (Clean Editorial Form)
          ========================================================================= */}
      {formIntroSec.is_active && (
        <section id="enquiry-form" className="py-20 sm:py-28 bg-white border-t border-[#E5E3DC] scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
            
            {/* Header */}
            <div className="text-center space-y-3">
              <ScrollReveal>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E] block">
                  {formIntroSec.eyebrow || 'SEND AN ENQUIRY'}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#121212] tracking-tight">
                  {formIntroSec.title || 'Tell us how we can help.'}
                </h2>
                <p className="text-base sm:text-lg text-[#555555] max-w-xl mx-auto font-light leading-relaxed font-sans pt-1">
                  {formIntroSec.body || 'Complete the form and your enquiry can be directed to the appropriate team.'}
                </p>
              </ScrollReveal>
            </div>

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
                          className={`w-full px-4 py-3.5 bg-white border text-sm rounded-xl focus:outline-none transition-all ${
                            errors.fullName
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
                          className={`w-full px-4 py-3.5 bg-white border text-sm rounded-xl focus:outline-none transition-all ${
                            errors.email
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
                          className={`w-full px-4 py-3.5 bg-white border text-sm rounded-xl focus:outline-none transition-all text-[#121212] ${
                            errors.contactType
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
                          className={`w-full px-4 py-3.5 bg-white border text-sm rounded-xl focus:outline-none transition-all text-[#121212] ${
                            errors.natureOfEnquiry
                              ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500'
                              : 'border-[#E5E3DC] focus:border-[#D52B1E] focus:ring-1 focus:ring-[#D52B1E]'
                          }`}
                        >
                          <option value="">Select</option>
                          {enquirySec.items.map((opt) => (
                            <option key={opt.value || opt.title} value={opt.value || opt.title}>
                              {opt.title}
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
                        className={`w-full px-4 py-3.5 bg-white border text-sm rounded-xl focus:outline-none transition-all resize-none ${
                          errors.message
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
        <section className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
          <div className="max-w-4xl space-y-3">
            <ScrollReveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E] block">
                {safetySec.eyebrow || 'PATIENT SAFETY'}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#121212] tracking-tight">
                {safetySec.title || 'Reporting a safety or quality concern?'}
              </h2>
              {safetySec.subheading && (
                <h3 className="text-xl sm:text-2xl font-serif italic text-[#D52B1E] pt-1">
                  {safetySec.subheading}
                </h3>
              )}
              <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed pt-1 font-sans">
                {safetySec.body}
              </p>
            </ScrollReveal>
          </div>

          {/* Two Editorial Safety Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {safetySec.items.map((card, idx) => (
              <ScrollReveal key={card.title || idx} delay={idx * 0.08}>
                <div className="bg-white p-8 sm:p-10 border border-[#E5E3DC] rounded-3xl h-full flex flex-col justify-between space-y-8 hover:border-[#121212] transition-all duration-300 shadow-xs hover:shadow-md">
                  <div className="space-y-3">
                    {card.eyebrow && (
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#777777]">
                        {card.eyebrow}
                      </span>
                    )}
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
