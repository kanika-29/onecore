export const oncologyProducts = [
  {
    slug: "cytos-support",
    name: "Cytos SUPPORT",
    composition: "Specialized high-protein nutritional supplement with glutamine, EPA, DHA, antioxidants and essential micronutrients",
    description: "A specialized nutritional formulation designed to support patients undergoing active oncology treatments, counter muscle wasting and maintain metabolic balance.",
    mechanism: "Provides concentrated intact proteins, branched-chain amino acids, and immunonutrients to support nitrogen balance, cellular repair and reduce treatment-related cachexia.",
    usedFor: "Used for medical nutritional support during chemotherapy, radiotherapy, post-surgical recovery, and oncology cachexia management.",
    direction: "Mix 1 scoop in 200 mL of water or milk once or twice daily as recommended by the clinical oncologist or dietitian. Use as prescribed by the doctor.",
    precautions: [
      "Not for parenteral use.",
      "Use under medical supervision.",
      "Monitor renal function and fluid intake in vulnerable patients."
    ],
    image: "/assets/cytos.jpg"
  },
  {
    slug: "oncora-4",
    name: "Oncora-4",
    composition: "Ondansetron 4 mg orally disintegrating tablets",
    description: "A selective 5-HT3 receptor antagonist antiemetic used to prevent nausea and vomiting induced by cytotoxic chemotherapy and radiotherapy.",
    mechanism: "Selectively antagonizes 5-HT3 receptors located on peripheral vagal nerve terminals and centrally in the chemoreceptor trigger zone (CTZ).",
    usedFor: "Used for the prevention and management of chemotherapy-induced and radiotherapy-induced nausea and vomiting (CINV/RINV).",
    direction: "Take 1 tablet (4 mg) 30 minutes before initiation of chemotherapy, followed by 4 mg every 8 hours for 1 to 2 days after completion of chemotherapy. Use as prescribed by the doctor.",
    precautions: [
      "Use caution in patients with cardiac conduction abnormalities or electrolyte imbalances.",
      "Constipation and headache are known adverse effects.",
      "Monitor for signs of serotonin syndrome if combined with other serotonergic agents."
    ],
    image: "/assets/cytos.jpg"
  },
  {
    slug: "oncora-8",
    name: "Oncora-8",
    composition: "Ondansetron 8 mg orally disintegrating tablets",
    description: "A high-potency selective 5-HT3 receptor antagonist antiemetic for moderate-to-high emetogenic cancer therapies.",
    mechanism: "Blocks serotonin receptors on peripheral vagal afferents and central chemoreceptor trigger zones, preventing the emetic reflex.",
    usedFor: "Used for prevention of nausea and vomiting associated with moderately and highly emetogenic chemotherapy and radiotherapy.",
    direction: "Take 1 tablet (8 mg) 30 to 60 minutes prior to chemotherapy, repeated 8 to 12 hours later, then 8 mg twice daily for 1 to 2 days post-chemotherapy. Use as prescribed by the doctor.",
    precautions: [
      "Review ECG intervals in patients at risk of QT prolongation.",
      "Dose reduction may be necessary in patients with severe hepatic impairment.",
      "Avoid concurrent apomorphine."
    ],
    image: "/assets/cytos.jpg"
  },
  {
    slug: "leuco-boost",
    name: "Leuco-Boost",
    composition: "Filgrastim 300 mcg / 0.5 mL solution for injection (Recombinant Human G-CSF)",
    description: "A recombinant human granulocyte colony-stimulating factor (G-CSF) used to stimulate white blood cell production and reduce the risk of neutropenic infections.",
    mechanism: "Binds to specific cell surface receptors on hematopoietic cells, stimulating proliferation, differentiation, and activation of neutrophil precursors.",
    usedFor: "Used for the reduction in the duration of neutropenia and incidence of febrile neutropenia in patients receiving myelosuppressive chemotherapy.",
    direction: "Administered as a daily subcutaneous injection or intravenous infusion starting at least 24 hours after cytotoxic chemotherapy until expected neutrophil nadir has passed and count has normalized. Administer under clinical supervision.",
    precautions: [
      "Do not administer within 24 hours before or after cytotoxic chemotherapy.",
      "Monitor complete blood counts and absolute neutrophil counts regularly.",
      "Report left upper abdominal pain or shoulder tip pain promptly (splenic enlargement)."
    ],
    image: "/assets/cytos.jpg"
  },
  {
    slug: "aprecore",
    name: "Aprecore",
    composition: "Aprepitant 125 mg (Day 1) + 80 mg (Days 2 & 3) capsules",
    description: "A selective substance P / neurokinin-1 (NK1) receptor antagonist antiemetic used in combination regimens for highly emetogenic chemotherapy.",
    mechanism: "Inhibits substance P binding at NK1 receptors in the brain stem emetic centers, providing targeted control over acute and delayed phases of emesis.",
    usedFor: "Used in combination with a 5-HT3 antagonist and dexamethasone for the prevention of acute and delayed nausea and vomiting with cancer chemotherapy.",
    direction: "Take 125 mg orally 1 hour before chemotherapy on Day 1, followed by 80 mg once daily in the morning on Days 2 and 3. Swallow whole with water. Use as prescribed by the doctor.",
    precautions: [
      "Moderate inhibitor of CYP3A4; review concomitant medications metabolized by CYP3A4.",
      "May decrease effectiveness of oral hormonal contraceptives; barrier contraception advised.",
      "Use caution in patients with severe hepatic impairment."
    ],
    image: "/assets/cytos.jpg"
  },
  {
    slug: "nausex-iv",
    name: "Nausex-IV",
    composition: "Palonosetron hydrochloride 0.25 mg / 5 mL IV injection",
    description: "A second-generation 5-HT3 receptor antagonist with high binding affinity and an extended half-life for prolonged antiemetic protection.",
    mechanism: "Exhibits strong, persistent binding and positive cooperativity at 5-HT3 receptors, preventing both acute and delayed emetic signaling.",
    usedFor: "Used for the prevention of acute and delayed nausea and vomiting associated with initial and repeat courses of moderately and highly emetogenic chemotherapy.",
    direction: "Administered as a single intravenous bolus (0.25 mg) over 30 seconds approximately 30 minutes prior to the start of chemotherapy. Administered in hospital/clinic settings under medical supervision.",
    precautions: [
      "Hypersensitivity reactions may occur.",
      "Monitor for serotonin syndrome when co-administered with serotonergic agents.",
      "Headache and constipation are the most frequently reported side effects."
    ],
    image: "/assets/cytos.jpg"
  }
];

export function getOncologyProductBySlug(slug) {
  if (!slug) return null;
  const normalized = slug.toLowerCase().trim();
  return (
    oncologyProducts.find(
      (p) =>
        p.slug === normalized ||
        p.name.toLowerCase().replace(/\s+/g, '-') === normalized ||
        p.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized.replace(/[^a-z0-9]/g, '')
    ) || null
  );
}
