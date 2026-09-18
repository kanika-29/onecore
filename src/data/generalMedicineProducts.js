export const generalMedicineProducts = [
  {
    slug: "stomazo-40",
    name: "Stomazo-40",
    composition: "Esomeprazole 40 mg tablets",
    description: "Stomazo-40 contains a proton-pump inhibitor (PPI) that suppresses gastric acid secretion.",
    mechanism: "The PPI irreversibly inhibits the gastric parietal-cell H+/K+-ATPase (proton pump), producing potent and sustained reduction of stomach acid.",
    usedFor: "Used for acid-related disorders such as GERD, erosive oesophagitis and peptic-ulcer disease; injection is reserved for settings where oral therapy is unsuitable or for specific hospital indications.",
    direction: "Take 40 mg once daily 30–60 minutes before breakfast; for selected refractory acid disorders a clinician may use twice-daily therapy. Typical courses are 4–8 weeks before reassessment. Use as prescribed by the doctor.",
    precautions: [
      "Long-term/high-dose use may contribute to low magnesium/B12, fractures and enteric infection risk.",
      "Review alarm symptoms (weight loss, bleeding, dysphagia), kidney/liver disease and interactions."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "stomazo-d",
    name: "Stomazo-D",
    composition: "Esomeprazole 40 mg + domperidone 30 mg capsules",
    description: "A fixed-dose acid-suppressing PPI plus a prokinetic/antiemetic agent.",
    mechanism: "The PPI blocks gastric proton pumps to reduce acid. The prokinetic component enhances upper-GI motility and/or dopamine signalling pathways, helping symptoms such as post-meal fullness, nausea or reflux associated with delayed gastric emptying.",
    usedFor: "Sometimes prescribed for GERD/dyspepsia with prominent nausea, fullness or motility symptoms when a clinician considers a prokinetic appropriate.",
    direction: "Take 1 capsule once daily 15–30 minutes before breakfast. Because the formulation contains 30 mg domperidone, keep treatment as short as possible—often days to 1–2 weeks—unless a clinician specifically extends it. Use as prescribed by the doctor.",
    precautions: [
      "Domperidone can prolong QT and is unsuitable in some cardiac patients or with interacting CYP3A4/QT-prolonging drugs.",
      "Levosulpiride can raise prolactin and cause movement effects.",
      "Review cardiac, neurologic and endocrine history."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "doxicent-100-200",
    name: "Doxicent 100/200",
    composition: "Cefpodoxime proxetil tablets",
    description: "An oral third-generation cephalosporin antibiotic.",
    mechanism: "Binds penicillin-binding proteins and inhibits bacterial peptidoglycan cell-wall crosslinking, causing cell lysis in susceptible bacteria.",
    usedFor: "Used for selected bacterial respiratory/ENT, urinary, skin and other infections based on clinical diagnosis and local resistance patterns.",
    direction: "Take tablets with food. Typical adult/adolescent dosing is 100 mg every 12 hours for pharyngitis or uncomplicated UTI, and 200 mg every 12 hours for sinusitis, pneumonia or bronchitis; duration is usually 5–14 days depending on infection. Use as prescribed by the doctor.",
    precautions: [
      "Check cephalosporin/penicillin allergy history and renal function.",
      "Diarrhoea, rash and C. difficile infection are important concerns.",
      "Antibiotic stewardship is essential."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "doxicent-cv",
    name: "Doxicent CV",
    composition: "Cefpodoxime proxetil 200 mg + clavulanic acid 125 mg tablets",
    description: "An oral third-generation cephalosporin antibiotic.",
    mechanism: "Binds penicillin-binding proteins and inhibits bacterial peptidoglycan cell-wall crosslinking, causing cell lysis in susceptible bacteria.",
    usedFor: "Used for selected bacterial respiratory/ENT, urinary, skin and other infections based on clinical diagnosis and local resistance patterns.",
    direction: "Take 1 tablet every 12 hours with food for a clinician-defined course, commonly 5–10 days depending on infection. Renal impairment may require interval adjustment. Use as prescribed by the doctor.",
    precautions: [
      "Check cephalosporin/penicillin allergy history and renal function.",
      "Diarrhoea, rash and C. difficile infection are important concerns.",
      "Antibiotic stewardship is essential."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "frecox",
    name: "Frecox",
    composition: "Aceclofenac 100 mg + paracetamol 325 mg tablets",
    description: "A combined NSAID plus analgesic for short-term pain and inflammation.",
    mechanism: "Aceclofenac reduces peripheral prostaglandin-mediated inflammation; paracetamol mainly provides central analgesic and antipyretic effects.",
    usedFor: "Used for painful inflammatory musculoskeletal conditions when a clinician decides that combination therapy is appropriate.",
    direction: "Take 1 tablet twice daily after meals for short-term pain, usually a few days. Do not add another paracetamol or NSAID product without calculating the total daily dose. Use as prescribed by the doctor.",
    precautions: [
      "Avoid active peptic ulcer/bleeding and use caution in kidney, liver, cardiovascular disease or anticoagulant use.",
      "Excess paracetamol can cause severe liver injury."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "frecox-sp",
    name: "Frecox-SP",
    composition: "Aceclofenac 100 mg + paracetamol 325 mg + serratiopeptidase 15 mg tablets",
    description: "An analgesic/anti-inflammatory combination sometimes used for acute painful inflammatory conditions.",
    mechanism: "Aceclofenac inhibits prostaglandin synthesis; paracetamol provides additional analgesia; serratiopeptidase is a proteolytic enzyme marketed to reduce inflammatory oedema, though evidence varies by indication.",
    usedFor: "Used for short-term musculoskeletal, dental or postoperative pain when a clinician considers the combination appropriate.",
    direction: "Take 1 tablet twice daily after meals for a short course, commonly 3–5 days and generally not more than 7–10 days without review. Avoid additional NSAIDs or paracetamol-containing combinations. Use as prescribed by the doctor.",
    precautions: [
      "GI bleeding, kidney injury, blood-pressure elevation and liver toxicity are key NSAID/paracetamol risks.",
      "Review anticoagulants, alcohol intake and total daily paracetamol exposure."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "frecox-th",
    name: "Frecox-TH",
    composition: "Aceclofenac 100 mg + paracetamol 325 mg + thiocolchicoside 4 mg tablets",
    description: "A short-course combination for painful musculoskeletal inflammation with muscle spasm.",
    mechanism: "Aceclofenac reduces prostaglandin synthesis via COX inhibition; paracetamol adds central analgesic/antipyretic activity; thiocolchicoside acts as a muscle relaxant through glycinergic/GABA-related mechanisms.",
    usedFor: "Used for acute painful musculoskeletal conditions with clinically significant spasm.",
    direction: "Take 1 tablet twice daily after meals for the shortest possible course, typically 3–7 days. Oral thiocolchicoside should not be used long term; stop earlier if pain/spasm resolves. Use as prescribed by the doctor.",
    precautions: [
      "Avoid in active ulcer/bleeding, severe kidney/liver disease and significant NSAID hypersensitivity.",
      "Thiocolchicoside is should be avoided during pregnancy and has restrictions related to seizure/genotoxicity risk."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "nervia-nx",
    name: "Nervia-NX",
    composition: "Pregabalin 75 mg + nortriptyline 10 mg + methylcobalamin 1500 mcg tablets",
    description: "A multimodal neuropathic-pain combination, with methylcobalamin included for vitamin B12/nerve support.",
    mechanism: "Pregabalin binds the alpha2-delta subunit of voltage-gated calcium channels and reduces excitatory neurotransmitter release. Nortriptyline inhibits norepinephrine/serotonin reuptake and modulates descending pain pathways.",
    usedFor: "Used for selected peripheral neuropathic pain syndromes, such as diabetic neuropathy or radicular/nerve pain, after clinical assessment.",
    direction: "Take 1 tablet once daily in the evening/at bedtime initially. If pain remains uncontrolled, any increase should be clinician-led; pregabalin must be adjusted in renal impairment and tapered rather than stopped abruptly. Use as prescribed by the doctor.",
    precautions: [
      "Can cause dizziness, sleepiness, oedema and falls.",
      "Nortriptyline adds anticholinergic and cardiac effects.",
      "Avoid driving initially; review glaucoma, urinary retention, arrhythmia and serotonergic drugs."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "mesolac",
    name: "Mesolac",
    composition: "Lactulose 100 g/15 mL syrup",
    description: "An osmotic laxative that also reduces ammonia absorption in hepatic encephalopathy.",
    mechanism: "Gut bacteria metabolize lactulose into organic acids, drawing water into the colon and softening stool; acidification of the colon also traps ammonia as ammonium.",
    usedFor: "Used for constipation and, at different titrated doses, hepatic encephalopathy.",
    direction: "For adult constipation, start with 15–30 mL once daily or in two divided doses and adjust to achieve 1–2 soft stools per day. For hepatic encephalopathy, 30–45 mL three to four times daily is commonly titrated to achieve 2–3 soft stools daily. Use as prescribed by the doctor.",
    precautions: [
      "Excess dosing can cause diarrhoea, dehydration and electrolyte disturbance.",
      "Use cautiously with diabetes and in patients at risk of fluid/electrolyte imbalance."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "goodfate-o",
    name: "Goodfate-O",
    composition: "Sucralfate 1 g + oxetacaine 20 mg suspension",
    description: "A mucosal-protective medicine combined with a local anaesthetic for acid-related upper-GI pain.",
    mechanism: "Sucralfate polymerizes in acidic conditions and adheres to ulcerated mucosa, forming a protective barrier. Oxetacaine locally reduces pain sensation on the gastric/oesophageal mucosa.",
    usedFor: "Used for gastritis, peptic-ulcer symptoms, reflux-related irritation or painful dyspepsia when selected by a clinician.",
    direction: "Take a dose delivering 1 g sucralfate (commonly 10 mL of suspension) 3 times daily, 1 hour before meals; a bedtime dose may be added in ulcer regimens. Keep other oral medicines at least 2 hours apart. Use as prescribed by the doctor.",
    precautions: [
      "Constipation can occur.",
      "Use caution in significant renal impairment (aluminium exposure).",
      "Separate from antibiotics, thyroid medicine and other interacting oral drugs."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "omnagut",
    name: "Omnagut",
    composition: "Probiotics (2.5 billion cells) + prebiotic softgel capsules",
    description: "A synbiotic supplement combining probiotics with a prebiotic substrate to support intestinal microbiome recovery and bowel function.",
    mechanism: "Probiotics can transiently modify microbial composition and barrier signalling, while prebiotics selectively feed saccharolytic bacteria and increase short-chain fatty-acid production.",
    usedFor: "Used as adjunct support during/after antibiotics, mild functional GI symptoms or dietary disruption.",
    direction: "Take 1 softgel once daily with a meal for 2–4 weeks; if used with antibiotics, take it at least 2 hours before or after the antibiotic. Use as prescribed by the doctor.",
    precautions: [
      "Separate from antibiotics by about 2 hours.",
      "Avoid or use specialist guidance in severe immunosuppression, central venous catheters or critical illness."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "rabefort-20",
    name: "Rabefort-20",
    composition: "Rabeprazole sodium 20 mg tablets & injection",
    description: "Rabefort-20 contains a proton-pump inhibitor (PPI) that suppresses gastric acid secretion.",
    mechanism: "The PPI irreversibly inhibits the gastric parietal-cell H+/K+-ATPase (proton pump), producing potent and sustained reduction of stomach acid.",
    usedFor: "Used for acid-related disorders such as GERD, erosive oesophagitis and peptic-ulcer disease; injection is reserved for settings where oral therapy is unsuitable or for specific hospital indications.",
    direction: "Oral rabeprazole 20 mg: take once daily about 30 minutes before breakfast; common GERD/ulcer courses are 4–8 weeks. If the injectable form is used because oral therapy is not possible, 20 mg IV once daily is a common acid-suppression regimen until oral treatment can resume. Use as prescribed by the doctor.",
    precautions: [
      "Long-term/high-dose use may contribute to low magnesium/B12, fractures and enteric infection risk.",
      "Review alarm symptoms (weight loss, bleeding, dysphagia), kidney/liver disease and interactions."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "rabefort-dsr",
    name: "Rabefort-DSR",
    composition: "Rabeprazole 20 mg + domperidone 30 mg SR capsules",
    description: "A fixed-dose acid-suppressing PPI plus a prokinetic/antiemetic agent.",
    mechanism: "The PPI blocks gastric proton pumps to reduce acid. The prokinetic component enhances upper-GI motility and/or dopamine signalling pathways, helping symptoms such as post-meal fullness, nausea or reflux associated with delayed gastric emptying.",
    usedFor: "Sometimes prescribed for GERD/dyspepsia with prominent nausea, fullness or motility symptoms when a clinician considers a prokinetic appropriate.",
    direction: "Take 1 capsule once daily 15–30 minutes before breakfast. Keep the domperidone-containing course short (often up to 1 week for nausea/motility symptoms) and reassess before longer use. Use as prescribed by the doctor.",
    precautions: [
      "Domperidone can prolong QT and is unsuitable in some cardiac patients or with interacting CYP3A4/QT-prolonging drugs.",
      "Levosulpiride can raise prolactin and cause movement effects.",
      "Review cardiac, neurologic and endocrine history."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "rabefort-l",
    name: "Rabefort-L",
    composition: "Rabeprazole 20 mg + levosulpiride 75 mg SR capsules",
    description: "A fixed-dose acid-suppressing PPI plus a prokinetic/antiemetic agent.",
    mechanism: "The PPI blocks gastric proton pumps to reduce acid. The prokinetic component enhances upper-GI motility and/or dopamine signalling pathways, helping symptoms such as post-meal fullness, nausea or reflux associated with delayed gastric emptying.",
    usedFor: "Sometimes prescribed for GERD/dyspepsia with prominent nausea, fullness or motility symptoms when a clinician considers a prokinetic appropriate.",
    direction: "Take 1 capsule once daily, preferably 30 minutes before breakfast. Use for the shortest duration needed; reassess if used beyond 2–4 weeks because levosulpiride can raise prolactin and cause movement symptoms. Use as prescribed by the doctor.",
    precautions: [
      "Domperidone can prolong QT and is unsuitable in some cardiac patients or with interacting CYP3A4/QT-prolonging drugs.",
      "Levosulpiride can raise prolactin and cause movement effects.",
      "Review cardiac, neurologic and endocrine history."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "rabefort-it",
    name: "Rabefort-IT",
    composition: "Rabeprazole 20 mg + itopride 150 mg SR capsules",
    description: "A fixed-dose acid-suppressing PPI plus a prokinetic/antiemetic agent.",
    mechanism: "The PPI blocks gastric proton pumps to reduce acid. The prokinetic component enhances upper-GI motility and/or dopamine signalling pathways, helping symptoms such as post-meal fullness, nausea or reflux associated with delayed gastric emptying.",
    usedFor: "Sometimes prescribed for GERD/dyspepsia with prominent nausea, fullness or motility symptoms when a clinician considers a prokinetic appropriate.",
    direction: "Take 1 SR capsule once daily before breakfast or the main meal, about 30 minutes before food. Reassess after 2–4 weeks rather than using indefinitely. Use as prescribed by the doctor.",
    precautions: [
      "Domperidone can prolong QT and is unsuitable in some cardiac patients or with interacting CYP3A4/QT-prolonging drugs.",
      "Levosulpiride can raise prolactin and cause movement effects.",
      "Review cardiac, neurologic and endocrine history."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "pantazon-40",
    name: "Pantazon-40",
    composition: "Pantoprazole 40 mg tablets & injection",
    description: "Pantazon-40 contains a proton-pump inhibitor (PPI) that suppresses gastric acid secretion.",
    mechanism: "The PPI irreversibly inhibits the gastric parietal-cell H+/K+-ATPase (proton pump), producing potent and sustained reduction of stomach acid.",
    usedFor: "Used for acid-related disorders such as GERD, erosive oesophagitis and peptic-ulcer disease; injection is reserved for settings where oral therapy is unsuitable or for specific hospital indications.",
    direction: "Take 40 mg once daily 30–60 minutes before breakfast. Use 4–8 weeks for common acid-related indications, then step down/stop if clinically appropriate. Use as prescribed by the doctor.",
    precautions: [
      "Long-term/high-dose use may contribute to low magnesium/B12, fractures and enteric infection risk.",
      "Review alarm symptoms (weight loss, bleeding, dysphagia), kidney/liver disease and interactions."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "pantazon-dsr",
    name: "Pantazon-DSR",
    composition: "Pantoprazole 40 mg + domperidone 30 mg SR capsules",
    description: "A fixed-dose acid-suppressing PPI plus a prokinetic/antiemetic agent.",
    mechanism: "The PPI blocks gastric proton pumps to reduce acid. The prokinetic component enhances upper-GI motility and/or dopamine signalling pathways, helping symptoms such as post-meal fullness, nausea or reflux associated with delayed gastric emptying.",
    usedFor: "Sometimes prescribed for GERD/dyspepsia with prominent nausea, fullness or motility symptoms when a clinician considers a prokinetic appropriate.",
    direction: "Take 1 capsule once daily 15–30 minutes before breakfast. The domperidone component should generally be short term and reviewed if symptoms persist. Use as prescribed by the doctor.",
    precautions: [
      "Domperidone can prolong QT and is unsuitable in some cardiac patients or with interacting CYP3A4/QT-prolonging drugs.",
      "Levosulpiride can raise prolactin and cause movement effects.",
      "Review cardiac, neurologic and endocrine history."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "omnacare",
    name: "Omnacare",
    composition: "Myo-inositol + Tribulus terrestris extract + Ecklonia bicyclis (brown algae) + chitosan oligosaccharides tablets",
    description: "An inositol-centered nutritional/metabolic formulation often positioned for insulin signalling and reproductive-metabolic support.",
    mechanism: "Myo- and D-chiro-inositol participate in insulin second-messenger pathways and ovarian signalling. Added nutrients/antioxidants may support oxidative balance and micronutrient status.",
    usedFor: "Most commonly used as adjunct nutritional support in PCOS-related metabolic or ovulatory dysfunction; it is not a substitute for evaluation of infertility or endocrine disease.",
    direction: "A practical male-fertility/sexual-wellness adjunct schedule is 1 tablet twice daily after meals for at least 8–12 weeks before judging response, because spermatogenesis takes roughly 2–3 months. Do not use as a substitute for infertility evaluation. Use as prescribed by the doctor.",
    precautions: [
      "Generally well tolerated; GI upset can occur.",
      "Review diabetes medications, pregnancy plans and endocrine diagnoses with a clinician."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "cefnara-250",
    name: "Cefnara-250",
    composition: "Cefuroxime 250 mg",
    description: "A second-generation cephalosporin antibiotic.",
    mechanism: "Inhibits bacterial cell-wall synthesis by binding penicillin-binding proteins.",
    usedFor: "Used for susceptible bacterial ENT, respiratory, urinary, skin and other infections.",
    direction: "Take 250 mg every 12 hours for 5–10 days for susceptible infections, with duration depending on diagnosis. Tablets may be taken with or without food, but taking after food can improve absorption/tolerance. Use as prescribed by the doctor.",
    precautions: [
      "Assess beta-lactam allergy and kidney function.",
      "Common effects include GI upset and diarrhoea; seek care for severe allergy or persistent diarrhoea."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "cefnara-500",
    name: "Cefnara-500",
    composition: "Cefuroxime 500 mg",
    description: "A second-generation cephalosporin antibiotic.",
    mechanism: "Inhibits bacterial cell-wall synthesis by binding penicillin-binding proteins.",
    usedFor: "Used for susceptible bacterial ENT, respiratory, urinary, skin and other infections.",
    direction: "Take 500 mg every 12 hours for 5–10 days for susceptible infections, with duration depending on diagnosis. Tablets may be taken with or without food, but taking after food can improve absorption/tolerance. Use as prescribed by the doctor.",
    precautions: [
      "Assess beta-lactam allergy and kidney function.",
      "Common effects include GI upset and diarrhoea; seek care for severe allergy or persistent diarrhoea."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "cefnara-cv",
    name: "Cefnara-CV",
    composition: "Cefuroxime + clavulanate",
    description: "A second-generation cephalosporin antibiotic.",
    mechanism: "Inhibits bacterial cell-wall synthesis by binding penicillin-binding proteins.",
    usedFor: "Used for susceptible bacterial ENT, respiratory, urinary, skin and other infections.",
    direction: "For adults, fixed-dose cefuroxime/clavulanate combinations are commonly taken as 1 tablet every 12 hours after food for about 5–10 days, depending on the infection. Paediatric treatment should be weight-based. Complete the full prescribed course. Use as prescribed by the doctor.",
    precautions: [
      "Assess beta-lactam allergy and kidney function.",
      "Common effects include GI upset and diarrhoea; seek care for severe allergy or persistent diarrhoea."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
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
    image: "/assets/therapeutic-general-medicine.jpg"
  },
  {
    slug: "throfree",
    name: "Throfree",
    composition: "Ondansetron mouth-dissolving 4 mg tablets",
    description: "A 5-HT3 receptor antagonist antiemetic.",
    mechanism: "Blocks serotonin 5-HT3 receptors on vagal afferents and in central vomiting pathways, reducing nausea and vomiting signalling.",
    usedFor: "Used for prevention/treatment of nausea and vomiting, including postoperative and treatment-related nausea; use should match the cause and patient profile.",
    direction: "Place the 4 mg ODT on the tongue and allow it to dissolve. For general adult nausea, 4 mg every 8–12 hours as needed is commonly used; chemotherapy/postoperative regimens differ. In severe hepatic impairment, total ondansetron should not exceed 8 mg/day. Use as prescribed by the doctor.",
    precautions: [
      "Can prolong QT, especially with electrolyte abnormalities or other QT-prolonging drugs.",
      "Caution with congenital long-QT syndrome and serotonergic medicines."
    ],
    image: "/assets/therapeutic-general-medicine.jpg"
  }
];

export function getGeneralMedicineProductBySlug(slug) {
  if (!slug) return null;
  const normalized = slug.toLowerCase().trim();
  return generalMedicineProducts.find(
    p => p.slug.toLowerCase() === normalized ||
         p.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized.replace(/[^a-z0-9]/g, '') ||
         p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === normalized
  );
}
