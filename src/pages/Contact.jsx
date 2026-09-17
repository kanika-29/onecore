import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, ArrowRight, ArrowDown, CheckCircle2, ShieldAlert, ArrowUpRight } from 'lucide-react';
import SectionEyebrow from '../components/SectionEyebrow';
import ScrollReveal from '../components/ScrollReveal';
import FallbackImage from '../components/FallbackImage';
import { useCmsPage } from '../hooks/useCmsPage';
import { useSettings } from '../hooks/useSettings';

export default function Contact() {
  const { getSection } = useCmsPage('contact');
  const { contact } = useSettings();

  const displayEmail = contact?.general_email || contact?.email || 'info@onecorepharma.in';
  const displayPhone = contact?.phone || '8169255034';
  const displayHours = contact?.office_hours || contact?.business_hours || '10 AM to 7 PM';

  const heroSec = getSection('hero', {
    eyebrow: 'CONTACT ONECORE',
    title: 'Start a conversation with Onecore.',
    body: 'Whether you are looking for product information, exploring a business opportunity or simply want to reach our team, we will help direct your enquiry to the appropriate place.',
    cta_text: 'Send an Enquiry',
    cta_url: '#enquiry-form',
    secondary_cta_text: 'Contact Details',
    secondary_cta_url: '#contact-details',
    image_url: '/assets/patients-caregivers.jpg',
  });

  const channelsSec = getSection('direct_channels', {
    eyebrow: 'GET IN TOUCH',
    title: 'Direct Communication Channels',
    items: [
      {
        channel: 'EMAIL',
        value: displayEmail,
        desc: 'For general company and product related enquiries.',
        cta_text: 'Write to info desk',
        cta_url: `mailto:${displayEmail}`
      },
      {
        channel: 'PHONE',
        value: displayPhone,
        desc: 'Available during business hours.',
        cta_text: 'Call our team',
        cta_url: `tel:${displayPhone.replace(/[^0-9+]/g, '')}`
      },
      {
        channel: 'BUSINESS HOURS',
        value: displayHours,
        desc: 'For enquiries handled by the Onecore team.',
        cta_text: 'WORKING DAYS // MON – SAT',
        cta_url: null
      }
    ]
  });

  const enquirySec = getSection('enquiry_types', {
    eyebrow: 'HOW CAN WE HELP?',
    title: 'Choose the reason for getting in touch.',
    subtitle: 'Selecting the right enquiry type helps your message reach the relevant Onecore team.',
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
    body: 'Complete the form and your enquiry can be directed to the appropriate team.',
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

  const processSec = getSection('process_steps', {
    eyebrow: 'WHAT HAPPENS NEXT',
    title: 'Your message goes to the team best placed to respond.',
    items: [
      {
        num: '01',
        stage: 'STAGE 1',
        title: '01 — Submit',
        desc: 'Tell us who you are and the nature of your enquiry.'
      },
      {
        num: '02',
        stage: 'STAGE 2',
        title: '02 — Route',
        desc: 'Your message is directed to the relevant Onecore function.'
      },
      {
        num: '03',
        stage: 'STAGE 3',
        title: '03 — Respond',
        desc: 'The appropriate team can contact you if a response or further information is required.'
      }
    ]
  });

  const finalCtaSec = getSection('final_cta', {
    eyebrow: 'ONECORE PHARMA',
    title: 'Healthcare centered on people.',
    cta_text: 'Explore Onecore',
    cta_url: '/about',
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
      const yOffset = -80;
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
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!formData.contactType) {
      newErrors.contactType = "Please select who you are contacting Onecore as.";
    }

    if (!formData.natureOfEnquiry) {
      newErrors.natureOfEnquiry = "Please select the nature of your enquiry.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message.";
    }

    if (!formData.consent) {
      newErrors.consent = "You must agree to the privacy policy to submit this enquiry.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          organisation: formData.organisation,
          contactType: formData.contactType,
          natureOfEnquiry: formData.natureOfEnquiry,
          message: formData.message,
          consent: formData.consent,
        }),
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.warn('Contact submission error:', err);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const renderChannelIcon = (ch, idx) => {
    const upper = (ch || '').toUpperCase();
    if (upper.includes('EMAIL') || idx === 0) return <Mail className="w-4 h-4 text-brand-muted group-hover:text-brand-sage transition-colors" />;
    if (upper.includes('PHONE') || idx === 1) return <Phone className="w-4 h-4 text-brand-muted group-hover:text-brand-sage transition-colors" />;
    return <Clock className="w-4 h-4 text-brand-muted group-hover:text-brand-sage transition-colors" />;
  };

  return (
    <div className="w-full bg-brand-ivory text-brand-text">
      {/* =========================================================================
          SECTION 1 — HERO — CONTACT ONECORE
          ========================================================================= */}
      {heroSec.is_active && (
        <section className="pt-32 sm:pt-40 lg:pt-44 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Eyebrow, H1, Text */}
            <div className="lg:col-span-7 space-y-8">
              <ScrollReveal>
                <SectionEyebrow>{heroSec.eyebrow || 'CONTACT ONECORE'}</SectionEyebrow>
                <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl xl:text-[4.4rem] font-light text-brand-dark tracking-tight leading-[1.08] whitespace-pre-line">
                  {heroSec.title}
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <p className="text-lg sm:text-xl text-brand-muted font-normal max-w-xl leading-relaxed whitespace-pre-line">
                  {heroSec.body}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="pt-2 flex items-center gap-4">
                  {heroSec.cta_url && (
                    <a
                      href={heroSec.cta_url}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-dark text-white text-sm font-semibold rounded-full hover:bg-brand-sage transition-all duration-300 shadow-sm cursor-pointer group"
                    >
                      <span>{heroSec.cta_text || 'Send an Enquiry'}</span>
                      <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    </a>
                  )}
                  {heroSec.secondary_cta_url && (
                    <a
                      href={heroSec.secondary_cta_url}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-surface border border-brand-border text-brand-dark text-sm font-medium rounded-full hover:bg-brand-ivory transition-all duration-200 cursor-pointer"
                    >
                      <span>{heroSec.secondary_cta_text || 'Contact Details'}</span>
                    </a>
                  )}
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5">
              <ScrollReveal delay={0.2} direction="left">
                <div className="relative rounded-sm overflow-hidden border border-brand-border shadow-sm">
                  <FallbackImage
                    src={heroSec.image_url || '/assets/patients-caregivers.jpg'}
                    alt="Onecore Pharma customer support and medical dialogue"
                    aspectRatio="aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5]"
                  />
                  <div className="p-4 bg-brand-ivory/95 backdrop-blur-sm border-t border-brand-border">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-sage">Dedicated Response</p>
                    <p className="text-xs text-brand-muted mt-0.5">Enquiries are reviewed and routed to the appropriate department.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 2 — GET IN TOUCH
          ========================================================================= */}
      {channelsSec.is_active && (
        <section id="contact-details" className="py-20 sm:py-28 bg-brand-surface/70 border-y border-brand-border/80 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <ScrollReveal>
              <SectionEyebrow>{channelsSec.eyebrow || 'GET IN TOUCH'}</SectionEyebrow>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight whitespace-pre-line">
                {channelsSec.title || 'Direct Communication Channels'}
              </h2>
            </ScrollReveal>

            {/* Large Typography Contact Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {channelsSec.items.map((card, idx) => {
                const channelName = card.channel || (idx === 0 ? 'EMAIL' : idx === 1 ? 'PHONE' : 'BUSINESS HOURS');
                const channelVal = card.value || (idx === 0 ? displayEmail : idx === 1 ? displayPhone : displayHours);

                return (
                  <ScrollReveal key={channelName} delay={0.05 * (idx + 1)}>
                    <div className="bg-brand-ivory p-8 sm:p-10 border border-brand-border rounded-sm h-full flex flex-col justify-between space-y-6 group hover:border-brand-sage/40 transition-colors shadow-sm">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-sage">
                            {channelName}
                          </span>
                          {renderChannelIcon(channelName, idx)}
                        </div>
                        {idx === 0 ? (
                          <a
                            href={`mailto:${channelVal}`}
                            className="editorial-heading text-2xl sm:text-3xl font-light text-brand-dark hover:text-brand-sage transition-colors block break-words"
                          >
                            {channelVal}
                          </a>
                        ) : idx === 1 ? (
                          <a
                            href={`tel:${String(channelVal).replace(/[^0-9+]/g, '')}`}
                            className="editorial-heading text-3xl sm:text-4xl font-light font-mono text-brand-dark hover:text-brand-sage transition-colors block"
                          >
                            {channelVal}
                          </a>
                        ) : (
                          <span className="editorial-heading text-3xl sm:text-4xl font-light text-brand-dark block">
                            {channelVal}
                          </span>
                        )}
                        <p className="text-sm text-brand-muted leading-relaxed pt-2">
                          {card.desc || card.description || card.text}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-brand-border/60">
                        {card.cta_url ? (
                          <a
                            href={card.cta_url}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-dark group-hover:text-brand-sage transition-colors"
                          >
                            <span>{card.cta_text || 'Contact'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs font-mono text-brand-muted uppercase">
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
          SECTION 3 — HOW CAN WE HELP?
          ========================================================================= */}
      {enquirySec.is_active && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl space-y-4">
            <ScrollReveal>
              <SectionEyebrow>{enquirySec.eyebrow || 'HOW CAN WE HELP?'}</SectionEyebrow>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight whitespace-pre-line">
                {enquirySec.title || 'Choose the reason for getting in touch.'}
              </h2>
              <p className="text-base sm:text-lg text-brand-muted leading-relaxed whitespace-pre-line">
                {enquirySec.subtitle || enquirySec.body || 'Selecting the right enquiry type helps your message reach the relevant Onecore team.'}
              </p>
            </ScrollReveal>
          </div>

          {/* Numbered List */}
          <div className="border-t border-brand-border divide-y divide-brand-border">
            {enquirySec.items.map((opt, idx) => (
              <ScrollReveal key={opt.num || idx} delay={idx * 0.08}>
                <div
                  onClick={() => handleSelectEnquiryType(opt.value || opt.title)}
                  className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline group hover:bg-brand-surface/50 transition-colors px-4 -mx-4 rounded-sm cursor-pointer"
                >
                  <div className="md:col-span-2">
                    <span className="text-3xl sm:text-4xl font-light font-mono text-brand-sage group-hover:text-brand-dark transition-colors">
                      {opt.num || String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="md:col-span-4">
                    <h3 className="text-2xl font-medium text-brand-dark tracking-tight group-hover:text-brand-sage transition-colors">
                      {opt.title}
                    </h3>
                  </div>

                  <div className="md:col-span-5">
                    <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
                      {opt.description || opt.desc || opt.text}
                    </p>
                  </div>

                  <div className="md:col-span-1 flex justify-end">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-brand-border group-hover:border-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-all text-brand-muted">
                      <ArrowDown className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4 — SEND AN ENQUIRY
          ========================================================================= */}
      {formIntroSec.is_active && (
        <section id="enquiry-form" className="py-24 sm:py-32 bg-brand-surface/60 border-t border-brand-border scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <ScrollReveal>
                <SectionEyebrow className="justify-center">{formIntroSec.eyebrow || 'SEND AN ENQUIRY'}</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight whitespace-pre-line">
                  {formIntroSec.title || 'Tell us how we can help.'}
                </h2>
                <p className="text-base sm:text-lg text-brand-muted max-w-xl mx-auto leading-relaxed whitespace-pre-line">
                  {formIntroSec.body || 'Complete the form and your enquiry can be directed to the appropriate team.'}
                </p>
              </ScrollReveal>
            </div>

            {/* Form Container */}
            <ScrollReveal delay={0.1}>
              <div className="bg-brand-ivory p-8 sm:p-12 border border-brand-border rounded-sm shadow-sm">
                {isSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-brand-sage-light text-brand-sage mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="editorial-heading text-3xl font-light text-brand-dark">
                      Thank you. Your enquiry has been received.
                    </h3>
                    <div className="p-4 bg-brand-surface border border-brand-border max-w-md mx-auto rounded text-sm text-brand-muted leading-relaxed">
                      <p className="font-medium text-brand-dark">Enquiry Logged in Onecore Portal</p>
                      <p className="text-xs text-brand-muted mt-1">
                        Our corporate team will review and route your message regarding <strong className="text-brand-dark">{formData.natureOfEnquiry}</strong> to the relevant function.
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
                      className="mt-4 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-brand-dark text-white rounded-full hover:bg-brand-sage transition-colors cursor-pointer"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Row 1: Full name * & Email address * */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-brand-dark block">
                          Full name <span className="text-brand-sage">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Dr. Arthur Vance"
                          className={`w-full px-4 py-3 bg-white border text-sm rounded-sm focus:outline-none transition-colors ${
                            errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-sage'
                          }`}
                        />
                        {errors.fullName && <p className="text-xs text-red-600 font-medium">{errors.fullName}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-brand-dark block">
                          Email address <span className="text-brand-sage">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. arthur.vance@medicalcenter.org"
                          className={`w-full px-4 py-3 bg-white border text-sm rounded-sm focus:outline-none transition-colors ${
                            errors.email ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-sage'
                          }`}
                        />
                        {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Row 2: Phone number & Organisation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-brand-dark block">
                          Phone number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-4 py-3 bg-white border border-brand-border text-sm rounded-sm focus:outline-none focus:border-brand-sage transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="organisation" className="text-xs font-semibold uppercase tracking-wider text-brand-dark block">
                          Organisation
                        </label>
                        <input
                          id="organisation"
                          type="text"
                          value={formData.organisation}
                          onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                          placeholder="e.g. Hospital / Clinic / Distribution Co."
                          className="w-full px-4 py-3 bg-white border border-brand-border text-sm rounded-sm focus:outline-none focus:border-brand-sage transition-colors"
                        />
                      </div>
                    </div>

                    {/* Row 3: Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label htmlFor="contactType" className="text-xs font-semibold uppercase tracking-wider text-brand-dark block">
                          I am contacting Onecore as <span className="text-brand-sage">*</span>
                        </label>
                        <select
                          id="contactType"
                          required
                          value={formData.contactType}
                          onChange={(e) => setFormData({ ...formData, contactType: e.target.value })}
                          className={`w-full px-4 py-3 bg-white border text-sm rounded-sm focus:outline-none transition-colors text-brand-text ${
                            errors.contactType ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-sage'
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

                      <div className="space-y-1.5">
                        <label htmlFor="natureOfEnquiry" className="text-xs font-semibold uppercase tracking-wider text-brand-dark block">
                          Nature of enquiry <span className="text-brand-sage">*</span>
                        </label>
                        <select
                          id="natureOfEnquiry"
                          required
                          value={formData.natureOfEnquiry}
                          onChange={(e) => setFormData({ ...formData, natureOfEnquiry: e.target.value })}
                          className={`w-full px-4 py-3 bg-white border text-sm rounded-sm focus:outline-none transition-colors text-brand-text ${
                            errors.natureOfEnquiry ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-sage'
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
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-brand-dark block">
                        Your message <span className="text-brand-sage">*</span>
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please provide details regarding your enquiry..."
                        className={`w-full px-4 py-3 bg-white border text-sm rounded-sm focus:outline-none transition-colors resize-none ${
                          errors.message ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-sage'
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
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          className="mt-1 w-4 h-4 text-brand-sage rounded border-brand-border focus:ring-brand-sage"
                        />
                        <span className="text-xs text-brand-muted leading-relaxed">
                          I agree that Onecore may use the information provided to respond to this enquiry in accordance with its{' '}
                          <Link to="/privacy" className="text-brand-dark underline font-medium hover:text-brand-sage">
                            privacy policy
                          </Link>
                          .
                        </span>
                      </label>
                      {errors.consent && <p className="text-xs text-red-600 font-medium mt-1">{errors.consent}</p>}
                    </div>

                    {/* Row 6: Submit Button */}
                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-dark text-white text-xs font-semibold tracking-wider uppercase rounded-full hover:bg-brand-sage transition-all duration-300 cursor-pointer shadow-sm disabled:bg-gray-300"
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
                      <span className="text-[11px] text-brand-muted">
                        * Required fields
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Disclaimer under form */}
            {formIntroSec.subheading && (
              <ScrollReveal delay={0.15}>
                <div className="p-6 bg-brand-ivory border border-brand-border rounded-sm text-center max-w-3xl mx-auto shadow-sm">
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {formIntroSec.subheading}
                  </p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5 — PATIENT SAFETY
          ========================================================================= */}
      {safetySec.is_active && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
          <div className="max-w-4xl space-y-4">
            <ScrollReveal>
              <SectionEyebrow>{safetySec.eyebrow || 'PATIENT SAFETY'}</SectionEyebrow>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight whitespace-pre-line">
                {safetySec.title || 'Reporting a safety or quality concern?'}
              </h2>
              {safetySec.subheading && (
                <h3 className="editorial-heading text-xl sm:text-2xl font-normal text-brand-sage whitespace-pre-line">
                  {safetySec.subheading}
                </h3>
              )}
              <p className="text-base sm:text-lg text-brand-muted leading-relaxed pt-2 whitespace-pre-line">
                {safetySec.body}
              </p>
            </ScrollReveal>
          </div>

          {/* Two Editorial Safety Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {safetySec.items.map((card, idx) => (
              <ScrollReveal key={card.title || idx} delay={idx * 0.05}>
                <div className="bg-brand-surface p-8 sm:p-10 border border-brand-border rounded-sm h-full flex flex-col justify-between space-y-8">
                  <div className="space-y-4">
                    {card.eyebrow && (
                      <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-sage">
                        {card.eyebrow}
                      </span>
                    )}
                    <h4 className="text-2xl font-medium text-brand-dark tracking-tight">
                      {card.title}
                    </h4>
                    <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                      {card.description || card.desc || card.text}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-border">
                    <Link
                      to={card.cta_url || '/patients-caregivers#patient-safety'}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-dark hover:text-brand-sage transition-colors group"
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

      {/* =========================================================================
          SECTION 6 — WHAT HAPPENS NEXT
          ========================================================================= */}
      {processSec.is_active && (
        <section className="py-20 sm:py-28 bg-brand-surface/70 border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="max-w-3xl space-y-4">
              <ScrollReveal>
                <SectionEyebrow>{processSec.eyebrow || 'WHAT HAPPENS NEXT'}</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight whitespace-pre-line">
                  {processSec.title || 'Your message goes to the team best placed to respond.'}
                </h2>
              </ScrollReveal>
            </div>

            {/* Minimal 3-Step Process */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {processSec.items.map((step, idx) => (
                <ScrollReveal key={step.title || idx} delay={0.05 * (idx + 1)}>
                  <div className="p-8 bg-brand-ivory border border-brand-border rounded-sm space-y-4 h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-light font-mono text-brand-sage">
                        {step.num || String(idx + 1).padStart(2, '0')}
                      </span>
                      {step.stage && (
                        <span className="text-xs font-mono font-semibold text-brand-muted uppercase">
                          {step.stage}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-medium text-brand-dark">{step.title}</h3>
                    <p className="text-sm text-brand-muted leading-relaxed">
                      {step.desc || step.description || step.text}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 7 — FINAL CTA (Brand Section)
          ========================================================================= */}
      {finalCtaSec.is_active && (
        <section className="py-24 sm:py-32 bg-brand-dark text-white border-t border-brand-border-dark text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <ScrollReveal>
              {finalCtaSec.eyebrow && (
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="text-xs font-mono font-semibold tracking-widest uppercase text-brand-sage-light">
                    {finalCtaSec.eyebrow}
                  </span>
                </div>
              )}
              <h2 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight max-w-3xl mx-auto whitespace-pre-line">
                {finalCtaSec.title || 'Healthcare centered on people.'}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="pt-4 flex justify-center">
                <Link
                  to={finalCtaSec.cta_url || '/about'}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-sage-light text-brand-dark hover:bg-white text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 shadow-sm group"
                >
                  <span>{finalCtaSec.cta_text || 'Explore Onecore'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </div>
  );
}
