export const entProducts = [
  {
    slug: "flutiriv",
    name: "Flutiriv",
    composition: "Fluticasone furoate 27.5 mcg nasal spray",
    description: "An intranasal corticosteroid for allergic/inflammatory nasal symptoms.",
    mechanism: "Activates glucocorticoid receptors and suppresses multiple inflammatory mediators, reducing nasal congestion, sneezing, itching and rhinorrhoea.",
    usedFor: "Used for allergic rhinitis and related inflammatory nasal symptoms; benefit is greatest with regular use rather than occasional rescue use.",
    direction: "For allergic rhinitis: age 12+ years, 2 sprays in each nostril once daily initially, reducing to 1 spray/nostril once controlled. Age 6–11 years, start 1 spray/nostril once daily; may increase to 2 sprays/nostril if needed. Prime and aim away from the septum. Use as prescribed by the doctor.",
    precautions: [
      "Nosebleeds and irritation are common.",
      "Monitor growth with prolonged paediatric use and consider systemic steroid effects with high exposure or strong CYP3A4 inhibitors."
    ],
    image: "/assets/therapeutic-ent.jpg"
  },
  {
    slug: "deftos",
    name: "Deftos",
    composition: "Deflazacort 6 mg tablets",
    description: "A systemic glucocorticoid with anti-inflammatory and immunosuppressive effects.",
    mechanism: "Activates intracellular glucocorticoid receptors, altering gene transcription to suppress inflammatory cytokines and immune-cell activity.",
    usedFor: "Used for selected inflammatory, allergic and autoimmune conditions; systemic steroids are not appropriate for routine uncomplicated viral infections.",
    direction: "For short inflammatory/allergic courses, 6–18 mg once daily after breakfast is a common low-to-moderate adult range, but the exact dose depends on diagnosis. Courses longer than about 1–2 weeks generally require tapering rather than abrupt stopping. Use as prescribed by the doctor.",
    precautions: [
      "Can raise glucose and blood pressure, increase infection risk, affect mood/sleep and cause gastric/bone/adrenal effects.",
      "Screen for infection and avoid abrupt cessation after prolonged use."
    ],
    image: "/assets/therapeutic-ent.jpg"
  },
  {
    slug: "flutiriv-ns",
    name: "Flutiriv NS",
    composition: "Sodium chloride solution BP nasal spray",
    description: "A non-medicated saline nasal spray used for nasal hygiene and hydration.",
    mechanism: "Saline thins mucus, reduces crusting and mechanically washes allergens/irritants from the nasal cavity.",
    usedFor: "Used for colds, dry nasal passages, allergic rhinitis and to improve tolerance of other intranasal therapies.",
    direction: "Use 1–2 sprays in each nostril 2–4 times daily or as needed for dryness/congestion. Blow the nose gently first; clean the nozzle after use. It can be used before a medicated nasal spray. Use as prescribed by the doctor.",
    precautions: [
      "Usually very safe; use a clean nozzle and do not share bottles.",
      "Persistent unilateral blockage, bleeding or pain requires assessment."
    ],
    image: "/assets/therapeutic-ent.jpg"
  },
  {
    slug: "onerest",
    name: "Onerest",
    composition: "Camphor 25 mg + chlorothymol 5 mg + eucalyptol 125 mg + menthol 66 mg + terpineol 120 mg vapour capsules",
    description: "An inhalant vapour capsule for temporary relief of nasal congestion and cold-related upper-airway discomfort. It is not swallowed.",
    mechanism: "Volatile menthol, camphor, eucalyptol and terpineol stimulate nasal sensory receptors and create a cooling/decongestant sensation; vapour inhalation also helps loosen secretions.",
    usedFor: "Used for short-term symptomatic relief of blocked nose, common-cold congestion and rhinitis.",
    direction: "Snip open 1 capsule and squeeze the liquid into about 0.5 L hot water; inhale vapour gently for 5–10 minutes. Alternatively put the liquid on a tissue/handkerchief or pillow. Use up to 3 times daily. Do not swallow the capsule. Use as prescribed by the doctor.",
    precautions: [
      "For inhalation only—do not swallow or apply inside the nostrils.",
      "Avoid steam burns and keep away from flame.",
      "Use cautiously in young children and people sensitive to strong vapours."
    ],
    image: "/assets/therapeutic-ent.jpg"
  },
  {
    slug: "mentira-625-1000",
    name: "Mentira 625/1000",
    composition: "Amoxicillin + clavulanic acid tablet",
    description: "A broad-spectrum beta-lactam antibiotic plus a beta-lactamase inhibitor.",
    mechanism: "Amoxicillin blocks bacterial cell-wall synthesis. Clavulanate inhibits many beta-lactamases, protecting amoxicillin from enzymatic inactivation.",
    usedFor: "Used for susceptible bacterial respiratory, ENT, dental, skin and other infections; not for viral colds/flu.",
    direction: "Take at the start of a meal. Typical adult use is 625 mg every 8 hours or a 1,000 mg-strength formulation every 12 hours for about 5–7 days, depending on infection and renal function. Complete the prescribed course. Use as prescribed by the doctor.",
    precautions: [
      "Avoid with serious penicillin allergy.",
      "Watch for rash, diarrhoea and rare liver injury.",
      "Severe or persistent diarrhoea may indicate C. difficile infection."
    ],
    image: "/assets/therapeutic-ent.jpg"
  },
  {
    slug: "flutiriv-az",
    name: "Flutiriv AZ",
    composition: "Azelastine + fluticasone",
    description: "A combination intranasal antihistamine plus corticosteroid for allergic rhinitis.",
    mechanism: "Azelastine blocks histamine H1 receptors for rapid symptom relief; fluticasone reduces local inflammatory gene signalling and nasal mucosal inflammation.",
    usedFor: "Used for moderate-to-severe allergic rhinitis when one intranasal agent is insufficient.",
    direction: "Use 1 spray in each nostril twice daily (morning and evening). Blow the nose first, shake/prime the spray, and aim slightly outward away from the septum. Once symptoms are controlled, step down only if the prescriber recommends it. Use as prescribed by the doctor.",
    precautions: [
      "May cause bitter taste, nosebleeds and local irritation.",
      "Use caution after nasal surgery/injury and with prolonged high-dose steroid exposure."
    ],
    image: "/assets/therapeutic-ent.jpg"
  },
  {
    slug: "bilariv-m",
    name: "Bilariv-M",
    composition: "Bilastine 20 mg + montelukast 10 mg tablets",
    description: "An oral antihistamine plus leukotriene-receptor antagonist combination.",
    mechanism: "Bilastine blocks peripheral H1 receptors; montelukast blocks cysteinyl-leukotriene CysLT1 receptors, reducing allergic inflammation and bronchoconstrictive signalling.",
    usedFor: "Used for allergic rhinitis/urticarial symptoms when combination therapy is clinically justified; montelukast should not be routine first-line therapy for mild allergic rhinitis because of neuropsychiatric risk.",
    direction: "Take 1 tablet once daily on an empty stomach—at least 1 hour before or 2 hours after food/fruit juice. Evening dosing is convenient when night symptoms are prominent. Reassess the need for montelukast if used only for mild rhinitis. Use as prescribed by the doctor.",
    precautions: [
      "Counsel about mood, sleep or behavioural changes associated with montelukast.",
      "Bilastine is usually non-sedating but caution is still sensible when first used."
    ],
    image: "/assets/therapeutic-ent.jpg"
  },
  {
    slug: "bilariv",
    name: "Bilariv",
    composition: "Bilastine 20 mg tablets",
    description: "A second-generation, relatively non-sedating H1 antihistamine.",
    mechanism: "Selectively blocks peripheral histamine H1 receptors, reducing itching, sneezing, rhinorrhoea and wheal/flare responses.",
    usedFor: "Used for allergic rhinitis and urticaria.",
    direction: "Take 20 mg once daily on an empty stomach, at least 1 hour before or 2 hours after food or fruit juice. Use as prescribed by the doctor.",
    precautions: [
      "Usually well tolerated; headache or drowsiness can occur.",
      "Dose selection may require review with strong P-gp inhibitors or renal impairment."
    ],
    image: "/assets/therapeutic-ent.jpg"
  },
  {
    slug: "otivy",
    name: "Otivy",
    composition: "Ivy leaf extract + Zingiber officinale rhizome extract (ginger) + Alpinia galanga rhizome extract + Sambucus nigra extract + curcuminoids-soft extract + Ocimum tenuiflorum (tulsi) seed extract + menthol (cough syrup)",
    description: "A multi-antioxidant/nutraceutical formulation intended to support redox balance and tissue nutrition.",
    mechanism: "Ingredients act through complementary pathways such as glutathione recycling, free-radical scavenging, mitochondrial electron transport support, inflammatory signalling modulation and micronutrient cofactor activity.",
    usedFor: "Used as nutritional adjunct/support rather than as a stand-alone treatment for a diagnosed disease; evidence and approved claims vary by ingredient and indication.",
    direction: "Adults and older children commonly take 5–10 mL two to three times daily after meals for short-term symptomatic cough support. In younger children, use an age-appropriate reduced dose under paediatric supervision. If cough persists beyond 5–7 days, is associated with wheezing, fever or breathing difficulty, seek medical review. Use as prescribed by the doctor.",
    precautions: [
      "Check pregnancy status, anticoagulants, liver/kidney disease and allergy history.",
      "Antioxidant supplements should not be promoted as replacing standard treatment, especially during cancer therapy without oncologist approval."
    ],
    image: "/assets/therapeutic-ent.jpg"
  },
  {
    slug: "histocore",
    name: "Histocore",
    composition: "Hesperidin + Berberis aristata root extract + quercetin from botanical sources + Vitamin C (L-ascorbic acid) + bromelain (pineapple)",
    description: "A botanical flavonoid/antioxidant formulation intended to support inflammatory and upper-airway symptom control.",
    mechanism: "Quercetin and hesperidin have antioxidant/flavonoid activity; bromelain is a proteolytic enzyme with anti-oedema effects; vitamin C supports antioxidant recycling; Berberis-derived alkaloids have antimicrobial/metabolic activity but also meaningful drug-interaction potential.",
    usedFor: "Used as adjunct nutritional support for allergy/inflammatory symptoms rather than as a replacement for antihistamines, antibiotics or corticosteroids when those are clinically indicated.",
    direction: "Take 1 tablet or capsule once daily with food. When a divided regimen is clinically preferred, it may be taken twice daily with meals. Avoid taking bromelain- or berberine-containing products on an empty stomach if they cause gastrointestinal discomfort. Use as prescribed by the doctor.",
    precautions: [
      "Berberine-containing products can interact with CYP/P-gp substrates and are generally avoided in pregnancy.",
      "Bromelain may increase bleeding risk with anticoagulants."
    ],
    image: "/assets/therapeutic-ent.jpg"
  }
];

export function getEntProductBySlug(slug) {
  if (!slug) return null;
  const normalized = slug.toLowerCase().trim();
  return entProducts.find(
    p => p.slug.toLowerCase() === normalized ||
         p.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized.replace(/[^a-z0-9]/g, '') ||
         p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === normalized
  );
}
