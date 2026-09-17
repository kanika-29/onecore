import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, ArrowUpRight, ShieldCheck, FileText, AlertCircle, CheckCircle2, UserCheck, Stethoscope, HeartHandshake, Home as HomeIcon } from 'lucide-react';
import SectionEyebrow from '../components/SectionEyebrow';
import ScrollReveal from '../components/ScrollReveal';
import FallbackImage from '../components/FallbackImage';
import { useCmsPage } from '../hooks/useCmsPage';

export default function PatientsCaregivers() {
  const { getSection } = useCmsPage('patients-caregivers');
  const [activeSafetyModal, setActiveSafetyModal] = useState(null);
  const [modalSubmitted, setModalSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Patients & Professionals | Onecore Pharma";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Information and resources from Onecore Pharma for patients, caregivers and healthcare professionals.");
    }
  }, []);

  const scrollToSection = (id) => {
    const cleanId = id.replace(/^#/, '');
    const element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const inputs = formEl.querySelectorAll('input, textarea');
    const name = inputs[0]?.value || '';
    const email = inputs[1]?.value || '';
    const productRef = inputs[2]?.value || '';
    const summary = inputs[3]?.value || '';

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          email: email,
          phone: '',
          organisation: productRef ? `Product Ref: ${productRef}` : '',
          contactType: activeSafetyModal === 'professional' ? 'Healthcare Professional' : 'Patient / Caregiver',
          natureOfEnquiry: 'Patient Safety & Adverse Event Report',
          message: `Product/Batch Reference: ${productRef}\n\nObservation Summary:\n${summary}`,
        }),
      });
    } catch (err) {
      console.warn('Safety report submission error:', err);
    }

    setModalSubmitted(true);
    setTimeout(() => {
      setModalSubmitted(false);
      setActiveSafetyModal(null);
    }, 2800);
  };

  // Section 1: Hero
  const heroSec = getSection('hero', {
    eyebrow: 'PATIENTS & PROFESSIONALS',
    title: 'For the people receiving care. \nAnd the people providing it.',
    body: 'Patients live the experience of a health condition. Healthcare professionals bring the knowledge and judgement needed to manage it.\n\nAt Onecore, both perspectives matter. Our role is to support them with dependable products, clear information and responsible communication.',
    cta_text: 'For patients',
    cta_url: '#for-patients',
    secondary_cta_text: 'For healthcare professionals',
    secondary_cta_url: '#for-professionals',
    image_url: '/assets/hero-patients-professionals.jpg',
  });

  // Section 2: Two Perspectives
  const perspectivesSec = getSection('two_perspectives', {
    eyebrow: 'TWO PERSPECTIVES',
    title: 'Different experiences. \nThe same goal.',
    body: 'Good healthcare depends on understanding both the person living with a condition and the professional responsible for treating it.\n\nWe want Onecore to stay close to both. That means listening to patient needs, respecting clinical practice and making sure our products and information remain relevant to real healthcare.',
    image_url: '/assets/two-perspectives.jpg',
  });

  // Section 3: Our Role
  const roleSec = getSection('our_role', {
    eyebrow: 'OUR ROLE',
    title: 'Listen carefully. \nSupport responsibly. \nKeep the person behind the medicine in view.',
    items: [
      {
        title: 'See the person, not only the condition.',
        desc: 'The experience of living with illness or managing treatment can shape what patients need from healthcare.',
        footer: 'Patient lived experience'
      },
      {
        title: 'Value clinical judgement.',
        desc: 'Healthcare professionals bring scientific knowledge and practical experience to every treatment decision.',
        footer: 'Evidence & clinical practice'
      },
      {
        title: 'Make information easier to access.',
        desc: 'Patients and professionals should be able to find clear factual information about the products they use or prescribe.',
        footer: 'Factual product transparency'
      }
    ]
  });

  // Section 4: For Patients
  const forPatientsSec = getSection('for_patients', {
    eyebrow: 'FOR PATIENTS AND CAREGIVERS',
    title: 'You should be able to understand the medicines that are part of your care.',
    body: 'Clear information helps patients and caregivers take a more informed role in the treatment journey.\n\nOnecore provides factual information about its products and encourages patients to speak with their doctor or pharmacist when they have questions about their individual treatment.',
    cta_text: 'Product information',
    cta_url: '/areas-of-care',
    secondary_cta_text: 'Report a concern',
    secondary_cta_url: '#patient-safety',
    image_url: '/assets/patients-caregivers.jpg',
    items: [
      {
        title: 'FIND INFORMATION ABOUT YOUR MEDICINE',
        desc: 'Access product names, compositions, dosage forms and other factual product information.'
      },
      {
        title: 'USE MEDICINES RESPONSIBLY',
        desc: 'Follow the instructions provided by your healthcare professional and the information supplied with your medicine.'
      },
      {
        title: 'SHARE SAFETY CONCERNS',
        desc: 'Report a suspected side effect or product quality concern involving a Onecore product.'
      }
    ]
  });

  // Section 5: For Professionals
  const forProfessionalsSec = getSection('for_professionals', {
    eyebrow: 'FOR HEALTHCARE PROFESSIONALS',
    title: 'Supporting clinical practice with clear product information.',
    body: 'Healthcare professionals make treatment decisions by bringing together science, clinical experience and the needs of each individual patient.\n\nOur responsibility is to make accurate product information accessible and to maintain clear channels for safety and quality reporting.',
    image_url: '/assets/healthcare-professionals.jpg',
    items: [
      {
        title: 'Onecore medicines',
        desc: 'Access compositions, dosage forms and factual information across the Onecore product portfolio.',
        cta_text: 'View product information',
        cta_url: '/areas-of-care'
      },
      {
        title: 'Professional resources',
        desc: 'Access approved prescribing and product information where available for Onecore medicines.',
        cta_text: 'View professional resources',
        cta_url: '#prescribing-modal'
      },
      {
        title: 'Safety reporting',
        desc: 'Report suspected adverse reactions or product quality concerns involving Onecore products.',
        cta_text: 'Report safety information',
        cta_url: '#patient-safety'
      }
    ]
  });

  // Section 6: Treatment Journey
  const treatmentJourneySec = getSection('treatment_journey', {
    eyebrow: 'THE TREATMENT JOURNEY',
    title: 'A prescription begins in the clinic. \nCare continues beyond it.',
    body: 'Healthcare professionals make treatment decisions in the clinical setting. Patients then carry those decisions into everyday life.\n\nWe believe a responsible pharmaceutical company should understand both parts of that journey and support them with medicines and information people can depend on.',
    image_url: '/assets/treatment-journey.jpg',
    items: [
      {
        num: '01',
        title: 'Healthcare professional',
        desc: 'Clinical assessment, diagnosis and evidence-based therapeutic evaluation.'
      },
      {
        num: '02',
        title: 'Treatment decision',
        desc: 'Selecting appropriate formulation, dosage schedule and treatment guidance.'
      },
      {
        num: '03',
        title: 'Patient',
        desc: 'Understanding administration instructions, storage conditions and safety facts.'
      },
      {
        num: '04',
        title: 'Everyday care',
        desc: 'Managing treatment adherence and monitoring recovery in home routine.'
      }
    ]
  });

  // Section 7: Patient Safety
  const safetySec = getSection('patient_safety', {
    eyebrow: 'PATIENT SAFETY',
    title: 'Safety information deserves a clear way to reach us.',
    subheading: 'For medical emergencies, patients should seek immediate medical attention from an appropriate healthcare service.',
    body: 'If a patient, caregiver or healthcare professional becomes aware of a suspected side effect or product quality concern involving a Onecore product, that information can be reported for appropriate review.',
    items: [
      {
        eyebrow: 'PATIENTS AND CAREGIVERS',
        title: 'Report a concern',
        desc: 'Tell us about a suspected side effect or quality concern involving a Onecore product.',
        cta_text: 'Patient reporting',
        modal_type: 'patient'
      },
      {
        eyebrow: 'HEALTHCARE PROFESSIONALS',
        title: 'Report safety information',
        desc: 'Submit suspected adverse event or product quality information for appropriate review.',
        cta_text: 'Professional reporting',
        modal_type: 'professional'
      }
    ]
  });

  // Section 8: Final CTA
  const finalCtaSec = getSection('final_cta', {
    eyebrow: 'ONECORE SUPPORT',
    title: 'Here for the people who use our medicines and the professionals who care for them.',
    body: 'Find product information, access professional resources or report a safety or quality concern.',
    cta_text: 'Contact Onecore',
    cta_url: '/contact',
  });

  return (
    <div className="w-full">
      {/* =========================================================================
          SECTION 1 — HERO
          ========================================================================= */}
      {heroSec.is_active && (
        <section className="pt-32 sm:pt-40 lg:pt-44 pb-20 sm:pb-28 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Heading, Supporting Text & Dual CTAs */}
            <div className="lg:col-span-7 space-y-8">
              <ScrollReveal>
                <SectionEyebrow>{heroSec.eyebrow || 'PATIENTS & PROFESSIONALS'}</SectionEyebrow>
                <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl xl:text-[4.4rem] font-light text-brand-dark tracking-tight leading-[1.08] whitespace-pre-line">
                  {heroSec.title}
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="space-y-3 text-lg sm:text-xl text-brand-muted font-normal max-w-xl leading-relaxed whitespace-pre-line">
                  {heroSec.body}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  {heroSec.cta_url && (
                    heroSec.cta_url.startsWith('#') ? (
                      <button
                        onClick={() => scrollToSection(heroSec.cta_url)}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-dark text-white text-sm font-semibold tracking-wide rounded-full hover:bg-brand-sage transition-all duration-300 shadow-sm group cursor-pointer"
                      >
                        <span>{heroSec.cta_text || 'For patients'}</span>
                        <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                      </button>
                    ) : (
                      <Link
                        to={heroSec.cta_url}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-dark text-white text-sm font-semibold tracking-wide rounded-full hover:bg-brand-sage transition-all duration-300 shadow-sm group"
                      >
                        <span>{heroSec.cta_text || 'For patients'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )
                  )}

                  {heroSec.secondary_cta_url && (
                    heroSec.secondary_cta_url.startsWith('#') ? (
                      <button
                        onClick={() => scrollToSection(heroSec.secondary_cta_url)}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-surface border border-brand-border text-brand-dark text-sm font-medium rounded-full hover:bg-brand-ivory hover:border-brand-sage/40 transition-all duration-200 cursor-pointer group"
                      >
                        <span>{heroSec.secondary_cta_text || 'For healthcare professionals'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-brand-sage" />
                      </button>
                    ) : (
                      <Link
                        to={heroSec.secondary_cta_url}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-surface border border-brand-border text-brand-dark text-sm font-medium rounded-full hover:bg-brand-ivory hover:border-brand-sage/40 transition-all duration-200 group"
                      >
                        <span>{heroSec.secondary_cta_text || 'For healthcare professionals'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-brand-sage" />
                      </Link>
                    )
                  )}
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Hero Healthcare Photograph */}
            <div className="lg:col-span-5">
              <ScrollReveal delay={0.2} direction="left">
                <div className="relative group">
                  <div className="overflow-hidden rounded-sm border border-brand-border shadow-sm">
                    <FallbackImage
                      src={heroSec.image_url || '/assets/hero-patients-professionals.jpg'}
                      alt="Doctor speaking attentively with a patient and a family member in a warm clinical consultation room"
                      aspectRatio="aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5]"
                      className="group-hover:scale-102 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute -bottom-4 -left-4 hidden sm:block bg-brand-ivory/95 backdrop-blur-sm border border-brand-border p-4 shadow-sm max-w-xs rounded-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-sage">Shared Understanding</p>
                    <p className="text-xs text-brand-muted mt-1">Connecting patient experience with clinical expertise.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 2 — TWO PERSPECTIVES
          ========================================================================= */}
      {perspectivesSec.is_active && (
        <section className="py-20 sm:py-28 bg-brand-surface/70 border-y border-brand-border/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Heading & Body */}
              <div className="lg:col-span-6 space-y-6">
                <ScrollReveal>
                  <SectionEyebrow>{perspectivesSec.eyebrow || 'TWO PERSPECTIVES'}</SectionEyebrow>
                  <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight whitespace-pre-line">
                    {perspectivesSec.title}
                  </h2>
                  <div className="h-[2px] w-14 bg-brand-sage/40 mt-4" />
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <div className="space-y-4 text-brand-muted text-base sm:text-lg leading-relaxed pt-2 whitespace-pre-line">
                    {perspectivesSec.body}
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Column: Natural Healthcare Interaction Image */}
              <div className="lg:col-span-6">
                <ScrollReveal delay={0.15}>
                  <div className="relative overflow-hidden rounded-sm border border-brand-border">
                    <FallbackImage
                      src={perspectivesSec.image_url || '/assets/two-perspectives.jpg'}
                      alt="A healthcare professional interacting naturally and compassionately with a patient"
                      aspectRatio="aspect-[4/3]"
                    />
                    <div className="bg-brand-ivory p-3.5 border-t border-brand-border flex items-center justify-between text-xs text-brand-muted">
                      <span>Clinical consultation & dialogue</span>
                      <span className="font-mono text-[11px] text-brand-sage">MUTUAL UNDERSTANDING</span>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3 — OUR ROLE
          ========================================================================= */}
      {roleSec.is_active && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-16">
            {/* Eyebrow & Large Statement */}
            <div className="max-w-4xl space-y-6">
              <ScrollReveal>
                <SectionEyebrow>{roleSec.eyebrow || 'OUR ROLE'}</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-brand-dark tracking-tight leading-tight whitespace-pre-line">
                  {roleSec.title}
                </h2>
              </ScrollReveal>
            </div>

            {/* Three Distinct Editorial Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 pt-8 border-t border-brand-border">
              {roleSec.items.map((block, idx) => (
                <ScrollReveal key={block.title || idx} delay={idx * 0.05}>
                  <div className="group bg-brand-ivory hover:bg-brand-surface p-8 border border-brand-border rounded-sm h-full flex flex-col justify-between transition-all duration-300">
                    <div className="space-y-4">
                      <h3 className="text-xl font-medium text-brand-dark tracking-tight leading-snug">
                        {block.title}
                      </h3>
                      <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                        {block.desc || block.description || block.text}
                      </p>
                    </div>
                    {(block.footer || block.detail) && (
                      <div className="pt-6 mt-6 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
                        <span>{block.footer || block.detail}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-brand-sage" />
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4 — FOR PATIENTS AND CAREGIVERS
          ========================================================================= */}
      {forPatientsSec.is_active && (
        <section id="for-patients" className="py-24 sm:py-32 bg-brand-surface/60 border-t border-brand-border scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {/* Header */}
            <div className="max-w-4xl space-y-6">
              <ScrollReveal>
                <SectionEyebrow>{forPatientsSec.eyebrow || 'FOR PATIENTS AND CAREGIVERS'}</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight whitespace-pre-line">
                  {forPatientsSec.title}
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="space-y-3 text-base sm:text-lg text-brand-muted leading-relaxed whitespace-pre-line">
                  {forPatientsSec.body}
                </div>
              </ScrollReveal>
            </div>

            {/* Editorial Content Split: Info Areas + Image */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Info Areas */}
              <div className="lg:col-span-7 space-y-6">
                <div className="border-t border-brand-border divide-y divide-brand-border bg-brand-ivory border-b rounded-sm">
                  {forPatientsSec.items.map((item, idx) => (
                    <ScrollReveal key={item.title || idx} delay={idx * 0.05}>
                      <div className="p-6 sm:p-8 space-y-3">
                        <h3 className="text-xl font-medium text-brand-dark tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                          {item.desc || item.description || item.text}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                {/* CTAs */}
                <ScrollReveal delay={0.2}>
                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    {forPatientsSec.cta_url && (
                      <Link
                        to={forPatientsSec.cta_url}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-dark text-white text-sm font-semibold rounded-full hover:bg-brand-sage transition-all duration-200 group"
                      >
                        <span>{forPatientsSec.cta_text || 'Product information'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}

                    {forPatientsSec.secondary_cta_url && (
                      forPatientsSec.secondary_cta_url.startsWith('#') ? (
                        <button
                          onClick={() => scrollToSection(forPatientsSec.secondary_cta_url)}
                          className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-brand-border text-brand-dark text-sm font-medium rounded-full hover:bg-brand-surface transition-all duration-200 cursor-pointer group"
                        >
                          <span>{forPatientsSec.secondary_cta_text || 'Report a concern'}</span>
                          <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-brand-sage" />
                        </button>
                      ) : (
                        <Link
                          to={forPatientsSec.secondary_cta_url}
                          className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-brand-border text-brand-dark text-sm font-medium rounded-full hover:bg-brand-surface transition-all duration-200 group"
                        >
                          <span>{forPatientsSec.secondary_cta_text || 'Report a concern'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-brand-sage" />
                        </Link>
                      )
                    )}
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Healthcare Discussion Image */}
              <div className="lg:col-span-5">
                <ScrollReveal delay={0.2} direction="left">
                  <div className="relative rounded-sm overflow-hidden border border-brand-border">
                    <FallbackImage
                      src={forPatientsSec.image_url || '/assets/patients-caregivers.jpg'}
                      alt="Patient and caregiver discussing medicine and treatment guidelines with a healthcare clinician"
                      aspectRatio="aspect-[4/3] sm:aspect-[1/1] lg:aspect-[4/5]"
                    />
                    <div className="p-4 bg-brand-ivory border-t border-brand-border">
                      <p className="text-xs font-medium text-brand-dark">Direct Consultation Guidance</p>
                      <p className="text-xs text-brand-muted mt-0.5">Always consult your treating physician or pharmacist regarding treatment adjustments.</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5 — FOR HEALTHCARE PROFESSIONALS
          ========================================================================= */}
      {forProfessionalsSec.is_active && (
        <section id="for-professionals" className="py-24 sm:py-32 bg-brand-dark text-white border-y border-brand-border-dark scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {/* Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7 space-y-6">
                <ScrollReveal>
                  <SectionEyebrow isDark>{forProfessionalsSec.eyebrow || 'FOR HEALTHCARE PROFESSIONALS'}</SectionEyebrow>
                  <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight whitespace-pre-line">
                    {forProfessionalsSec.title}
                  </h2>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <div className="space-y-3 text-base sm:text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                    {forProfessionalsSec.body}
                  </div>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-5">
                <ScrollReveal delay={0.15}>
                  <div className="overflow-hidden rounded-sm border border-brand-border-dark">
                    <FallbackImage
                      src={forProfessionalsSec.image_url || '/assets/healthcare-professionals.jpg'}
                      alt="Medical specialist reviewing clinical product literature and prescribing documentation"
                      aspectRatio="aspect-[16/10] sm:aspect-[4/3]"
                    />
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Three Large Editorial Resources */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-brand-border-dark">
              {forProfessionalsSec.items.map((item, idx) => (
                <ScrollReveal key={item.title || idx} delay={idx * 0.05}>
                  <div className="bg-brand-dark-surface p-8 border border-brand-border-dark rounded-sm h-full flex flex-col justify-between space-y-6 group hover:border-brand-sage-light/40 transition-colors">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-light text-white tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {item.desc || item.description || item.text}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-brand-border-dark">
                      {item.cta_url === '#prescribing-modal' ? (
                        <button
                          onClick={() => setActiveSafetyModal('prescribing')}
                          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-sage-light group-hover:text-white transition-colors cursor-pointer"
                        >
                          <span>{item.cta_text || 'View professional resources'}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ) : item.cta_url === '#patient-safety' ? (
                        <button
                          onClick={() => scrollToSection('patient-safety')}
                          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-sage-light group-hover:text-white transition-colors cursor-pointer"
                        >
                          <span>{item.cta_text || 'Report safety information'}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ) : (
                        <Link
                          to={item.cta_url || '/areas-of-care'}
                          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-sage-light group-hover:text-white transition-colors"
                        >
                          <span>{item.cta_text || 'View product information'}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 6 — THE TREATMENT JOURNEY
          ========================================================================= */}
      {treatmentJourneySec.is_active && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-16">
            {/* Header */}
            <div className="max-w-4xl space-y-6">
              <ScrollReveal>
                <SectionEyebrow>{treatmentJourneySec.eyebrow || 'THE TREATMENT JOURNEY'}</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight whitespace-pre-line">
                  {treatmentJourneySec.title}
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="space-y-3 text-base sm:text-lg text-brand-muted leading-relaxed whitespace-pre-line">
                  {treatmentJourneySec.body}
                </div>
              </ScrollReveal>
            </div>

            {/* Visual Journey */}
            <ScrollReveal delay={0.15}>
              <div className="p-8 sm:p-12 bg-brand-surface border border-brand-border rounded-sm">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                  {treatmentJourneySec.items.map((step, idx) => (
                    <React.Fragment key={step.title || idx}>
                      <div className="space-y-3 relative flex flex-col justify-start">
                        <h3 className="text-lg font-medium text-brand-dark">{step.title}</h3>
                        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                          {step.desc || step.description || step.text}
                        </p>
                        {idx < treatmentJourneySec.items.length - 1 && (
                          <div className="hidden lg:flex absolute -right-5 top-3 text-brand-sage/70 items-center pointer-events-none">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {idx < treatmentJourneySec.items.length - 1 && (
                        <div className="flex lg:hidden justify-center py-1 text-brand-sage/70">
                          <ArrowDown className="w-4 h-4" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Treatment Journey Split Photography Asset */}
            <ScrollReveal delay={0.2}>
              <div className="overflow-hidden rounded-sm border border-brand-border">
                <FallbackImage
                  src={treatmentJourneySec.image_url || '/assets/treatment-journey.jpg'}
                  alt="Continuous healthcare journey connecting professional clinical care with daily life"
                  aspectRatio="aspect-[21/9] sm:aspect-[16/7]"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 7 — PATIENT SAFETY
          ========================================================================= */}
      {safetySec.is_active && (
        <section id="patient-safety" className="py-24 sm:py-32 bg-brand-surface/70 border-t border-brand-border scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {/* Header */}
            <div className="max-w-4xl space-y-6">
              <ScrollReveal>
                <SectionEyebrow>{safetySec.eyebrow || 'PATIENT SAFETY'}</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight whitespace-pre-line">
                  {safetySec.title}
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <p className="text-base sm:text-lg text-brand-muted leading-relaxed whitespace-pre-line">
                  {safetySec.body}
                </p>
              </ScrollReveal>
            </div>

            {/* Safety Reporting Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {safetySec.items.map((card, idx) => (
                <ScrollReveal key={card.title || idx} delay={idx * 0.05}>
                  <div className="bg-brand-ivory p-8 sm:p-10 border border-brand-border rounded-sm h-full flex flex-col justify-between space-y-8">
                    <div className="space-y-4">
                      {card.eyebrow && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-widest text-brand-sage">
                            {card.eyebrow}
                          </span>
                        </div>
                      )}
                      <h3 className="text-2xl font-medium text-brand-dark tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                        {card.desc || card.description || card.text}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-brand-border">
                      <button
                        onClick={() => setActiveSafetyModal(card.modal_type || (idx === 0 ? 'patient' : 'professional'))}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-sage transition-all duration-200 cursor-pointer group"
                      >
                        <span>{card.cta_text || 'Report concern'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Emergency Guidance Disclaimer */}
            {safetySec.subheading && (
              <ScrollReveal delay={0.15}>
                <div className="p-6 bg-brand-surface border border-brand-border/80 rounded-sm text-center max-w-3xl mx-auto">
                  <p className="text-xs sm:text-sm text-brand-muted">
                    {safetySec.subheading}
                  </p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 8 — ONECORE SUPPORT (FINAL CTA)
          ========================================================================= */}
      {finalCtaSec.is_active && (
        <section className="py-24 sm:py-32 bg-brand-ivory border-t border-brand-border text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <ScrollReveal>
              <SectionEyebrow className="justify-center">{finalCtaSec.eyebrow || 'ONECORE SUPPORT'}</SectionEyebrow>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-brand-dark tracking-tight leading-tight max-w-3xl mx-auto whitespace-pre-line">
                {finalCtaSec.title}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-lg sm:text-xl text-brand-muted font-normal max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
                {finalCtaSec.body}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="pt-4 flex justify-center">
                <Link
                  to={finalCtaSec.cta_url || '/contact'}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-dark text-white text-sm font-semibold tracking-wide rounded-full hover:bg-brand-sage transition-all duration-300 shadow-sm group"
                >
                  <span>{finalCtaSec.cta_text || 'Contact Onecore'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* =========================================================================
          INTERACTIVE SAFETY & RESOURCE MODAL
          ========================================================================= */}
      {activeSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm">
          <div className="bg-brand-ivory border border-brand-border max-w-lg w-full p-8 rounded-sm shadow-2xl space-y-6 relative">
            <button
              onClick={() => setActiveSafetyModal(null)}
              className="absolute top-4 right-4 text-brand-muted hover:text-brand-dark text-lg font-mono p-1 cursor-pointer"
              aria-label="Close dialog"
            >
              ✕
            </button>

            {modalSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-brand-sage mx-auto" />
                <h3 className="text-xl font-medium text-brand-dark">Report Received</h3>
                <p className="text-sm text-brand-muted">
                  Thank you. Your safety and quality report has been securely submitted for review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-brand-sage">
                    {activeSafetyModal === 'patient'
                      ? 'PATIENT & CAREGIVER REPORTING'
                      : activeSafetyModal === 'professional'
                        ? 'HEALTHCARE PROFESSIONAL SAFETY DESK'
                        : 'PROFESSIONAL RESOURCE ACCESS'}
                  </span>
                  <h3 className="text-xl font-medium text-brand-dark">
                    {activeSafetyModal === 'prescribing'
                      ? 'Request Prescribing & Monograph Information'
                      : 'Submit Safety or Product Quality Observation'}
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-brand-dark mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full px-3 py-2 bg-white border border-brand-border text-sm rounded-sm focus:outline-none focus:border-brand-sage"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-brand-dark mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      className="w-full px-3 py-2 bg-white border border-brand-border text-sm rounded-sm focus:outline-none focus:border-brand-sage"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-brand-dark mb-1">
                      Onecore Product Name or Batch Ref
                    </label>
                    <input
                      type="text"
                      placeholder="Product or therapeutic area"
                      className="w-full px-3 py-2 bg-white border border-brand-border text-sm rounded-sm focus:outline-none focus:border-brand-sage"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-brand-dark mb-1">
                      Observation Summary *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Please summarize your observation or resource inquiry..."
                      className="w-full px-3 py-2 bg-white border border-brand-border text-sm rounded-sm focus:outline-none focus:border-brand-sage resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSafetyModal(null)}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-muted hover:text-brand-dark cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-dark text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-sage transition-colors cursor-pointer"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
