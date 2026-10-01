import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ShieldCheck, Microscope, HeartPulse, Stethoscope, FlaskConical, Activity } from 'lucide-react';
import { assetUrl } from '../utils/assetUrl';

export default function EnlargedSymbolExperience() {
  const containerRef = useRef(null);

  // Track scroll progress through this dedicated interactive section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Silky smooth spring interpolation for natural and reversible scroll response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  // =========================================================================
  // STAGGERED CIRCLE & SLANT MASK REVEALS (0.00 -> 0.22)
  // Individual elements uncover their solid red layers in a coordinated sequence
  // =========================================================================
  const redCircle1Opacity = useTransform(smoothProgress, [0.00, 0.08, 0.16], [1, 1, 0]); // Top-Left (11 o'clock)
  const redCircle2Opacity = useTransform(smoothProgress, [0.02, 0.10, 0.18], [1, 1, 0]); // Top-Right (1 o'clock)
  const redCircle3Opacity = useTransform(smoothProgress, [0.04, 0.12, 0.20], [1, 1, 0]); // Mid-Right (3 o'clock)
  const redCircle4Opacity = useTransform(smoothProgress, [0.06, 0.14, 0.22], [1, 1, 0]); // Bottom-Right (5 o'clock)
  const redCircle5Opacity = useTransform(smoothProgress, [0.08, 0.16, 0.24], [1, 1, 0]); // Mid-Left (9 o'clock)
  const redSlantOpacity   = useTransform(smoothProgress, [0.10, 0.18, 0.26], [1, 1, 0]); // Slant (7 o'clock)

  // =========================================================================
  // 5-STAGE CINEMATIC IMAGE CROSSFADE SEQUENCE (0.00 -> 1.00)
  // Image 1: 0.08 -> 0.28 (Clinical Dialogue & Indian Doctors)
  // Image 2: 0.26 -> 0.46 (Pharmaceutical Chemistry & Lab Science)
  // Image 3: 0.44 -> 0.64 (Quality Testing & cGMP Manufacturing)
  // Image 4: 0.62 -> 0.82 (Specialized Maternal & Paediatric Health)
  // Image 5: 0.80 -> 1.00 (Patient Recovery & Orthopaedic Mobility)
  // =========================================================================

  // Subtle gentle scale-ups inside the lenses (1.00 -> 1.05) to give cinematic depth
  const img1Scale = useTransform(smoothProgress, [0.08, 0.28], [1.00, 1.05]);
  const img2Scale = useTransform(smoothProgress, [0.26, 0.46], [1.00, 1.05]);
  const img3Scale = useTransform(smoothProgress, [0.44, 0.64], [1.00, 1.05]);
  const img4Scale = useTransform(smoothProgress, [0.62, 0.82], [1.00, 1.05]);
  const img5Scale = useTransform(smoothProgress, [0.80, 1.00], [1.00, 1.05]);

  // Silky continuous crossfade opacities
  const img1Opacity = useTransform(smoothProgress, [0.06, 0.14, 0.26, 0.32], [0, 1, 1, 0]);
  const img2Opacity = useTransform(smoothProgress, [0.26, 0.32, 0.44, 0.50], [0, 1, 1, 0]);
  const img3Opacity = useTransform(smoothProgress, [0.44, 0.50, 0.62, 0.68], [0, 1, 1, 0]);
  const img4Opacity = useTransform(smoothProgress, [0.62, 0.68, 0.80, 0.86], [0, 1, 1, 0]);
  const img5Opacity = useTransform(smoothProgress, [0.80, 0.86, 0.98, 1.00], [0, 1, 1, 1]);

  // Overall symbol breathing scale
  const symbolScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.025, 1]);

  // Dynamic step tracker indicators
  const step0Active = useTransform(smoothProgress, (v) => v < 0.12);
  const step1Active = useTransform(smoothProgress, (v) => v >= 0.12 && v < 0.30);
  const step2Active = useTransform(smoothProgress, (v) => v >= 0.30 && v < 0.48);
  const step3Active = useTransform(smoothProgress, (v) => v >= 0.48 && v < 0.66);
  const step4Active = useTransform(smoothProgress, (v) => v >= 0.66 && v < 0.84);
  const step5Active = useTransform(smoothProgress, (v) => v >= 0.84);

  // Editorial narrative card crossfades
  const card0Opacity = useTransform(smoothProgress, [0.00, 0.08, 0.14], [1, 1, 0]);
  const card1Opacity = useTransform(smoothProgress, [0.10, 0.16, 0.26, 0.30], [0, 1, 1, 0]);
  const card2Opacity = useTransform(smoothProgress, [0.28, 0.34, 0.44, 0.48], [0, 1, 1, 0]);
  const card3Opacity = useTransform(smoothProgress, [0.46, 0.52, 0.62, 0.66], [0, 1, 1, 0]);
  const card4Opacity = useTransform(smoothProgress, [0.64, 0.70, 0.80, 0.84], [0, 1, 1, 0]);
  const card5Opacity = useTransform(smoothProgress, [0.82, 0.88, 0.98, 1.00], [0, 1, 1, 1]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0b0d10] text-white border-t border-stone-800"
      style={{ minHeight: '380vh' }}
    >
      {/* Sticky Fullscreen Stage (Locks naturally during section residency) */}
      <div className="sticky top-0 w-full h-screen flex flex-col justify-between overflow-hidden px-4 sm:px-8 lg:px-14 py-6 sm:py-10">
        
        {/* Subtle background ambient radial depth */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-red-600/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,13,16,0.95)_100%)]" />
        </div>

        {/* =========================================================================
            TOP ROW: Section Eyebrow & Scroll Step Indicator
            ========================================================================= */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between gap-4 border-b border-white/10 pb-3 sm:pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D52B1E] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/80 font-semibold">
              The Onecore Symbol Experience
            </span>
          </div>

          {/* Interactive Scroll Step Indicators */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <span className="text-white/40 uppercase mr-1 tracking-wider text-[11px]">Phase:</span>
            {[
              { num: '01', label: 'Clinical', active: step1Active },
              { num: '02', label: 'Formulation', active: step2Active },
              { num: '03', label: 'Quality', active: step3Active },
              { num: '04', label: 'Specialties', active: step4Active },
              { num: '05', label: 'Outcomes', active: step5Active },
            ].map((step, idx) => (
              <div
                key={idx}
                className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-[11px] transition-all duration-300 flex items-center gap-1.5"
              >
                <span className="text-[#D52B1E] font-bold">{step.num}</span>
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            MAIN CENTER STAGE: Enlarged Onecore Symbol + Solid Wordmark
            ========================================================================= */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-16 my-auto py-2">

          {/* LEFT: The Enlarged Symbol (5 Circular Windows + 1 Slant Lens) */}
          <motion.div
            style={{ scale: symbolScale }}
            className="relative w-full max-w-[280px] sm:max-w-[380px] lg:max-w-[450px] aspect-square flex-shrink-0 flex items-center justify-center select-none"
          >
            {/* SVG DEFINITION: Masking & Geometry */}
            <svg
              viewBox="0 0 500 500"
              className="w-full h-full drop-shadow-[0_24px_60px_rgba(213,43,30,0.22)]"
              aria-label="Enlarged Onecore Symbol with Staggered Image Windows"
            >
              <defs>
                {/* Combined Master Clip Path for the Symbol (5 Circles + 1 Slant) */}
                <clipPath id="onecore-symbol-clip">
                  {/* Circle 1: Top-Left (11 o'clock) */}
                  <circle cx="178" cy="125" r="46" />
                  {/* Circle 2: Top-Right (1 o'clock) */}
                  <circle cx="322" cy="125" r="46" />
                  {/* Circle 3: Middle-Right (3 o'clock) */}
                  <circle cx="395" cy="250" r="46" />
                  {/* Circle 4: Bottom-Right (5 o'clock) */}
                  <circle cx="322" cy="375" r="46" />
                  {/* Circle 5: Middle-Left (9 o'clock) */}
                  <circle cx="105" cy="250" r="46" />
                  {/* Element 6: Slant Pill (7 o'clock pointing to center) */}
                  <line
                    x1="145"
                    y1="395"
                    x2="215"
                    y2="275"
                    stroke="white"
                    strokeWidth="92"
                    strokeLinecap="round"
                  />
                </clipPath>
              </defs>

              {/* CLIPPED MULTI-IMAGE CINEMATIC EXPERIENCE */}
              <g clipPath="url(#onecore-symbol-clip)">
                
                {/* Base Charcoal Canvas */}
                <rect width="500" height="500" fill="#14161a" />

                {/* -------------------------------------------------------------
                    IMAGE 1: Healthcare Professionals & Clinical Engagement
                    ------------------------------------------------------------- */}
                <motion.g style={{ opacity: img1Opacity, scale: img1Scale, transformOrigin: 'center' }}>
                  <image
                    href={assetUrl('/assets/healthcare-professionals.jpg')}
                    x="0"
                    y="0"
                    width="500"
                    height="500"
                    preserveAspectRatio="xMidYMid slice"
                  />
                  <rect width="500" height="500" fill="#D52B1E" opacity="0.12" />
                </motion.g>

                {/* -------------------------------------------------------------
                    IMAGE 2: Formulation Science & Laboratory Chemistry
                    ------------------------------------------------------------- */}
                <motion.g style={{ opacity: img2Opacity, scale: img2Scale, transformOrigin: 'center' }}>
                  <image
                    href={assetUrl('/assets/internet/lab-chemistry.jpg')}
                    x="0"
                    y="0"
                    width="500"
                    height="500"
                    preserveAspectRatio="xMidYMid slice"
                  />
                  <rect width="500" height="500" fill="#D52B1E" opacity="0.12" />
                </motion.g>

                {/* -------------------------------------------------------------
                    IMAGE 3: Quality Testing & cGMP Manufacturing Standards
                    ------------------------------------------------------------- */}
                <motion.g style={{ opacity: img3Opacity, scale: img3Scale, transformOrigin: 'center' }}>
                  <image
                    href={assetUrl('/assets/quality.jpg')}
                    x="0"
                    y="0"
                    width="500"
                    height="500"
                    preserveAspectRatio="xMidYMid slice"
                  />
                  <rect width="500" height="500" fill="#D52B1E" opacity="0.12" />
                </motion.g>

                {/* -------------------------------------------------------------
                    IMAGE 4: Specialized Maternal & Paediatric Health
                    ------------------------------------------------------------- */}
                <motion.g style={{ opacity: img4Opacity, scale: img4Scale, transformOrigin: 'center' }}>
                  <image
                    href={assetUrl('/assets/therapeutic-womens-health.jpg')}
                    x="0"
                    y="0"
                    width="500"
                    height="500"
                    preserveAspectRatio="xMidYMid slice"
                  />
                  <rect width="500" height="500" fill="#D52B1E" opacity="0.12" />
                </motion.g>

                {/* -------------------------------------------------------------
                    IMAGE 5: Patient Outcomes & Mobility Care
                    ------------------------------------------------------------- */}
                <motion.g style={{ opacity: img5Opacity, scale: img5Scale, transformOrigin: 'center' }}>
                  <image
                    href={assetUrl('/assets/therapeutic-orthopaedics.jpg')}
                    x="0"
                    y="0"
                    width="500"
                    height="500"
                    preserveAspectRatio="xMidYMid slice"
                  />
                  <rect width="500" height="500" fill="#D52B1E" opacity="0.12" />
                </motion.g>

                {/* -------------------------------------------------------------
                    STAGGERED SOLID RED BRAND COVERS
                    Individual elements peel back successively on scroll
                    ------------------------------------------------------------- */}
                {/* Circle 1: Top-Left */}
                <motion.circle
                  cx="178"
                  cy="125"
                  r="46"
                  fill="#D52B1E"
                  style={{ opacity: redCircle1Opacity }}
                />

                {/* Circle 2: Top-Right */}
                <motion.circle
                  cx="322"
                  cy="125"
                  r="46"
                  fill="#D52B1E"
                  style={{ opacity: redCircle2Opacity }}
                />

                {/* Circle 3: Middle-Right */}
                <motion.circle
                  cx="395"
                  cy="250"
                  r="46"
                  fill="#D52B1E"
                  style={{ opacity: redCircle3Opacity }}
                />

                {/* Circle 4: Bottom-Right */}
                <motion.circle
                  cx="322"
                  cy="375"
                  r="46"
                  fill="#D52B1E"
                  style={{ opacity: redCircle4Opacity }}
                />

                {/* Circle 5: Middle-Left */}
                <motion.circle
                  cx="105"
                  cy="250"
                  r="46"
                  fill="#D52B1E"
                  style={{ opacity: redCircle5Opacity }}
                />

                {/* Element 6: Slant Pill */}
                <motion.line
                  x1="145"
                  y1="395"
                  x2="215"
                  y2="275"
                  stroke="#D52B1E"
                  strokeWidth="92"
                  strokeLinecap="round"
                  style={{ opacity: redSlantOpacity }}
                />
              </g>

              {/* Precision Vector Borders (Maintains crisp brand contours during active imagery) */}
              <g fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2.2" pointerEvents="none">
                <circle cx="178" cy="125" r="46" />
                <circle cx="322" cy="125" r="46" />
                <circle cx="395" cy="250" r="46" />
                <circle cx="322" cy="375" r="46" />
                <circle cx="105" cy="250" r="46" />
                <line x1="145" y1="395" x2="215" y2="275" strokeWidth="92" strokeLinecap="round" stroke="rgba(255,255,255,0.2)" />
              </g>
            </svg>
          </motion.div>

          {/* RIGHT: ONECORE Wordmark & Dynamic Editorial Narrative */}
          <div className="flex-1 max-w-xl space-y-5 text-left">
            
            {/* STABLE, CRISP ONECORE WORDMARK (Untouched, clearly visible, authoritative) */}
            <div className="space-y-1.5 border-b border-white/15 pb-5">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#D52B1E] font-semibold block">
                Brand Identity & Purpose
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl lg:text-7xl font-sans font-black tracking-wider text-[#D52B1E] uppercase select-none">
                  ONECORE
                </span>
                <span className="text-xs font-mono uppercase text-white/50 tracking-widest hidden sm:inline">
                  PHARMA
                </span>
              </div>
            </div>

            {/* DYNAMIC EDITORIAL CARDS (Smoothly Crossfade In-Place With Scroll) */}
            <div className="relative min-h-[150px] sm:min-h-[170px]">
              
              {/* Card 0: Initial State */}
              <motion.div
                style={{ opacity: card0Opacity }}
                className="absolute inset-0 space-y-2.5 pointer-events-auto"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium">
                  <span>The Architectural Mark</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                  Six Elements. One Dedicated Mission.
                </h3>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                  The Onecore symbol represents the interconnected dimensions of modern medicine—formulation research, stringent quality, physician dialogue, and patient wellness.
                </p>
                <p className="text-xs text-stone-400 font-mono pt-1">
                  ↓ Scroll down to reveal the clinical image sequence through the symbol
                </p>
              </motion.div>

              {/* Card 1: Clinical Dialogue (Image 1) */}
              <motion.div
                style={{ opacity: card1Opacity }}
                className="absolute inset-0 space-y-2.5 pointer-events-auto"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-medium">
                  <Stethoscope className="w-3.5 h-3.5 text-red-400" />
                  <span>01 • Clinical Dialogue & Doctor Trust</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                  Partnering with Healthcare Professionals
                </h3>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                  Engaging in continuous clinical dialogue with doctors, consultants, and specialists across India to address real treatment challenges.
                </p>
              </motion.div>

              {/* Card 2: Chemistry & Research (Image 2) */}
              <motion.div
                style={{ opacity: card2Opacity }}
                className="absolute inset-0 space-y-2.5 pointer-events-auto"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-medium">
                  <FlaskConical className="w-3.5 h-3.5 text-red-400" />
                  <span>02 • Formulation Rigor & Lab Science</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                  Precision Formulation Science
                </h3>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                  Disciplined chemical evaluation and pharmaceutical research targeting optimal bioavailability, dosage precision, and stability.
                </p>
              </motion.div>

              {/* Card 3: Quality Standards & Testing (Image 3) */}
              <motion.div
                style={{ opacity: card3Opacity }}
                className="absolute inset-0 space-y-2.5 pointer-events-auto"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-medium">
                  <Microscope className="w-3.5 h-3.5 text-red-400" />
                  <span>03 • cGMP Manufacturing & Batch Release</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                  Disciplined Quality from Start to Finish
                </h3>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                  Every batch undergoes meticulous multi-stage quality review and validation in qualified environments before reaching market release.
                </p>
              </motion.div>

              {/* Card 4: Specialized Care (Image 4) */}
              <motion.div
                style={{ opacity: card4Opacity }}
                className="absolute inset-0 space-y-2.5 pointer-events-auto"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-medium">
                  <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                  <span>04 • Maternal & Paediatric Wellness</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                  Care Tailored to Sensitive Needs
                </h3>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                  Formulations purposefully developed for gynaecological wellness, hormonal balance, and gentle paediatric therapeutic requirements.
                </p>
              </motion.div>

              {/* Card 5: Patient Recovery & Mobility (Image 5) */}
              <motion.div
                style={{ opacity: card5Opacity }}
                className="absolute inset-0 space-y-2.5 pointer-events-auto"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-medium">
                  <Activity className="w-3.5 h-3.5 text-red-400" />
                  <span>05 • Patient Recovery & Mobility</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                  Restoring Strength & Everyday Vitality
                </h3>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                  Targeted orthopaedic and general therapeutics designed to support joint health, mobility, and long-term patient wellbeing.
                </p>
              </motion.div>

            </div>

          </div>

        </div>

        {/* =========================================================================
            BOTTOM ROW: Interactive Scroll Cue & Reversibility Indicator
            ========================================================================= */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between text-xs text-white/50 border-t border-white/10 pt-3 sm:pt-4">
          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs">
            <ShieldCheck className="w-4 h-4 text-[#D52B1E]" />
            <span>Prescription Rigor • Indian Healthcare • Patient Focus</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs">
            <span className="hidden sm:inline">Smooth continuous scroll</span>
            <span className="text-white/30">•</span>
            <span className="text-white/80">Reverse scroll to reset</span>
          </div>
        </div>

      </div>
    </section>
  );
}
