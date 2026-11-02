import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import HeroResponsiveImage from '../components/HeroResponsiveImage';
import { useCmsPage } from '../hooks/useCmsPage';
import { assetUrl } from '../utils/assetUrl';
import PageSkeleton from '../components/PageSkeleton';

export default function PatientsCaregivers() {
  const { getSection, loading: cmsLoading, isError: cmsError } = useCmsPage('patients-caregivers');
  const [activeSafetyModal, setActiveSafetyModal] = useState(null);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [safetySubmitting, setSafetySubmitting] = useState(false);
  const [safetyError, setSafetyError] = useState(null);
  const [safetyForm, setSafetyForm] = useState({
    fullName: '',
    email: '',
    productOrBatch: '',
    observation: '',
  });

  useEffect(() => {
    document.title = "Patients & Caregivers | Onecore Pharma";

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
    setSafetySubmitting(true);
    setSafetyError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: safetyForm.fullName,
          email: safetyForm.email,
          productOrBatch: safetyForm.productOrBatch,
          contactType: activeSafetyModal === 'patient' ? 'Patient / Family Caregiver' : 'Healthcare Professional',
          natureOfEnquiry: 'Pharmacovigilance & Quality Observation',
          message: safetyForm.observation,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Unable to submit your observation report. Please try again.');
      }

      setModalSubmitted(true);
      setSafetyForm({
        fullName: '',
        email: '',
        productOrBatch: '',
        observation: '',
      });
    } catch (err) {
      console.error('Safety report error:', err);
      setSafetyError(err.message || 'Connection error. Please try again or notify our medical safety team directly.');
    } finally {
      setSafetySubmitting(false);
    }
  };

  // Section 1: Hero
  const heroSec = getSection('hero', {
    eyebrow: 'PATIENTS & PROFESSIONALS',
    title: 'Patients & Caregivers',
    body: 'Patients live the experience of a health condition. Healthcare professionals bring the knowledge and judgement needed to manage it.\n\nAt Onecore, both perspectives matter. Our role is to support them with dependable products, clear information and responsible communication.',
    cta_text: 'For Patients & Families',
    cta_url: '#for-patients',
    secondary_cta_text: 'For Healthcare Professionals',
    secondary_cta_url: '#for-professionals',
    image_url: '/assets/patients-caregivers.jpg',
  });

  // Section 2: Two Perspectives
  const perspectivesSec = getSection('two_perspectives', {
    eyebrow: 'TWO PERSPECTIVES',
    title: 'Different experiences. The same goal.',
    body: 'Good healthcare depends on understanding both the person living with a condition and the professional responsible for treating it.\n\nWe want Onecore to stay close to both. That means listening to patient needs, respecting clinical practice and making sure our products and information remain relevant to real healthcare.',
    image_url: '/assets/two-perspectives.jpg',
  });

  // Section 3: Our Role
  const roleSec = getSection('our_role', {
    eyebrow: 'OUR ROLE',
    title: 'Listen carefully. Support responsibly. Keep the person behind the medicine in view.',
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
    cta_text: 'Product Information',
    cta_url: '/areas-of-care',
    secondary_cta_text: 'Report a Safety Concern',
    secondary_cta_url: '#patient-safety',
    image_url: '/assets/internet/compassionate-care.jpg',
    items: [
      {
        title: 'Find information about your medicine',
        desc: 'Access product names, active salt compositions, dosage forms and factual patient guidance across specialties.'
      },
      {
        title: 'Use medicines responsibly',
        desc: 'Follow the instructions provided by your healthcare professional and the clinical guide supplied with your medicine.'
      },
      {
        title: 'Share safety concerns',
        desc: 'Report a suspected side effect or product quality observation involving a Onecore product for clinical review.'
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
        title: 'Scientific Compositions & Dosage Forms',
        desc: 'Review product listings, active ingredients, pharmacokinetic profiles, and available delivery formats across therapeutic specialties.'
      },
      {
        title: 'Clinical Safety Reporting',
        desc: 'Submit adverse drug observations, product quality feedback, or pharmacovigilance reports directly to our safety committee.'
      },
      {
        title: 'Medical & Formulation Dialogue',
        desc: 'Connect with our medical affairs and quality assurance teams for technical product monographs, documentation, and clinical inquiries.'
      }
    ]
  });

  // Section 6: Treatment Journey
  const treatmentJourneySec = getSection('treatment_journey', {
    eyebrow: 'TREATMENT JOURNEY',
    title: 'A prescription begins in the clinic. Care continues beyond it.',
    body: 'Healthcare professionals make treatment decisions in the clinical setting. Patients then carry those decisions into everyday life.\n\nWe believe a responsible pharmaceutical company should understand both parts of that journey and support them with medicines and information people can depend on.',
    image_url: '/assets/treatment-journey.jpg',
    items: [
      {
        stage: '01',
        title: 'Healthcare professional',
        desc: 'Clinical assessment, diagnosis and evidence-based therapeutic evaluation.'
      },
      {
        stage: '02',
        title: 'Treatment decision',
        desc: 'Selecting appropriate formulation, dosage schedule and treatment guidance.'
      },
      {
        stage: '03',
        title: 'Patient',
        desc: 'Understanding administration instructions, storage conditions and safety facts.'
      },
      {
        stage: '04',
        title: 'Everyday care',
        desc: 'Managing treatment adherence and monitoring recovery in home routine.'
      }
    ]
  });

  // Section 7: Patient Safety
  const safetySec = getSection('patient_safety', {
    eyebrow: 'PATIENT SAFETY & PHARMACOVIGILANCE',
    title: 'Safety information deserves a clear way to reach us.',
    body: 'If a patient, caregiver or healthcare professional becomes aware of a suspected side effect or product quality concern involving a Onecore product, that information can be reported directly for immediate clinical review.',
    items: [
      {
        eyebrow: 'PATIENTS AND CAREGIVERS',
        title: 'Report a Patient Concern',
        desc: 'Tell us about a suspected side effect, packaging irregularity, or quality observation involving a Onecore product.',
        cta_text: 'Patient Reporting Desk',
        modal_type: 'patient'
      },
      {
        eyebrow: 'HEALTHCARE PROFESSIONALS',
        title: 'Clinical Safety Information',
        desc: 'Submit suspected adverse drug reactions, therapeutic non-responsiveness, or quality observations for regulatory pharmacovigilance evaluation.',
        cta_text: 'Professional Reporting Desk',
        modal_type: 'professional'
      }
    ]
  });

  if (cmsLoading && !cmsError) {
    return <PageSkeleton />;
  }

  return (
    <div className="w-full bg-transparent text-[#121212]">
      
      {/* =========================================================================
          SECTION 1 — HERO BANNER
          Clean, stately, high-contrast human photography with bold typography
          ========================================================================= */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-end pb-16 sm:pb-24 pt-32 px-4 sm:px-8 lg:px-12 bg-black">
        {/* Hero Background Responsive Photograph */}
        <div className="absolute inset-0 z-0">
          <HeroResponsiveImage
            desktopImage={heroSec.image_url}
            mobileImage={heroSec.image_mobile_url || heroSec.mobile_image_url}
            alt="Onecore Pharma — Patients and Caregivers"
            fallback="/assets/patients-caregivers.jpg"
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
              Patients & Caregivers. <br />
              <span className="italic font-normal text-[#D52B1E]">Partners in healthcare.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="text-base sm:text-xl lg:text-2xl text-white/90 font-light leading-relaxed font-sans max-w-3xl">
              {heroSec.body || 'Patients live the experience of a health condition. Healthcare professionals bring the knowledge and judgement needed to manage it. At Onecore, both perspectives matter. Our role is to support them with dependable products, clear information and responsible communication.'}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.14}>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  const targetId = (heroSec.cta_url || '#for-patients').replace(/^#/, '');
                  const el = document.getElementById(targetId);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#D52B1E] hover:bg-[#B52015] text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <span>{heroSec.cta_text || 'For Patients & Families'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetId = (heroSec.secondary_cta_url || '#for-professionals').replace(/^#/, '');
                  const el = document.getElementById(targetId);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-sm font-medium rounded-full transition-all duration-200 cursor-pointer"
              >
                <span>{heroSec.secondary_cta_text || 'For Healthcare Professionals'}</span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — TWO PERSPECTIVES
          Clean two-column editorial narrative
          ========================================================================= */}
      {perspectivesSec.is_active && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal>
                <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-tight">
                  Different experiences. <br />
                  <span className="italic font-normal text-[#D52B1E]">The same goal.</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="space-y-4 text-base sm:text-lg text-[#555555] font-light leading-relaxed font-sans">
                  {perspectivesSec.body.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6">
              <ScrollReveal delay={0.15}>
                <div className="relative rounded-[28px] overflow-hidden border border-[#E5E3DC] shadow-sm aspect-[4/3] bg-white">
                  <img
                    src={assetUrl(perspectivesSec.image_url || '/assets/two-perspectives.jpg')}
                    alt="Clinical consultation and dialogue between Indian doctor and patient"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/two-perspectives.jpg';
                    }}
                  />
                </div>
              </ScrollReveal>
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3 — OUR ROLE (3 Distinct Editorial Pillars)
          ========================================================================= */}
      {roleSec.is_active && (
        <section className="py-12 sm:py-16 bg-transparent border-y border-[#E5E3DC]/80 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
            <div className="max-w-3xl">
              <ScrollReveal>
                <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-tight">
                  Listen carefully. Support responsibly. Keep the person behind the medicine in view.
                </h2>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {roleSec.items.map((block, idx) => (
                <ScrollReveal key={block.title || idx} delay={idx * 0.08}>
                  <div className="bg-white/80 backdrop-blur-xs p-8 sm:p-10 rounded-3xl border border-[#E5E3DC] hover:border-[#121212] transition-all duration-300 h-full flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <span className="text-xs font-mono text-[#D52B1E] font-bold block">
                        0{idx + 1}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-[#121212] tracking-tight">
                        {block.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[#555555] leading-relaxed font-sans">
                        {block.desc || block.description || block.text}
                      </p>
                    </div>
                    {block.footer && (
                      <div className="pt-4 border-t border-[#E5E3DC] text-xs text-[#777777] font-medium">
                        {block.footer}
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
        <section id="for-patients" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10 scroll-mt-24">
          <div className="max-w-3xl space-y-4">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-tight">
                You should be able to understand the medicines that are part of your care.
              </h2>
              <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed font-sans pt-3">
                Clear information helps patients and caregivers take a more informed role in the treatment journey. Onecore provides factual information about its products and encourages patients to speak with their doctor or pharmacist.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Items List */}
            <div className="lg:col-span-7 space-y-4">
              {forPatientsSec.items.map((item, idx) => (
                <ScrollReveal key={item.title || idx} delay={idx * 0.06}>
                  <div className="p-6 sm:p-8 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#E5E3DC] hover:border-[#121212] transition-colors space-y-2">
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-[#121212]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#555555] leading-relaxed font-sans">
                      {item.desc || item.description || item.text}
                    </p>
                  </div>
                </ScrollReveal>
              ))}

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to={forPatientsSec.cta_url || '/areas-of-care'}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#121212] hover:bg-[#D52B1E] text-white text-xs font-semibold rounded-full transition-colors"
                >
                  <span>{forPatientsSec.cta_text || 'Browse Formulations'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => scrollToSection('patient-safety')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-[#FAF9F6] text-[#121212] text-xs font-semibold rounded-full transition-colors border border-[#E5E3DC] cursor-pointer"
                >
                  <span>{forPatientsSec.secondary_cta_text || 'Report a Concern'}</span>
                  <ArrowDown className="w-4 h-4 text-[#D52B1E]" />
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5">
              <ScrollReveal delay={0.15}>
                <div className="rounded-[28px] overflow-hidden border border-[#E5E3DC] shadow-sm aspect-[4/3] bg-white">
                  <img
                    src={assetUrl(forPatientsSec.image_url || '/assets/internet/compassionate-care.jpg')}
                    alt="Compassionate healthcare support for patients and families"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/internet/compassionate-care.jpg';
                    }}
                  />
                </div>
              </ScrollReveal>
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5 — FOR HEALTHCARE PROFESSIONALS (Signature Lilly Dark Onyx)
          ========================================================================= */}
      {forProfessionalsSec.is_active && (
        <section id="for-professionals" className="py-12 sm:py-16 bg-[#121212] text-white scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8 sm:space-y-10">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <ScrollReveal>
                  <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight leading-tight">
                    Supporting clinical practice with clear product information.
                  </h2>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed font-sans max-w-2xl">
                    {forProfessionalsSec.body}
                  </p>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-5">
                <ScrollReveal delay={0.15}>
                  <div className="rounded-[28px] overflow-hidden border border-white/15 aspect-[4/3]">
                    <img
                      src={assetUrl(forProfessionalsSec.image_url || '/assets/healthcare-professionals.jpg')}
                      alt="Doctor reviewing clinical monographs"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/healthcare-professionals.jpg';
                      }}
                    />
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Three Professional Resources */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/15">
              {forProfessionalsSec.items.map((item, idx) => (
                <ScrollReveal key={item.title || idx} delay={idx * 0.06}>
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 transition-colors space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="text-xs font-mono text-[#D52B1E] font-bold block">
                        0{idx + 1}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/70 leading-relaxed font-sans">
                        {item.desc || item.description || item.text}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <Link
                        to={idx === 1 ? '#patient-safety' : '/areas-of-care'}
                        onClick={(e) => {
                          if (idx === 1) {
                            e.preventDefault();
                            scrollToSection('patient-safety');
                          }
                        }}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D52B1E] hover:text-white transition-colors"
                      >
                        <span>{idx === 1 ? 'Report Safety Data' : 'View Formulations'}</span>
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
          SECTION 6 — THE TREATMENT JOURNEY (Hero Banner Design)
          Clean, stately, high-contrast human photography with bold typography
          ========================================================================= */}
      {treatmentJourneySec.is_active && (
        <section className="relative min-h-[90vh] sm:min-h-screen flex items-end pb-16 sm:pb-24 pt-32 px-4 sm:px-8 lg:px-12 bg-black">
          {/* Hero Background Photograph */}
          <div className="absolute inset-0 z-0">
            <img
              src={assetUrl(treatmentJourneySec.image_url || '/assets/treatment-journey.jpg')}
              alt="Doctor-patient consultation in Indian healthcare clinic"
              className="w-full h-full object-cover object-center opacity-85 brightness-90"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/treatment-journey.jpg';
              }}
            />
            {/* Directional contrast gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          </div>

          {/* Hero Content Block */}
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
            <ScrollReveal>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-light text-white tracking-tight leading-[1.04] max-w-4xl">
                A prescription begins in the clinic. <br />
                <span className="italic font-normal text-[#D52B1E]">Care continues beyond it.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <p className="text-base sm:text-xl lg:text-2xl text-white/90 font-light leading-relaxed font-sans max-w-3xl">
                Healthcare professionals make treatment decisions in the clinical setting. Patients then carry those decisions into everyday life. A responsible pharmaceutical company should support both parts of that journey.
              </p>
            </ScrollReveal>

            {/* Treatment journey steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2 sm:pt-4">
              {treatmentJourneySec.items.map((step, idx) => (
                <ScrollReveal key={step.title || idx} delay={0.12 + idx * 0.05}>
                  <div className="p-6 sm:p-7 rounded-3xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 transition-all space-y-3 h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-[#D52B1E] font-bold block">
                        Stage {step.stage || step.num || `0${idx + 1}`}
                      </span>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                        {step.desc || step.description || step.text}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 7 — PATIENT SAFETY & PHARMACOVIGILANCE
          ========================================================================= */}
      {safetySec.is_active && (
        <section id="patient-safety" className="py-12 sm:py-16 bg-transparent border-t border-[#E5E3DC]/80 scroll-mt-24 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            <div className="max-w-3xl">
              <ScrollReveal>
                <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#121212] tracking-tight leading-tight">
                  Safety information deserves a clear way to reach us.
                </h2>
                <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed font-sans pt-3">
                  {safetySec.body}
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {safetySec.items.map((card, idx) => (
                <ScrollReveal key={card.title || idx} delay={idx * 0.08}>
                  <div className="bg-white/80 backdrop-blur-xs p-8 sm:p-12 rounded-[28px] border border-[#E5E3DC] shadow-sm h-full flex flex-col justify-between space-y-8">
                    <div className="space-y-3">
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#121212] tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[#555555] leading-relaxed font-sans">
                        {card.desc || card.description || card.text}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E5E3DC]">
                      <button
                        onClick={() => setActiveSafetyModal(card.modal_type || (idx === 0 ? 'patient' : 'professional'))}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors shadow-xs cursor-pointer"
                      >
                        <span>{card.cta_text || 'Report Concern'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          INTERACTIVE SAFETY & RESOURCE MODAL
          Clean, accessible, transparent reporting dialog
          ========================================================================= */}
      {activeSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E3DC] max-w-lg w-full p-8 rounded-3xl shadow-2xl space-y-6 relative">
            <button
              onClick={() => setActiveSafetyModal(null)}
              className="absolute top-5 right-5 text-[#888888] hover:text-[#121212] p-1.5 cursor-pointer rounded-full hover:bg-[#FAF9F6] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {modalSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#E5E3DC] text-[#00A859] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#121212]">Report Received</h3>
                <p className="text-sm text-[#555555] leading-relaxed max-w-sm mx-auto">
                  Thank you. Your safety and quality report has been securely transmitted to our Pharmacovigilance & Quality Committee for review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D52B1E] block">
                    {activeSafetyModal === 'patient'
                      ? 'PATIENT & CAREGIVER REPORTING'
                      : 'HEALTHCARE PROFESSIONAL SAFETY DESK'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#121212]">
                    Submit Safety or Quality Observation
                  </h3>
                </div>

                {safetyError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                    <span>⚠️</span>
                    <p className="font-medium">{safetyError}</p>
                  </div>
                )}

                <div className="space-y-3 text-sm pt-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={safetyForm.fullName}
                      onChange={(e) => setSafetyForm({ ...safetyForm, fullName: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E3DC] text-sm rounded-xl focus:outline-none focus:border-[#D52B1E] transition-colors text-[#121212]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={safetyForm.email}
                      onChange={(e) => setSafetyForm({ ...safetyForm, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E3DC] text-sm rounded-xl focus:outline-none focus:border-[#D52B1E] transition-colors text-[#121212]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                      Product Name or Batch Number
                    </label>
                    <input
                      type="text"
                      value={safetyForm.productOrBatch}
                      onChange={(e) => setSafetyForm({ ...safetyForm, productOrBatch: e.target.value })}
                      placeholder="e.g. Calmme, Oneflexo, Batch 24B01"
                      className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E3DC] text-sm rounded-xl focus:outline-none focus:border-[#D52B1E] transition-colors text-[#121212]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                      Observation Summary *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={safetyForm.observation}
                      onChange={(e) => setSafetyForm({ ...safetyForm, observation: e.target.value })}
                      placeholder="Please describe the side effect, packaging irregularity, or quality concern in detail..."
                      className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E3DC] text-sm rounded-xl focus:outline-none focus:border-[#D52B1E] transition-colors text-[#121212] resize-none"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSafetyModal(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#777777] hover:text-[#121212] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={safetySubmitting}
                    className="px-6 py-2.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {safetySubmitting ? 'Transmitting...' : 'Submit Report'}
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
