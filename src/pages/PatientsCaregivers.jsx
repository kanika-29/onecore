import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, ArrowUpRight, ShieldCheck, FileText, AlertCircle, CheckCircle2, UserCheck, Stethoscope, HeartHandshake, Home as HomeIcon } from 'lucide-react';
import SectionEyebrow from '../components/SectionEyebrow';
import ScrollReveal from '../components/ScrollReveal';
import FallbackImage from '../components/FallbackImage';

export default function PatientsCaregivers() {
  const [activeSafetyModal, setActiveSafetyModal] = useState(null);
  const [modalSubmitted, setModalSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Patients & Professionals | Onecore Pharma";
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Information and resources from Onecore Pharma for patients, caregivers and healthcare professionals.");
    }
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
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

  return (
    <div className="w-full">
      {/* =========================================================================
          SECTION 1 — HERO
          ========================================================================= */}
      <section className="pt-32 sm:pt-40 lg:pt-44 pb-20 sm:pb-28 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Supporting Text & Dual CTAs */}
          <div className="lg:col-span-7 space-y-8">
            <ScrollReveal>
              <SectionEyebrow>PATIENTS & PROFESSIONALS</SectionEyebrow>
              <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl xl:text-[4.4rem] font-light text-brand-dark tracking-tight leading-[1.08]">
                For the people receiving care. <br className="hidden sm:inline" />
                <span className="font-normal text-brand-text">And the people providing it.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-3 text-lg sm:text-xl text-brand-muted font-normal max-w-xl leading-relaxed">
                <p>
                  Patients live the experience of a health condition. Healthcare professionals bring the knowledge and judgement needed to manage it.
                </p>
                <p className="text-base sm:text-lg text-brand-muted/90">
                  At Onecore, both perspectives matter. Our role is to support them with dependable products, clear information and responsible communication.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => scrollToSection('for-patients')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-dark text-white text-sm font-semibold tracking-wide rounded-full hover:bg-brand-sage transition-all duration-300 shadow-sm group cursor-pointer"
                >
                  <span>For patients</span>
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('for-professionals')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-surface border border-brand-border text-brand-dark text-sm font-medium rounded-full hover:bg-brand-ivory hover:border-brand-sage/40 transition-all duration-200 cursor-pointer group"
                >
                  <span>For healthcare professionals</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-brand-sage" />
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Hero Healthcare Photograph */}
          <div className="lg:col-span-5">
            <ScrollReveal delay={0.2} direction="left">
              <div className="relative group">
                <div className="overflow-hidden rounded-sm border border-brand-border shadow-sm">
                  <FallbackImage
                    src="/assets/hero-patients-professionals.jpg"
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


      {/* =========================================================================
          SECTION 2 — TWO PERSPECTIVES
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-brand-surface/70 border-y border-brand-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Heading & Body */}
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal>
                <SectionEyebrow>TWO PERSPECTIVES</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight">
                  Different experiences. <br />
                  <span className="font-normal text-brand-text">The same goal.</span>
                </h2>
                <div className="h-[2px] w-14 bg-brand-sage/40 mt-4" />
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="space-y-4 text-brand-muted text-base sm:text-lg leading-relaxed pt-2">
                  <p>
                    Good healthcare depends on understanding both the person living with a condition and the professional responsible for treating it.
                  </p>
                  <p>
                    We want Onecore to stay close to both. That means listening to patient needs, respecting clinical practice and making sure our products and information remain relevant to real healthcare.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: High Quality Natural Healthcare Interaction Image */}
            <div className="lg:col-span-6">
              <ScrollReveal delay={0.15}>
                <div className="relative overflow-hidden rounded-sm border border-brand-border">
                  <FallbackImage
                    src="/assets/two-perspectives.jpg"
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


      {/* =========================================================================
          SECTION 3 — OUR ROLE
          ========================================================================= */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-16">
          {/* Eyebrow & Large Statement */}
          <div className="max-w-4xl space-y-6">
            <ScrollReveal>
              <SectionEyebrow>OUR ROLE</SectionEyebrow>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-brand-dark tracking-tight leading-tight">
                Listen carefully. <br />
                Support responsibly. <br />
                <span className="font-normal text-brand-text">Keep the person behind the medicine in view.</span>
              </h2>
            </ScrollReveal>
          </div>

          {/* Three Distinct Editorial Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 pt-8 border-t border-brand-border">
            {/* Block 01 */}
            <ScrollReveal delay={0.05}>
              <div className="group bg-brand-ivory hover:bg-brand-surface p-8 border border-brand-border rounded-sm h-full flex flex-col justify-between transition-all duration-300">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-brand-dark tracking-tight leading-snug">
                    See the person, not only the condition.
                  </h3>
                  <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                    The experience of living with illness or managing treatment can shape what patients need from healthcare.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
                  <span>Patient lived experience</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-brand-sage" />
                </div>
              </div>
            </ScrollReveal>

            {/* Block 02 */}
            <ScrollReveal delay={0.1}>
              <div className="group bg-brand-ivory hover:bg-brand-surface p-8 border border-brand-border rounded-sm h-full flex flex-col justify-between transition-all duration-300">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-brand-dark tracking-tight leading-snug">
                    Value clinical judgement.
                  </h3>
                  <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                    Healthcare professionals bring scientific knowledge and practical experience to every treatment decision.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
                  <span>Evidence & clinical practice</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-brand-sage" />
                </div>
              </div>
            </ScrollReveal>

            {/* Block 03 */}
            <ScrollReveal delay={0.15}>
              <div className="group bg-brand-ivory hover:bg-brand-surface p-8 border border-brand-border rounded-sm h-full flex flex-col justify-between transition-all duration-300">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-brand-dark tracking-tight leading-snug">
                    Make information easier to access.
                  </h3>
                  <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                    Patients and professionals should be able to find clear factual information about the products they use or prescribe.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
                  <span>Factual product transparency</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-brand-sage" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 4 — FOR PATIENTS AND CAREGIVERS (Major Section)
          ========================================================================= */}
      <section id="for-patients" className="py-24 sm:py-32 bg-brand-surface/60 border-t border-brand-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="max-w-4xl space-y-6">
            <ScrollReveal>
              <SectionEyebrow>FOR PATIENTS AND CAREGIVERS</SectionEyebrow>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight">
                You should be able to understand the medicines that are part of your care.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-3 text-base sm:text-lg text-brand-muted leading-relaxed">
                <p>
                  Clear information helps patients and caregivers take a more informed role in the treatment journey.
                </p>
                <p>
                  Onecore provides factual information about its products and encourages patients to speak with their doctor or pharmacist when they have questions about their individual treatment.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Editorial Content Split: 3 Info Areas + Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left 3 Info Areas */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border-t border-brand-border divide-y divide-brand-border bg-brand-ivory border-b rounded-sm">
                {/* Info 01 */}
                <ScrollReveal delay={0.05}>
                  <div className="p-6 sm:p-8 space-y-3">
                    <h3 className="text-xl font-medium text-brand-dark tracking-tight">
                      FIND INFORMATION ABOUT YOUR MEDICINE
                    </h3>
                    <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                      Access product names, compositions, dosage forms and other factual product information.
                    </p>
                  </div>
                </ScrollReveal>

                {/* Info 02 */}
                <ScrollReveal delay={0.1}>
                  <div className="p-6 sm:p-8 space-y-3">
                    <h3 className="text-xl font-medium text-brand-dark tracking-tight">
                      USE MEDICINES RESPONSIBLY
                    </h3>
                    <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                      Follow the instructions provided by your healthcare professional and the information supplied with your medicine.
                    </p>
                  </div>
                </ScrollReveal>

                {/* Info 03 */}
                <ScrollReveal delay={0.15}>
                  <div className="p-6 sm:p-8 space-y-3">
                    <h3 className="text-xl font-medium text-brand-dark tracking-tight">
                      SHARE SAFETY CONCERNS
                    </h3>
                    <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                      Report a suspected side effect or product quality concern involving a Onecore product.
                    </p>
                  </div>
                </ScrollReveal>
              </div>

              {/* CTAs */}
              <ScrollReveal delay={0.2}>
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    to="/areas-of-care"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-dark text-white text-sm font-semibold rounded-full hover:bg-brand-sage transition-all duration-200 group"
                  >
                    <span>Product information</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    onClick={() => scrollToSection('patient-safety')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-brand-border text-brand-dark text-sm font-medium rounded-full hover:bg-brand-surface transition-all duration-200 cursor-pointer group"
                  >
                    <span>Report a concern</span>
                    <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-brand-sage" />
                  </button>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Healthcare Discussion Image */}
            <div className="lg:col-span-5">
              <ScrollReveal delay={0.2} direction="left">
                <div className="relative rounded-sm overflow-hidden border border-brand-border">
                  <FallbackImage
                    src="/assets/patients-caregivers.jpg"
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


      {/* =========================================================================
          SECTION 5 — FOR HEALTHCARE PROFESSIONALS (Structured Resources, No Medical Enquiries)
          ========================================================================= */}
      <section id="for-professionals" className="py-24 sm:py-32 bg-brand-dark text-white border-y border-brand-border-dark scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal>
                <SectionEyebrow isDark>FOR HEALTHCARE PROFESSIONALS</SectionEyebrow>
                <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight">
                  Supporting clinical practice with clear product information.
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="space-y-3 text-base sm:text-lg text-gray-300 leading-relaxed">
                  <p>
                    Healthcare professionals make treatment decisions by bringing together science, clinical experience and the needs of each individual patient.
                  </p>
                  <p>
                    Our responsibility is to make accurate product information accessible and to maintain clear channels for safety and quality reporting.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-5">
              <ScrollReveal delay={0.15}>
                <div className="overflow-hidden rounded-sm border border-brand-border-dark">
                  <FallbackImage
                    src="/assets/healthcare-professionals.jpg"
                    alt="Medical specialist reviewing clinical product literature and prescribing documentation"
                    aspectRatio="aspect-[16/10] sm:aspect-[4/3]"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Three Large Editorial Resources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-brand-border-dark">
            {/* RESOURCE 01 */}
            <ScrollReveal delay={0.05}>
              <div className="bg-brand-dark-surface p-8 border border-brand-border-dark rounded-sm h-full flex flex-col justify-between space-y-6 group hover:border-brand-sage-light/40 transition-colors">
                <div className="space-y-4">
                  <h3 className="text-2xl font-light text-white tracking-tight">
                    Onecore medicines
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Access compositions, dosage forms and factual information across the Onecore product portfolio.
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border-dark">
                  <Link
                    to="/areas-of-care"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-sage-light group-hover:text-white transition-colors"
                  >
                    <span>View product information</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* RESOURCE 02 */}
            <ScrollReveal delay={0.1}>
              <div className="bg-brand-dark-surface p-8 border border-brand-border-dark rounded-sm h-full flex flex-col justify-between space-y-6 group hover:border-brand-sage-light/40 transition-colors">
                <div className="space-y-4">
                  <h3 className="text-2xl font-light text-white tracking-tight">
                    Professional resources
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Access approved prescribing and product information where available for Onecore medicines.
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border-dark">
                  <button
                    onClick={() => setActiveSafetyModal('prescribing')}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-sage-light group-hover:text-white transition-colors cursor-pointer"
                  >
                    <span>View professional resources</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* RESOURCE 03 */}
            <ScrollReveal delay={0.15}>
              <div className="bg-brand-dark-surface p-8 border border-brand-border-dark rounded-sm h-full flex flex-col justify-between space-y-6 group hover:border-brand-sage-light/40 transition-colors">
                <div className="space-y-4">
                  <h3 className="text-2xl font-light text-white tracking-tight">
                    Safety reporting
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Report suspected adverse reactions or product quality concerns involving Onecore products.
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border-dark">
                  <button
                    onClick={() => scrollToSection('patient-safety')}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-sage-light group-hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Report safety information</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 6 — THE TREATMENT JOURNEY
          ========================================================================= */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-16">
          {/* Header */}
          <div className="max-w-4xl space-y-6">
            <ScrollReveal>
              <SectionEyebrow>THE TREATMENT JOURNEY</SectionEyebrow>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight">
                A prescription begins in the clinic. <br />
                <span className="font-normal text-brand-text">Care continues beyond it.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-3 text-base sm:text-lg text-brand-muted leading-relaxed">
                <p>
                  Healthcare professionals make treatment decisions in the clinical setting. Patients then carry those decisions into everyday life.
                </p>
                <p>
                  We believe a responsible pharmaceutical company should understand both parts of that journey and support them with medicines and information people can depend on.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Visual Journey: Horizontal on Desktop with →, Vertical on Mobile with ↓ */}
          <ScrollReveal delay={0.15}>
            <div className="p-8 sm:p-12 bg-brand-surface border border-brand-border rounded-sm">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                {/* Step 1 */}
                <div className="space-y-3 relative flex flex-col justify-start">
                  <h3 className="text-lg font-medium text-brand-dark">Healthcare professional</h3>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    Clinical assessment, diagnosis and evidence-based therapeutic evaluation.
                  </p>
                  {/* Desktop Right Arrow */}
                  <div className="hidden lg:flex absolute -right-5 top-3 text-brand-sage/70 items-center pointer-events-none">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Mobile Down Arrow 1 */}
                <div className="flex lg:hidden justify-center py-1 text-brand-sage/70">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* Step 2 */}
                <div className="space-y-3 relative flex flex-col justify-start">
                  <h3 className="text-lg font-medium text-brand-dark">Treatment decision</h3>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    Selecting appropriate formulation, dosage schedule and treatment guidance.
                  </p>
                  {/* Desktop Right Arrow */}
                  <div className="hidden lg:flex absolute -right-5 top-3 text-brand-sage/70 items-center pointer-events-none">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Mobile Down Arrow 2 */}
                <div className="flex lg:hidden justify-center py-1 text-brand-sage/70">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* Step 3 */}
                <div className="space-y-3 relative flex flex-col justify-start">
                  <h3 className="text-lg font-medium text-brand-dark">Patient</h3>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    Understanding administration instructions, storage conditions and safety facts.
                  </p>
                  {/* Desktop Right Arrow */}
                  <div className="hidden lg:flex absolute -right-5 top-3 text-brand-sage/70 items-center pointer-events-none">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Mobile Down Arrow 3 */}
                <div className="flex lg:hidden justify-center py-1 text-brand-sage/70">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* Step 4 */}
                <div className="space-y-3 relative flex flex-col justify-start">
                  <h3 className="text-lg font-medium text-brand-dark">Everyday care</h3>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    Managing treatment adherence and monitoring recovery in home routine.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Treatment Journey Split Photography Asset */}
          <ScrollReveal delay={0.2}>
            <div className="overflow-hidden rounded-sm border border-brand-border">
              <FallbackImage
                src="/assets/treatment-journey.jpg"
                alt="Continuous healthcare journey connecting professional clinical care with daily life"
                aspectRatio="aspect-[21/9] sm:aspect-[16/7]"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>


      {/* =========================================================================
          SECTION 7 — PATIENT SAFETY (High-Trust Vigilance Section)
          ========================================================================= */}
      <section id="patient-safety" className="py-24 sm:py-32 bg-brand-surface/70 border-t border-brand-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="max-w-4xl space-y-6">
            <ScrollReveal>
              <SectionEyebrow>PATIENT SAFETY</SectionEyebrow>
              <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark tracking-tight leading-tight">
                Safety information deserves a clear way to reach us.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
                If a patient, caregiver or healthcare professional becomes aware of a suspected side effect or product quality concern involving a Onecore product, that information can be reported for appropriate review.
              </p>
            </ScrollReveal>
          </div>

          {/* Two Large Sections: Patients & Caregivers vs Healthcare Professionals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Box 1: Patients & Caregivers */}
            <ScrollReveal delay={0.05}>
              <div className="bg-brand-ivory p-8 sm:p-10 border border-brand-border rounded-sm h-full flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-brand-sage">
                      PATIENTS AND CAREGIVERS
                    </span>
                  </div>
                  <h3 className="text-2xl font-medium text-brand-dark tracking-tight">
                    Report a concern
                  </h3>
                  <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                    Tell us about a suspected side effect or quality concern involving a Onecore product.
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border">
                  <button
                    onClick={() => setActiveSafetyModal('patient')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-sage transition-all duration-200 cursor-pointer group"
                  >
                    <span>Patient reporting</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Box 2: Healthcare Professionals */}
            <ScrollReveal delay={0.1}>
              <div className="bg-brand-ivory p-8 sm:p-10 border border-brand-border rounded-sm h-full flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-brand-sage">
                      HEALTHCARE PROFESSIONALS
                    </span>
                  </div>
                  <h3 className="text-2xl font-medium text-brand-dark tracking-tight">
                    Report safety information
                  </h3>
                  <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                    Submit suspected adverse event or product quality information for appropriate review.
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border">
                  <button
                    onClick={() => setActiveSafetyModal('professional')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-sage transition-all duration-200 cursor-pointer group"
                  >
                    <span>Professional reporting</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Emergency Guidance Disclaimer */}
          <ScrollReveal delay={0.15}>
            <div className="p-6 bg-brand-surface border border-brand-border/80 rounded-sm text-center max-w-3xl mx-auto">
              <p className="text-xs sm:text-sm text-brand-muted">
                For medical emergencies, patients should seek immediate medical attention from an appropriate healthcare service.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>


      {/* =========================================================================
          SECTION 8 — ONECORE SUPPORT
          ========================================================================= */}
      <section className="py-24 sm:py-32 bg-brand-ivory border-t border-brand-border text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <ScrollReveal>
            <SectionEyebrow className="justify-center">ONECORE SUPPORT</SectionEyebrow>
            <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-brand-dark tracking-tight leading-tight max-w-3xl mx-auto">
              Here for the people who use our medicines and the professionals who care for them.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-lg sm:text-xl text-brand-muted font-normal max-w-2xl mx-auto leading-relaxed">
              Find product information, access professional resources or report a safety or quality concern.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="pt-4 flex justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-dark text-white text-sm font-semibold tracking-wide rounded-full hover:bg-brand-sage transition-all duration-300 shadow-sm group"
              >
                <span>Contact Onecore</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE SAFETY & RESOURCE MODAL
          ========================================================================= */}
      {activeSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm">
          <div className="bg-brand-ivory border border-brand-border max-w-lg w-full p-8 rounded-sm shadow-2xl space-y-6 relative">
            <button
              onClick={() => setActiveSafetyModal(null)}
              className="absolute top-4 right-4 text-brand-muted hover:text-brand-dark text-lg font-mono p-1"
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
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-muted hover:text-brand-dark"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-dark text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-sage transition-colors"
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
