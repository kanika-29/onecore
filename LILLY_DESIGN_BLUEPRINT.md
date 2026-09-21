# Onecore Pharma — Design System & Redesign Blueprint
**Directly Modeled on the Eli Lilly Design Language (lilly.com)**

---

## 1. Executive Summary & Design Vision

This document captures the visual philosophy, spatial hierarchy, typography rules, image art direction, and component design models of [Eli Lilly and Company](https://www.lilly.com/) based on direct analysis of the live site and high-fidelity screen captures.

The goal is to elevate Onecore from a standard pharmaceutical catalog to a **world-class, editorial corporate medicine platform** that radiates authority, scientific rigor, human warmth, and clinical trust.

All existing clinical information, 9 therapeutic areas, 60+ formulations, dosing guidelines, safety disclosures, news items, and corporate content will be preserved 100%, re-architected into Lilly's sophisticated editorial layout.

---

## 2. Core Design Pillars (The Lilly Model)

### Pillar 1: Human-First, Dignified Art Direction
* **Subject Matter**: Authentic portraits of real patients, doctors, laboratory researchers, and caregivers in warm, natural light. Focus on emotional connection, dignity, and real-life moments rather than generic stock imagery.
* **Lighting & Tone**: Warm daylight, rich natural skin tones, soft architectural backgrounds with cinematic shallow depth-of-field.
* **Card & Frame Geometry**:
  - Hero: Full-screen cinematic (`16:9` or `100vh`) with dramatic human focal point.
  - Condition / Area Cards: Soft rounded rectangles (`4:3` or `16:10` with `rounded-[28px]` or `rounded-3xl` corners).
  - Testimonial / Story Cards: Large rounded frame (`rounded-[2rem]`) with dark photographic background, quotation marks, and white typography.
* **Overlays**: Subtle dark directional gradient masks (`from-black/80 via-black/30 to-transparent`) ensuring that white headlines placed over photographs achieve WCAG AAA contrast without obscuring the subject's face.

### Pillar 2: High-Stature Editorial Typography
* **Primary Editorial Serif (The Lilly Garamond Voice)**:
  - Used for philosophical statements, condition support titles, and story headlines.
  - Font Choice: **Cormorant Garamond** or **Newsreader** (Google Fonts).
  - Stature: High x-height, refined serifs, tracking `-0.02em` to `-0.03em`.
  - Signature Feature: **Dramatic Italics** for emotional emphasis in sub-clauses:
    - *“A medicine company should do more than just make medicine.”*
    - *“Our job is to put health above all.”*
* **Impact Grotesque Sans (Primary Hero Headline)**:
  - Used for punchy, bold hero declarations:
    - *“A medicine company that puts health above all”*
    - *“Committed to a better tomorrow”*
  - Font Choice: **Plus Jakarta Sans** or **Inter** (Weight 800/900, `tracking-tight`, line-height `1.05 - 1.1`).
* **Clean Body & Navigation Sans**:
  - Used for body paragraphs, clinical copy, table data, and UI controls.
  - Font Choice: **Plus Jakarta Sans** (Weight 400 & 500, line-height `1.65 - 1.75`).
* **Tracked Eyebrows & Meta**:
  - Small uppercase labels above headers: `text-xs font-semibold tracking-[0.2em] uppercase text-stone-500`.

### Pillar 3: Color Architecture & Contrast
* **Canvas**:
  - Primary Canvas: Pure stark white (`#FFFFFF`).
  - Warm Stone Sections: Alternating soft stone (`#F8F9FA` or `#FAF9F6`) for clear section pacing without heavy divider borders.
  - Dark Dramatic Sections: Rich deep graphite/onyx (`#0F1115` to `#16191F`) reserved for manufacturing and QA.
* **Signature Accent — Corporate Crimson**:
  - Primary Red: `#D52B1E` / `#C41230` (Iconic Lilly crimson).
  - Key Uses:
    1. **Pill Action Buttons**: `rounded-full bg-[#D52B1E] text-white hover:bg-[#B52015] px-6 py-3 font-medium inline-flex items-center gap-2`.
    2. **Story Links**: Bold red text with red underline (`text-[#D52B1E] underline font-bold decoration-2 underline-offset-4`).
    3. **Full-Bleed Red Footer**: Vibrant signature crimson footer (`bg-[#D52B1E] text-white`) with white script logo and structured sitemap directory.
* **Neutral Palette**:
  - Headings: `#111827` / `#161616` (Deep Charcoal, softer than pure black).
  - Body Text: `#374151` / `#4B5563` (Highly readable slate gray).
  - Subtle Hairlines: `#E5E7EB` / `#E2E8F0` (Ultra-fine 1px dividers).

### Pillar 4: Floating Pill Navigation & UI Micro-Interactions
* **Dual Floating Pill Navigation**:
  - Left Floating Pill: Brand logo + menu hamburger in a dark translucent container (`bg-[#181818]/90 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg border border-white/10 text-white`).
  - Right Floating Pill: Utility controls (Search 🔍, Region/Language 🌐, Sign In / Portal 👤) in a matching dark rounded pill.
  - Floating Effect: Stays pinned cleanly over heroes and white page sections alike.
* **Pill Action Buttons**:
  - Pill shape (`rounded-full`) with right arrow icon (`→`) that translates `+4px` on hover (`group-hover:translate-x-1`).

---

## 3. Lilly Component Models (Deconstructed from Live Site)

### Component 1: Primary Hero (Human-Centric Impact)
* **Visual**: Full-bleed background photo of a patient or doctor looking forward with dignity.
* **Content Positioning**: Left-aligned bottom/center block:
  - Massive heavy sans headline (56px to 80px): *“Committed to a better tomorrow”*
  - Floating pill navigation anchored at the top.

### Component 2: Editorial Statement & 3-Column Action Grid
* **Brand Accent**: Subtle centered red script logo mark (`Onecore` script emblem).
* **Statement**: Monumental Garamond headline with italicized punchline:
  - *“A medicine company should do more than just make medicine.”*
* **3-Column Feature Cards**:
  1. **Find care / Healthcare Providers**: Custom line icon (`HandHeart`), bold title (24px), concise 2-sentence clinical support copy, red pill CTA (`Get started →`).
  2. **Access pharmacy / Medicines**: Custom line icon (`Rx prescription`), bold title (24px), portfolio delivery copy, red pill CTA (`Get medicine →`).
  3. **Clinical Trials / Standards**: Custom line icon (`Medical Cross`), bold title (24px), research compliance copy, red pill CTA (`View trials →`).

### Component 3: Condition / Area of Care Showcase Carousel
* **Header**:
  - Tracked eyebrow: `CONDITION SUPPORT` / `AREAS OF CARE`
  - Large serif title (48px - 64px): *“Get a better understanding of a condition.”*
  - Centered lead paragraph (max-w-2xl): *“One of the healthiest actions a patient or a loved one can take is getting informed about a condition...”*
* **Interactive Cards**:
  - Large horizontal carousel cards with generous `rounded-[28px]` frames.
  - High-contrast background photography representing each of Onecore's 9 therapeutic divisions:
    1. **CYTOS** — Oncology
    2. **FEMME** — Women’s Health
    3. **NEURIX** — Neurology
    4. **ORTHEON** — Orthopaedics
    5. **VELLIS** — Dermatology
    6. **EYERIX** — Ophthalmology
    7. **OTIRA** — ENT
    8. **PEDIAPLUS** — Paediatrics
    9. **OMNARA** — General Medicine
  - Title in bold white on top of photographic contrast gradient with an elegant `Explore Condition →` underlined link.

### Component 4: Editorial Story Slides & Patient Voice
* **Patient Voice Spotlight**:
  - Large rounded photographic card (`rounded-[2rem]`).
  - Prominent white quotation marks icon: `“`.
  - Quote in stately serif font: *“Advice I can give other people who have it? Find it while it's still early, while they can do something more with it.”*
  - Attribution: Patient Story / Condition context.
* **Editorial Slide Feature (`1 of N`)**:
  - Large visual container, counter `< 1 of 8 >`.
  - Dramatic close-up portrait with natural lighting.
  - Serif headline: *“Our job’s not done once the medicine is made.”*
  - Supporting narrative on patient-centric formulations and dependable delivery.

### Component 5: Corporate Purpose, Impact Metrics & Initiatives
* **Background**: Warm stone canvas (`#FAF9F6`).
* **Statement**: *“Our job is to put health above all.”* with italicized *above all*.
* **Key Metrics Row** (3 columns with thin top divider line):
  - **150+** Formulations in circulation
  - **9** Specialized therapeutic divisions
  - **100%** Qualified manufacturing & QA testing
* **3 Story Cards**:
  - Card 1: Facility photo (`rounded-3xl`) + *"Medicine starts with quality"* + red underline link: **`Examine our process`**.
  - Card 2: Laboratory photo + *"Dependable formulations you can trust"* + red underline link: **`View our standards`**.
  - Card 3: Patient care photo + *"Healthcare focused on real clinical needs"* + red underline link: **`Learn about our approach`**.

### Component 6: Signature Crimson Footer
* **Background**: Full-bleed corporate crimson (`bg-[#D52B1E] text-white`).
* **Identity**: Script logo + `A MEDICINE COMPANY` in crisp uppercase tracked white typography.
* **Sitemap Columns**:
  - **Areas of Care**: Oncology, Women's Health, Neurology, Orthopaedics, Dermatology, Ophthalmology, ENT, Paediatrics, General Medicine.
  - **Care & Support**: Healthcare Professionals, Patients & Caregivers, Adverse Event Reporting, Medical Inquiries.
  - **Quality & Science**: Qualified Manufacturing, Testing Protocols, Research Directions, Packaging Standards.
  - **Company**: About Onecore, Leadership, News & Insights, Careers, Contact.
* **Legal & Regulatory Bar**: CMAT code, copyright, privacy policy, terms of use, and healthcare disclaimers.

---

## 4. Page-by-Page Redesign Plan

| Step | Page / Component | Key Lilly Design Patterns Applied |
| :--- | :--- | :--- |
| **Phase 1** | **Foundations & Global Shell** | • Integrate Google Fonts (`Cormorant Garamond` + `Plus Jakarta Sans`).<br>• Update `tailwind.config.js` and `index.css` with Lilly tokens (`#D52B1E`, stone neutrals, typography scales).<br>• Implement **Dual Floating Pill Navbar** (`Navbar.jsx`).<br>• Implement **Lilly Signature Crimson Footer** (`Footer.jsx`). |
| **Phase 2** | **Home Page (`Home.jsx`)** | • Full-bleed photographic hero with heavy grotesque headline.<br>• Editorial statement block with italic Garamond headline.<br>• 3-column action cards with minimalist line icons & red pill CTAs.<br>• Condition support carousel showcasing all 9 therapeutic divisions with `rounded-3xl` cards.<br>• Patient Voice spotlight card with quotation marks & intimate photo.<br>• Corporate Purpose section with impact metrics and 3 initiative cards with red underline links.<br>• Dark contrast Quality & Manufacturing showcase.<br>• Latest news editorial grid & final pill CTA. |
| **Phase 3** | **Areas of Care & Detail (`AreasOfCare.jsx`, `AreaOfCareDetail.jsx`)** | • Editorial category banners with human patient/provider portraits.<br>• Condition index with quick filter tabs.<br>• Division portfolio grid with large typography, mechanism highlights, and formulation counts.<br>• Direct deep-links to specific product monographs. |
| **Phase 4** | **Product Detail Pages (`FemmeProductDetail`, `Ortheon`, `Neurix`, etc.)** | • Clinical monograph layout: Product hero with clean packaging render and indication badge.<br>• Mechanism of action, dosing guidelines, and safety/precautions tabs.<br>• Side-by-side clinical summary and prescribing information download pill CTA.<br>• Related therapeutic area breadcrumbs. |
| **Phase 5** | **Corporate & Patient Pages (`About`, `Quality`, `PatientsCaregivers`, `News`, `Contact`)** | • **About**: Heritage timeline, leadership statements, and mission in Garamond serif.<br>• **Quality**: Clean facility imagery, QA testing protocols, and compliance standards.<br>• **Patients & Caregivers**: Accessible patient support guides, FAQ accordion, and safety hotlines.<br>• **News**: Editorial press release layout with category pills and high-res photography.<br>• **Contact**: High-contrast inquiry forms, medical affairs directory, and adverse event reporting hotline. |
| **Phase 6** | **Asset Enhancement, Build & Deploy** | • Validate and optimize all photography assets.<br>• Add high-resolution authentic clinical/patient imagery where needed.<br>• Run complete production build (`npm run build`).<br>• Push to `main` to trigger automated GitHub Pages deployment. |

---

## 5. Implementation Standards & Rules

1. **Content Preservation Guarantee**:
   - Every single formulation name, therapeutic division, clinical indication, dosage specification, and corporate paragraph must be preserved without loss.
2. **Accessibility (WCAG AA/AAA)**:
   - High contrast text overlays (minimum 4.5:1 for body, 3:1 for large headlines).
   - Descriptive `alt` attributes on all patient and clinical images.
   - Keyboard accessible navigation and interactive pills.
3. **Responsive Fluidity**:
   - Pixel-perfect rendering across mobile (375px), tablet (768px), desktop (1280px), and ultrawide displays (1536px+).
4. **Performance**:
   - Zero layout shifts (CLS < 0.1), lazy loading for non-hero imagery, optimized SVG iconography.
