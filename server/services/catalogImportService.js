import XLSX from 'xlsx';
import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { query } from '../config/db.js';
import { getStoragePaths, isWritableDir } from '../utils/storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { sharedDir } = getStoragePaths(__dirname);

function getUploadDirectories() {
  const dirs = [];
  if (process.env.UPLOADS_DIR) {
    const custom = path.resolve(process.env.UPLOADS_DIR);
    try {
      if (!fs.existsSync(custom)) fs.mkdirSync(custom, { recursive: true });
      if (isWritableDir(custom)) dirs.push(custom);
    } catch {}
  }
  if (sharedDir) {
    try {
      if (!fs.existsSync(sharedDir)) fs.mkdirSync(sharedDir, { recursive: true });
      if (isWritableDir(sharedDir)) dirs.push(sharedDir);
    } catch {}
  }
  const local = path.resolve(__dirname, '..', 'uploads');
  try {
    if (!fs.existsSync(local)) fs.mkdirSync(local, { recursive: true });
    dirs.push(local);
  } catch {}

  const publicAssets = path.resolve(__dirname, '..', '..', 'public', 'assets', 'products');
  try {
    if (!fs.existsSync(publicAssets)) fs.mkdirSync(publicAssets, { recursive: true });
    dirs.push(publicAssets);
  } catch {}

  return dirs;
}

export const DIVISION_MAP = {
  'femme': { id: 1, name: "Women's Health", slug: 'womens-health' },
  'womens-health': { id: 1, name: "Women's Health", slug: 'womens-health' },
  "women's health": { id: 1, name: "Women's Health", slug: 'womens-health' },
  'women': { id: 1, name: "Women's Health", slug: 'womens-health' },

  'pediaplus': { id: 2, name: 'Paediatrics', slug: 'paediatrics' },
  'pediatrics': { id: 2, name: 'Paediatrics', slug: 'paediatrics' },
  'paediatrics': { id: 2, name: 'Paediatrics', slug: 'paediatrics' },
  'pedia': { id: 2, name: 'Paediatrics', slug: 'paediatrics' },

  'ortheon': { id: 3, name: 'Orthopaedics', slug: 'orthopaedics' },
  'orthopaedics': { id: 3, name: 'Orthopaedics', slug: 'orthopaedics' },
  'orthopedics': { id: 3, name: 'Orthopaedics', slug: 'orthopaedics' },
  'ortho': { id: 3, name: 'Orthopaedics', slug: 'orthopaedics' },

  'neurix': { id: 4, name: 'Neurology', slug: 'neurology' },
  'neurology': { id: 4, name: 'Neurology', slug: 'neurology' },
  'neuro': { id: 4, name: 'Neurology', slug: 'neurology' },

  'eyrix': { id: 5, name: 'Ophthalmology', slug: 'ophthalmology' },
  'eyerix': { id: 5, name: 'Ophthalmology', slug: 'ophthalmology' },
  'ophthalmology': { id: 5, name: 'Ophthalmology', slug: 'ophthalmology' },
  'eye': { id: 5, name: 'Ophthalmology', slug: 'ophthalmology' },

  'vellis': { id: 6, name: 'Dermatology', slug: 'dermatology' },
  'dermatology': { id: 6, name: 'Dermatology', slug: 'dermatology' },
  'derma': { id: 6, name: 'Dermatology', slug: 'dermatology' },
  'skin': { id: 6, name: 'Dermatology', slug: 'dermatology' },

  'otira': { id: 7, name: 'ENT', slug: 'ent' },
  'ent': { id: 7, name: 'ENT', slug: 'ent' },
  'ear-nose-throat': { id: 7, name: 'ENT', slug: 'ent' },

  'omnara': { id: 8, name: 'General Medicine', slug: 'general-medicine' },
  'general-medicine': { id: 8, name: 'General Medicine', slug: 'general-medicine' },
  'general medicine': { id: 8, name: 'General Medicine', slug: 'general-medicine' },
  'internal-medicine': { id: 8, name: 'General Medicine', slug: 'general-medicine' },
  'general': { id: 8, name: 'General Medicine', slug: 'general-medicine' },

  'cytos': { id: 9, name: 'Oncology', slug: 'oncology' },
  'oncology': { id: 9, name: 'Oncology', slug: 'oncology' },
  'cancer-care': { id: 9, name: 'Oncology', slug: 'oncology' },
};

function normalizeSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeKey(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function cleanText(s) {
  if (!s) return '';
  return String(s).replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
}

function parsePairedSections(text) {
  if (!text) return [];
  const clean = cleanText(text);
  const blocks = clean.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const results = [];
  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    if (lines.length === 1) {
      results.push({ title: lines[0], description: lines[0] });
    } else {
      results.push({ title: lines[0], description: lines.slice(1).join(' ') });
    }
  }
  return results;
}

function parseMechanisms(text) {
  if (!text) return [];
  const clean = cleanText(text);
  const blocks = clean.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const mechanisms = [];
  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const rawTitle = lines[0];
    const cleanTitle = rawTitle.replace(/^\d+[\s—:.-]+/, '').trim() || rawTitle;
    let desc = lines.length > 1 ? lines.slice(1).join(' ') : cleanTitle;
    desc = desc.replace(/^\d+[\s—:.-]+/, '').trim();
    mechanisms.push({ title: cleanTitle, description: desc });
  }
  return mechanisms;
}

function parseSafetySections(text) {
  const items = parsePairedSections(text);
  return items.map((item) => ({
    section_key: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'safety-note',
    title: item.title,
    description: item.description,
  }));
}

/**
 * Generates an Excel workbook template pre-filled with Instructions and 9 Division Sheets.
 * Matches the client's master Excel schema and includes all admin product form fields.
 */
export function generateCatalogTemplate() {
  const wb = XLSX.utils.book_new();

  // 1. Comprehensive Instructions Sheet
  const instructions = [
    ['ONECORE PHARMA — OFFICIAL PRODUCT CATALOG IMPORT TEMPLATE'],
    [''],
    ['====================================================================================================================================='],
    ['INSTRUCTIONS FOR PORTFOLIO MANAGEMENT, CROSS-SPECIALTY MAPPING, AND PHOTO IMPORT'],
    ['====================================================================================================================================='],
    [''],
    ['1. NINE DIVISION SHEETS:'],
    ['   This workbook contains 9 separate sheets corresponding to Onecore Pharma\'s 9 therapeutic divisions:'],
    ['   - Femme      : Women\'s Health (Gynaecology & Obstetrics)'],
    ['   - Pediaplus  : Paediatrics & Child Health'],
    ['   - Ortheon    : Orthopaedics & Bone Health'],
    ['   - Neurix     : Neurology & Neurovascular Care'],
    ['   - Eyrix      : Ophthalmology & Eye Care'],
    ['   - Vellis     : Dermatology & Advanced Skin Therapeutics'],
    ['   - Otira      : ENT (Ear, Nose & Throat Therapeutics)'],
    ['   - Omnara     : General & Internal Medicine'],
    ['   - Cytos      : Oncology & Supportive Cancer Care'],
    [''],
    ['2. MULTI-SPECIALTY / CROSS-CATEGORY RULE (VERY IMPORTANT):'],
    ['   If a formulation belongs to more than one specialty, simply enter the product into EACH respective division sheet!'],
    ['   Example 1: Glypocal™-LP is entered in BOTH "Femme" and "Ortheon" sheets.'],
    ['   Example 2: Frecox™-SP is entered in BOTH "Ortheon" and "Omnara" sheets.'],
    ['   Example 3: Flutiriv™ is entered in BOTH "Pediaplus" and "Otira" sheets.'],
    ['   Example 4: Nervia™-NX is entered in THREE sheets: "Ortheon", "Neurix", and "Omnara".'],
    ['   -> The system automatically links the same brand name and displays the product card on every corresponding division page!'],
    [''],
    ['3. EXACT COLUMN DEFINITIONS (MATCHING CLIENT MASTER SPREADSHEET & ADMIN FORM):'],
    ['   Col A: S. No.                             - Serial number / row index (e.g. 1, 2, 3...)'],
    ['   Col B: Brand Name                         - Commercial pharmaceutical trademark (e.g. Folatis™, Stomazo™-40, Fracway™)'],
    ['   Col C: Composition                        - Active pharmaceutical ingredients and strengths (e.g. Esomeprazole 40 mg Tablets)'],
    ['   Col D: Drug/Nutraceutical/Cosmetic        - Product classification (Drug, Nutraceutical, or Cosmetic)'],
    ['   Col E: A Brief Description                - Clinical summary and therapeutic overview for doctors and pharmacists'],
    ['   Col F: Indication                         - Clinical uses and conditions treated. Use paired title and description blocks separated by a blank line'],
    ['   Col G: Administration and Dosage Guidance - Dosing schedule, meal timing, and administration advice'],
    ['   Col H: Mechanism of Action                - Cellular actions and pharmacodynamics (supports numbered points e.g. 01 — ..., 02 — ...)'],
    ['   Col I: Safety and Precautions             - Warnings, contraindications, and special populations (paired title & description blocks)'],
    ['   Col J: Pack Size / Dosage Form            - Commercial packaging format (e.g. 10 x 10 Tablets, 60 mL Bottle, 15 mL Drops)'],
    ['   Col K: Image File Name                    - Packaging photo filename in your ZIP folder (e.g. folatis.png, stomazo-40.jpg)'],
    [''],
    ['4. PACKSHOT IMAGES ZIP ARCHIVE:'],
    ['   - Place all packaging photos into a single folder and compress it as a ZIP file (e.g. "images.zip").'],
    ['   - Supported photo formats: PNG, JPG, JPEG, WEBP.'],
    ['   - Auto-Matching: Name the image after the product brand (e.g. "folatis.png", "stomazo-40.png")'],
    ['     OR write the exact filename in Col K ("Image File Name"). Both match automatically during import!'],
  ];

  const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
  XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

  const headers = [
    'S. No.',
    'Brand Name',
    'Composition',
    'Drug/Nutraceutical/Cosmetic',
    'A Brief Description',
    'Indication',
    'Administration and Dosage Guidance',
    'Mechanism of Action',
    'Safety and Precautions',
    'Pack Size / Dosage Form',
    'Image File Name',
  ];

  const divisionSamples = [
    {
      name: 'Femme',
      rows: [
        [
          1,
          'Folatis™',
          'L-Methylfolate 5 mg + Methylcobalamin 1500 mcg + Pyridoxal-5-Phosphate 0.5 mg Tablets',
          'Nutraceutical',
          'FOLATIS combines active folate with methylcobalamin and pyridoxal phosphate to support folate and vitamin B12 status. It helps meet specific nutritional needs involved in red blood cell formation, homocysteine metabolism and normal nerve function, when used under medical supervision alongside a balanced diet.',
          'Active B-Vitamin Nutritional Support\r\nSupplies active coenzyme forms of folate and vitamin B12 to complement dietary intake.\r\n\r\nNutritional Management in Prescribed Care\r\nUsed under healthcare supervision to address specific folate and B12 nutritional needs.',
          'Dosing and Schedule\r\nTake 1 tablet once daily, or as advised by your healthcare professional.\r\n\r\nAdministration Advice\r\nSwallow whole with water, preferably with or after a meal. Do not exceed the advised serving. Combine with a varied diet and regular medical review.',
          '01 — Supplies Active Coenzymes\r\nProvides L-methylfolate and methylcobalamin without requiring preliminary enzymatic activation.\r\n\r\n02 — Participates in One-Carbon Metabolism\r\nThese coenzymes act in cellular remethylation pathways that maintain normal homocysteine processing.\r\n\r\n03 — Complements Nutritional Status\r\nSupports blood and nerve physiology by complementing overall micronutrient intake.',
          'Medical Supervision and Diagnosis\r\nUse only under appropriate healthcare supervision. An accurate diagnosis of nutritional status is necessary before starting supplementation.\r\n\r\nMasking of Vitamin B12 Deficiency\r\nHigh folate intake without adequate vitamin B12 monitoring can mask the blood changes of B12 deficiency while neurological injury progresses.\r\n\r\nMedicines and Special Populations\r\nReview all concurrent medicines, particularly anticonvulsants and antifolates. Seek medical advice for pregnancy, breastfeeding, or kidney impairment.',
          '10 x 10 Tablets',
          'folatis.png',
        ],
        [
          2,
          'Glypocal™-LP Tablets',
          'Elemental Liposomal Calcium (Tribasic Phosphate) 500 mg + Vitamin D2 600 IU Tablets',
          'Nutraceutical',
          'Glypocal™-LP Tablets provide elemental calcium with vitamin D2 to support bone mineralisation and daily calcium intake. Calcium contributes to normal bone structure, muscle contraction and nerve signalling, while vitamin D2 supports intestinal calcium absorption. (Also listed in Ortheon).',
          'Dietary Calcium and Vitamin D Supplementation\r\nHelps meet daily calcium and vitamin D needs when intake is inadequate.\r\n\r\nBone Health and Mineralisation Support\r\nSupports bone mineral density as part of a balanced diet and healthy lifestyle.',
          'Dosing and Schedule\r\nTake 1 tablet daily, or as advised by your healthcare professional.\r\n\r\nAdministration Advice\r\nTake with or immediately after a meal to aid absorption and reduce digestive discomfort. Maintain adequate fluid intake.',
          '01 — Delivers Elemental Calcium\r\nCalcium phosphate provides elemental calcium for the mineral matrix of bone.\r\n\r\n02 — Liposomal Delivery\r\nLiposomal carrier systems are designed to enhance dispersion and intestinal uptake.\r\n\r\n03 — Facilitates Calcium Absorption\r\nVitamin D2 promotes active transport of calcium across the intestinal epithelium.',
          'Kidney Stones and Hypercalcaemia\r\nAvoid in individuals with hypercalcaemia, hypercalciuria or a history of calcium-containing kidney stones.\r\n\r\nMedicine Absorption\r\nSeparate by at least 2 hours from iron supplements, thyroid hormones, bisphosphonates and quinolone or tetracycline antibiotics.\r\n\r\nMedical Review\r\nReview calcium intake from all dietary and supplemental sources. Seek clinical advice in kidney impairment or sarcoidosis.',
          '10 x 10 Tablets',
          'glypocal-lp.png',
        ],
      ],
    },
    {
      name: 'Pediaplus',
      rows: [
        [
          1,
          'Dozokid™',
          'Melatonin 3 mg / 5 mL Syrup',
          'Drug',
          'Dozokid™ contains melatonin in a paediatric oral syrup formulation for sleep-wake cycle regulation. It supports the physiological onset of sleep under physician supervision for children with neurodevelopmental disorders or delayed sleep phase syndrome.',
          'Paediatric Sleep-Wake Regulation\r\nSupports circadian sleep-onset latency reduction in children with neurodevelopmental sleep disorders.\r\n\r\nCircadian Rhythm Alignment\r\nPromotes aligned sleep phase timing alongside behavioural sleep hygiene.',
          'Dosing and Schedule\r\nAdminister the exact volume prescribed by the paediatrician 30 to 60 minutes before bedtime.\r\n\r\nAdministration Advice\r\nUse the calibrated measuring device provided. Ensure consistent bedtime routine and dim room lighting after administration.',
          '01 — Binds MT1 and MT2 Receptors\r\nActivates central melatonin receptors in the suprachiasmatic nucleus.\r\n\r\n02 — Promotes Sleep Propensity\r\nLowers core body temperature and promotes physiological drowsiness.\r\n\r\n03 — Synchronises Circadian Pacemaker\r\nResets central circadian timing signals to support consistent sleep-wake cycles.',
          'Specialist Supervision\r\nUse exclusively under ongoing paediatric medical supervision.\r\n\r\nDaytime Somnolence\r\nMonitor for morning drowsiness. Do not exceed prescribed volume.\r\n\r\nUnderlying Medical Review\r\nInvestigate organic and behavioural causes of insomnia before and during treatment.',
          '60 mL Bottle',
          'dozokid.png',
        ],
        [
          2,
          'Flutiriv™',
          'Fluticasone furoate 27.5 mcg per metered nasal spray',
          'Drug',
          'Flutiriv™ contains fluticasone furoate in a metered nasal spray for allergic rhinitis. It acts locally in the nasal lining to reduce allergic inflammation and relieve congestion, sneezing, itching and discharge. (Also listed in Otira).',
          'Seasonal Allergic Rhinitis\r\nControls congestion, sneezing, itching and runny nose associated with seasonal allergens.\r\n\r\nPerennial Allergic Rhinitis\r\nControls persistent nasal allergy symptoms associated with year-round allergens.',
          'Dosing and Schedule\r\nChildren aged 6–11 years: use 1 spray in each nostril once daily (total 55 mcg/day). Adolescents and adults: 2 sprays per nostril once daily.\r\n\r\nAdministration Advice\r\nShake and prime according to device instructions. Gently blow nose, tilt head forward and spray away from nasal septum.',
          '01 — Activates Local Glucocorticoid Receptors\r\nFluticasone furoate binds glucocorticoid receptors in the nasal mucosa.\r\n\r\n02 — Suppresses Allergic Inflammation\r\nReduces inflammatory-cell activity and the release of inflammatory mediators.\r\n\r\n03 — Improves Nasal Symptoms\r\nReduced swelling and irritation relieve congestion, discharge and sneezing.',
          'Nasal Bleeding and Healing\r\nReport persistent nosebleeds. Recent nasal trauma or surgery requires medical assessment.\r\n\r\nGrowth Monitoring\r\nUse lowest effective dose. Long-term paediatric use requires growth tracking.\r\n\r\nInteractions\r\nReview strong CYP3A4 inhibitors (ritonavir, ketoconazole).',
          '120 Metered Sprays',
          'flutiriv.png',
        ],
      ],
    },
    {
      name: 'Ortheon',
      rows: [
        [
          1,
          'Glypocal™-LP Tablets',
          'Elemental Liposomal Calcium (Tribasic Phosphate) 500 mg + Vitamin D2 600 IU Tablets',
          'Nutraceutical',
          'Glypocal™-LP Tablets provide elemental calcium with vitamin D2 to support bone mineralisation and daily calcium intake. Calcium contributes to normal bone structure and fracture recovery. (Cross-listed from Femme).',
          'Dietary Calcium and Vitamin D Supplementation\r\nHelps meet daily calcium and vitamin D needs in orthopaedic care.\r\n\r\nBone Health and Mineralisation Support\r\nSupports bone mineral density and fracture healing as part of nutritional bone care.',
          'Dosing and Schedule\r\nTake 1 tablet daily, or as advised by your healthcare professional.\r\n\r\nAdministration Advice\r\nTake with or immediately after a meal to aid absorption and reduce digestive discomfort.',
          '01 — Delivers Elemental Calcium\r\nCalcium phosphate provides elemental calcium for the mineral matrix of bone.\r\n\r\n02 — Liposomal Delivery\r\nLiposomal carrier systems enhance dispersion and intestinal uptake.\r\n\r\n03 — Facilitates Calcium Absorption\r\nVitamin D2 promotes active transport of calcium across the intestinal epithelium.',
          'Kidney Stones and Hypercalcaemia\r\nAvoid in individuals with hypercalcaemia or calcium-containing kidney stones.\r\n\r\nMedicine Absorption\r\nSeparate by at least 2 hours from iron supplements, thyroid hormones and bisphosphonates.',
          '10 x 10 Tablets',
          'glypocal-lp.png',
        ],
        [
          2,
          'Fracway™',
          'Cissus quadrangularis extract 500 mg + Collagen peptide 100 mg + L-arginine 200 mg + Vitamin C 50 mg + Vitamin K2-7 45 mcg Tablets',
          'Nutraceutical',
          'Fracway™ combines Cissus quadrangularis extract, collagen peptides, L-arginine, vitamin C and vitamin K2 for bone and connective-tissue nutritional support. Vitamin C contributes to normal collagen formation, while vitamin K supports bone-protein functions.',
          'Nutrition during Fracture Recovery\r\nComplements adequate dietary intake and prescribed fracture care with bone- and connective-tissue-related nutrients.\r\n\r\nBone and Connective-Tissue Nutritional Support\r\nProvides supplemental collagen peptides, amino acids and vitamins involved in normal structural tissue functions.',
          'Dosing and Schedule\r\nAdults: take 1 tablet once daily. Review duration against the identified nutritional need.\r\n\r\nAdministration Advice\r\nTake with or immediately after a meal. Review continued use with treating clinician.',
          '01 — Provides Connective-Tissue Nutrients\r\nCollagen peptides and arginine supply nutritional substrates, while vitamin C supports collagen synthesis.\r\n\r\n02 — Supports Vitamin K-Dependent Proteins\r\nVitamin K2 participates in activation of osteocalcin involved in bone physiology.\r\n\r\n03 — Botanical Synergy\r\nCissus quadrangularis complements musculoskeletal nutritional support.',
          'Vitamin K and Anticoagulants\r\nVitamin K2 can interfere with warfarin. Use only after anticoagulation review.\r\n\r\nAllergy and Source\r\nConfirm collagen source and avoid with relevant animal-protein allergy.',
          '10 x 10 Tablets',
          'fracway.png',
        ],
      ],
    },
    {
      name: 'Neurix',
      rows: [
        [
          1,
          'Nervia™',
          'Methylcobalamin 2500 mcg Injection',
          'Drug',
          'Nervia™ provides methylcobalamin, an active form of vitamin B12, in an injectable preparation for vitamin B12 replacement. Vitamin B12 is required for normal red blood cell formation, DNA synthesis and nerve function.',
          'Vitamin B12 Deficiency\r\nReplenishes vitamin B12 and supports restoration of normal B12 status.\r\n\r\nDeficiency-Related Blood and Nerve Changes\r\nSupports correction of B12-related megaloblastic anaemia and peripheral neuropathy.',
          'Dosing and Schedule\r\nAdministered by a doctor or qualified nurse via intramuscular or intravenous route as prescribed.\r\n\r\nAdministration Advice\r\nA healthcare professional should administer by approved route. Do not self-inject.',
          '01 — Provides Active Vitamin B12\r\nMethylcobalamin supplies a physiologically active coenzyme form of B12.\r\n\r\n02 — Supports Methylation Pathways\r\nParticipates in methionine synthesis and linked folate metabolism.\r\n\r\n03 — Supports Myelin Maintenance\r\nAdequate B12 supports normal red cell formation and myelin sheath integrity.',
          'Diagnosis Confirmation\r\nConfirm etiology of deficiency. Investigate neurological symptoms promptly.\r\n\r\nAllergy and Monitoring\r\nAvoid with known cobalamin or cobalt allergy. Monitor response.',
          '5 x 2 mL Ampoules',
          'nervia.png',
        ],
      ],
    },
    {
      name: 'Eyrix',
      rows: [
        [
          1,
          'Moxable™',
          'Moxifloxacin 0.5% w/v Eye Drops',
          'Drug',
          'Moxable™ contains moxifloxacin, a fluoroquinolone antibiotic in eye-drop form for bacterial conjunctivitis. It inhibits bacterial enzymes needed for DNA replication and acts against susceptible ocular pathogens.',
          'Bacterial Conjunctivitis\r\nTreats conjunctival infection caused by susceptible gram-positive and gram-negative pathogens.\r\n\r\nOcular Infection Control\r\nResolves discharge, redness, and corneal inflammation during prescribed ophthalmic course.',
          'Dosing and Schedule\r\nInstil 1 drop into each affected eye three times daily for 7 days.\r\n\r\nAdministration Advice\r\nWash hands, pull down lower lid and instil drop without touching tip to eye. Separate other ocular medications by 5 minutes.',
          '01 — Topical Ocular Delivery\r\nMoxifloxacin acts locally against susceptible bacteria at ocular surface.\r\n\r\n02 — Inhibits Bacterial DNA Enzymes\r\nInhibits DNA gyrase and topoisomerase IV required for bacterial replication.\r\n\r\n03 — Bactericidal Action\r\nInterrupted DNA replication and repair leads to rapid pathogen death.',
          'Sterility and Contamination\r\nDo not touch dropper tip to eyelashes or fingers. Discard 1 month after opening.\r\n\r\nContact Lenses\r\nDo not wear contact lenses during active eye infection.',
          '5 mL Eye Drops',
          'moxable.png',
        ],
      ],
    },
    {
      name: 'Vellis',
      rows: [
        [
          1,
          'Melacore™',
          'Hydroquinone 2% + Mometasone 0.1% + Tretinoin 0.025% Cream',
          'Drug',
          'Melacore™ combines hydroquinone, tretinoin and mometasone for short-term treatment of facial melasma under dermatological supervision. Hydroquinone reduces melanin production, tretinoin promotes epidermal turnover, and mometasone controls inflammation.',
          'Moderate to Severe Melasma\r\nShort-term treatment of facial hyperpigmentation and melasma patches under specialist dermatological care.\r\n\r\nEpidermal Pigmentation Control\r\nEnhances stratum corneum renewal while inhibiting new pigment formation.',
          'Dosing and Schedule\r\nApply a small pea-sized amount lightly to pigmented areas once daily at bedtime.\r\n\r\nAdministration Advice\r\nWash face gently and let skin dry completely before application. Use broad-spectrum sunscreen (SPF 50+) daily during and after therapy.',
          '01 — Inhibits Tyrosinase Activity\r\nHydroquinone interferes with melanocyte melanin synthesis.\r\n\r\n02 — Promotes Keratinocyte Turnover\r\nTretinoin increases epidermal cell turnover and disperses melanin clumps.\r\n\r\n03 — Suppresses Corticoid Inflammation\r\nMometasone controls skin irritation and erythema during short-term therapy.',
          'Pregnancy Contraindication\r\nStrictly contraindicated in pregnancy or while planning pregnancy due to tretinoin.\r\n\r\nDuration Limits\r\nUse for short-term courses only (max 6-8 weeks) to prevent steroid thinning or ochronosis.\r\n\r\nSun Protection\r\nStrict sun avoidance and daily sunscreen are mandatory.',
          '15 g Tube',
          'melacore.png',
        ],
      ],
    },
    {
      name: 'Otira',
      rows: [
        [
          1,
          'Flutiriv™',
          'Fluticasone furoate 27.5 mcg per metered nasal spray',
          'Drug',
          'Flutiriv™ contains fluticasone furoate in a metered nasal spray for allergic rhinitis. It acts locally in the nasal lining to reduce allergic inflammation and relieve congestion, sneezing, itching and discharge. (Cross-listed from Pediaplus).',
          'Seasonal Allergic Rhinitis\r\nControls congestion, sneezing, itching and runny nose associated with seasonal allergens.\r\n\r\nPerennial Allergic Rhinitis\r\nControls persistent nasal allergy symptoms associated with year-round allergens.',
          'Dosing and Schedule\r\nAdults & adolescents 12+: 2 sprays in each nostril once daily (110 mcg/day); reduce to 1 spray per nostril daily once controlled.\r\n\r\nAdministration Advice\r\nShake and prime device before first use. Gently blow nose, tilt head forward and aim away from septum.',
          '01 — Glucocorticoid Receptor Activation\r\nFluticasone furoate binds local nasal glucocorticoid receptors with high affinity.\r\n\r\n02 — Anti-Inflammatory Cascade\r\nInhibits inflammatory mediator release from mast cells and eosinophils.\r\n\r\n03 — Sustained Symptom Relief\r\nProvides 24-hour relief from nasal obstruction, rhinorrhea, and sneezing.',
          'Epistaxis Precaution\r\nReport persistent nosebleeds. Avoid use in unhealed nasal mucosal trauma.\r\n\r\nRegular Administration\r\nUse daily for continuous symptom prevention, not as an on-demand rescue spray.',
          '120 Metered Sprays',
          'flutiriv.png',
        ],
      ],
    },
    {
      name: 'Omnara',
      rows: [
        [
          1,
          'Stomazo™-D',
          'Esomeprazole 40 mg + domperidone 30 mg sustained release per capsule',
          'Drug',
          'Stomazo™-D combines esomeprazole with domperidone for prescribed management of reflux associated with regurgitation, nausea and upper gastrointestinal motility symptoms. Esomeprazole reduces gastric acid secretion, while domperidone promotes upper digestive tract movement.',
          'Reflux with Regurgitation\r\nManagement of acid reflux accompanied by regurgitation and upper gastrointestinal motility symptoms.\r\n\r\nReflux-Associated Nausea\r\nRelieves nausea accompanying reflux through combined acid suppression and prokinetic activity.',
          'Dosing and Schedule\r\nAdults: take 1 capsule once daily before breakfast. Supplies 30 mg daily domperidone dose. Use for shortest necessary period and review within 7 days.\r\n\r\nAdministration Advice\r\nSwallow whole with water 30 minutes before breakfast. Do not crush, chew or combine with other domperidone formulations.',
          '01 — Suppresses Gastric Acid\r\nEsomeprazole irreversibly inhibits the H+/K+-ATPase proton pump.\r\n\r\n02 — Enhances Upper GI Motility\r\nDomperidone blocks peripheral dopamine D2 receptors in the gastrointestinal tract.\r\n\r\n03 — Accelerates Gastric Emptying\r\nCoordinated motility reduces gastric volume available for esophageal reflux.',
          'Cardiac Risk and QT Interval\r\nDomperidone may cause rhythm disturbances. Avoid in patients with prolonged QT or significant heart disease.\r\n\r\nTreatment Duration\r\nReview therapy within 7 days. Avoid prolonged continuous prokinetic use.\r\n\r\nAlarm Symptoms\r\nInvestigate dysphagia, weight loss, or vomiting blood before initiating therapy.',
          '10 x 10 Capsules',
          'stomazo-d.png',
        ],
        [
          2,
          'Stomazo™-40',
          'Esomeprazole 40 mg Tablets',
          'Drug',
          'Stomazo™-40 contains esomeprazole, a proton pump inhibitor that reduces stomach acid secretion. By inhibiting the gastric proton pump, it relieves acid-related heartburn and regurgitation and supports healing of inflamed oesophageal, gastric and duodenal lining.',
          'Gastro-Oesophageal Reflux Disease\r\nRelieves acid-related heartburn and regurgitation and treats reflux oesophagitis.\r\n\r\nPeptic Ulcer Disease\r\nSupports healing of gastric and duodenal ulcers through suppression of stomach acid.',
          'Dosing and Schedule\r\nAdults: take 1 tablet (40 mg) once daily for 4 to 8 weeks according to clinical healing.\r\n\r\nAdministration Advice\r\nSwallow tablet whole with water at least 1 hour before breakfast. Do not crush or chew gastro-resistant tablet.',
          '01 — Acid-Activated Prodrug\r\nEsomeprazole accumulates and converts to active sulfenamide in acidic parietal cell canaliculi.\r\n\r\n02 — Covalent Proton Pump Inhibition\r\nBinds H+/K+-ATPase enzyme to block final step of acid secretion.\r\n\r\n03 — Mucosal Healing\r\nMaintains intragastric pH > 4 to facilitate mucosal tissue repair.',
          'Alarm Symptoms\r\nUnexplained weight loss, persistent vomiting, or gastrointestinal bleeding require urgent investigation.\r\n\r\nBone Fracture and Magnesium\r\nProlonged high-dose therapy may increase risk of hypomagnesemia and hip fractures.',
          '10 x 10 Tablets',
          'stomazo-40.png',
        ],
      ],
    },
    {
      name: 'Cytos',
      rows: [
        [
          1,
          'Curajoy™ Q10',
          'Curcuma longa 125 mg + nanocurcuminoids 10% + coenzyme Q10 50 mg in water-soluble syrup',
          'Nutraceutical',
          'Curajoy™ Q10 combines curcuma-derived ingredients with coenzyme Q10 in a water-soluble syrup for antioxidant nutritional support. Curcuminoids supply plant-derived antioxidant compounds, while coenzyme Q10 participates in mitochondrial energy production.',
          'Antioxidant Nutritional Supplementation\r\nProvides antioxidant ingredients to complement dietary intake.\r\n\r\nGeneral Nutritional Support\r\nComplements a balanced diet within an individual oncology nutritional-care programme.',
          'Dosing and Schedule\r\nTake in the dose and duration advised by your doctor.\r\n\r\nAdministration Advice\r\nMeasure prescribed serving with calibrated device. Shake well before use. Obtain oncology team approval during active therapy.',
          '01 — Supplies Plant-Derived Antioxidants\r\nNanocurcuminoids provide bio-available botanical antioxidant polyphenols.\r\n\r\n02 — Supports Mitochondrial Respiration\r\nCoenzyme Q10 participates in cellular ATP electron transport chain.\r\n\r\n03 — Cellular Protection\r\nHelps quench reactive oxygen species generated during metabolic stress.',
          'Oncology Team Approval\r\nConsult the oncologist before use during chemotherapy, radiation or immunotherapy.\r\n\r\nBleeding Risk\r\nReview concurrent anticoagulants or antiplatelet agents before major surgery.',
          '100 mL Syrup',
          'curajoy-q10.png',
        ],
        [
          2,
          'Gemcore™',
          'Gemcitabine 200 mg / 1 g Injection',
          'Drug',
          'Gemcore™ contains gemcitabine, an intravenous antimetabolite used in cancer chemotherapy. Its active metabolites interfere with DNA synthesis and limit the multiplication of cancer cells in oncologist-directed regimens.',
          'Pancreatic and Non-Small Cell Lung Cancer\r\nPrescribed antineoplastic chemotherapy for pancreatic, lung, breast and ovarian malignancies.\r\n\r\nCombination Oncology Regimens\r\nUsed in specialized oncologist-directed chemotherapy protocols.',
          'Dosing and Schedule\r\nDosage strictly calculated by body surface area (BSA) and toxicity parameters. Administer via 30-minute IV infusion.\r\n\r\nAdministration Advice\r\nFor intravenous infusion only under oncologist supervision in specialized oncology facility. Cytotoxic handling precautions mandatory.',
          '01 — Cellular Uptake and Phosphorylation\r\nConverted by deoxycytidine kinase to active diphosphate and triphosphate nucleotides.\r\n\r\n02 — Ribonucleotide Reductase Inhibition\r\nInhibits ribonucleotide reductase, depleting deoxynucleotide pools.\r\n\r\n03 — Masked DNA Termination\r\nIncorporation into nascent DNA chains causes irreversible chain termination.',
          'Myelosuppression Monitoring\r\nRoutine CBC monitoring required. Report fever, infection or unexplained bruising immediately.\r\n\r\nHepatic and Renal Monitoring\r\nMonitor organ function regularly during treatment cycles.',
          '1 Vial (1 g)',
          'gemcore.png',
        ],
      ],
    },
  ];

  for (const div of divisionSamples) {
    const sheetData = [headers, ...div.rows];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, div.name);
  }

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Processes an uploaded Excel file and an optional ZIP of images,
 * populating `products`, `product_therapeutic_areas`, and related child tables.
 */
export async function processCatalogImport({ excelBuffer, zipBuffer, mode = 'merge' }) {
  if (!excelBuffer) {
    throw new Error('Excel file buffer is required for catalog import.');
  }

  const uploadDirs = getUploadDirectories();
  const primaryUploadDir = uploadDirs[0] || path.resolve(__dirname, '..', 'uploads');

  // Step 1: Extract Images from ZIP if provided
  const imageMap = new Map(); // normalizedKey -> publicUrl

  if (zipBuffer && zipBuffer.length > 0) {
    try {
      const zip = new AdmZip(zipBuffer);
      const zipEntries = zip.getEntries();

      for (const entry of zipEntries) {
        if (entry.isDirectory) continue;
        const entryName = entry.entryName;
        const ext = path.extname(entryName).toLowerCase();
        if (!['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) continue;

        const baseFilename = path.basename(entryName);
        const nameWithoutExt = path.basename(entryName, ext);
        const safeBaseName = normalizeSlug(nameWithoutExt);
        const finalFilename = `${safeBaseName}${ext}`;
        const data = entry.getData();

        // Write to all accessible upload directories
        for (const dir of uploadDirs) {
          try {
            const destPath = path.join(dir, finalFilename);
            fs.writeFileSync(destPath, data);
          } catch (e) {
            console.warn(`Failed writing zip image to ${dir}:`, e.message);
          }
        }

        const publicUrl = `/uploads/${finalFilename}`;
        // Store multiple lookup keys for flexible matching
        imageMap.set(baseFilename.toLowerCase(), publicUrl);
        imageMap.set(nameWithoutExt.toLowerCase(), publicUrl);
        imageMap.set(safeBaseName, publicUrl);
        imageMap.set(normalizeKey(nameWithoutExt), publicUrl);
      }
    } catch (zipError) {
      console.error('Error processing ZIP file:', zipError);
      throw new Error(`Failed to extract images ZIP: ${zipError.message}`);
    }
  }

  // Step 2: Parse Excel sheets
  const wb = XLSX.read(excelBuffer, { type: 'buffer' });
  const sheetNames = wb.SheetNames;

  const aggregatedProducts = new Map(); // slug -> product object
  let totalRowsRead = 0;

  for (const rawSheetName of sheetNames) {
    const cleanSheetKey = rawSheetName.toLowerCase().trim().replace(/[-_]/g, ' ');
    // Skip instruction / overview sheets
    if (
      cleanSheetKey.includes('instruction') ||
      cleanSheetKey.includes('readme') ||
      cleanSheetKey.includes('guide') ||
      cleanSheetKey.includes('summary') ||
      cleanSheetKey.includes('overview')
    ) {
      continue;
    }

    // Match division
    const areaInfo = DIVISION_MAP[cleanSheetKey] || DIVISION_MAP[rawSheetName.toLowerCase().trim()];
    if (!areaInfo) {
      console.warn(`[Import] Skipping unrecognized sheet "${rawSheetName}". Use standard division names like Femme, Ortheon, etc.`);
      continue;
    }

    const ws = wb.Sheets[rawSheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      totalRowsRead++;

      // Flexible column resolution matching Client Master Spreadsheet and Admin Product Form
      const brand = (
        row['Brand Name'] ||
        row['Product Name'] ||
        row['Brand'] ||
        row['Name'] ||
        row['brand_name'] ||
        row['product_name'] ||
        ''
      ).toString().trim();

      if (!brand || brand.toLowerCase() === 'brand name' || brand.toLowerCase().startsWith('example')) {
        continue;
      }

      const slug = normalizeSlug(brand);
      if (!slug) continue;

      const composition = (
        row['Composition'] ||
        row['Active Composition'] ||
        row['Formula'] ||
        row['Generic Name'] ||
        row['Salt'] ||
        row['composition'] ||
        ''
      ).toString().trim();

      const productType = (
        row['Drug/Nutraceutical/Cosmetic'] ||
        row['Classification'] ||
        row['Product Type'] ||
        row['Category'] ||
        row['Drug/Nutraceutical'] ||
        'Drug'
      ).toString().trim();

      const packSize = (
        row['Pack Size / Dosage Form'] ||
        row['Pack Size'] ||
        row['Packaging'] ||
        row['Dosage Form'] ||
        row['Form'] ||
        row['pack_size'] ||
        ''
      ).toString().trim();

      const shortDesc = (
        row['A Brief Description'] ||
        row['Brief Description'] ||
        row['Short Description / Indications'] ||
        row['Short Description'] ||
        row['Summary'] ||
        row['Description'] ||
        row['short_description'] ||
        ''
      ).toString().trim();

      const indication = (
        row['Indication'] ||
        row['Indications'] ||
        row['Key Benefits'] ||
        row['Benefits'] ||
        row['benefits'] ||
        ''
      ).toString().trim();

      const dosage = (
        row['Administration and Dosage Guidance'] ||
        row['Dosage Guidance'] ||
        row['Dosage'] ||
        row['Administration'] ||
        row['dosage'] ||
        ''
      ).toString().trim();

      const mechanism = (
        row['Mechanism of Action'] ||
        row['Detailed Monograph'] ||
        row['Mechanism'] ||
        row['Pharmacology'] ||
        row['Monograph'] ||
        row['mechanism'] ||
        ''
      ).toString().trim();

      const safety = (
        row['Safety and Precautions'] ||
        row['Safety Information'] ||
        row['Precautions'] ||
        row['Safety'] ||
        row['Contraindications'] ||
        row['safety'] ||
        ''
      ).toString().trim();

      const explicitImage = (
        row['Image File Name'] ||
        row['Image'] ||
        row['Packshot'] ||
        row['Photo'] ||
        row['image'] ||
        ''
      ).toString().trim();

      // Resolve Packshot Image
      let packshotUrl = null;

      // 1. Check explicit image column against ZIP
      if (explicitImage) {
        const cleanExplicit = explicitImage.toLowerCase().trim();
        packshotUrl =
          imageMap.get(cleanExplicit) ||
          imageMap.get(path.basename(cleanExplicit, path.extname(cleanExplicit))) ||
          imageMap.get(normalizeSlug(cleanExplicit)) ||
          imageMap.get(normalizeKey(cleanExplicit));

        // If explicit was already a full path like /assets/products/xyz.png or http
        if (!packshotUrl && (cleanExplicit.startsWith('/') || cleanExplicit.startsWith('http'))) {
          packshotUrl = explicitImage;
        }
      }

      // 2. Check brand slug against ZIP
      if (!packshotUrl) {
        packshotUrl =
          imageMap.get(slug) ||
          imageMap.get(`${slug}.png`) ||
          imageMap.get(`${slug}.jpg`) ||
          imageMap.get(`${slug}.jpeg`) ||
          imageMap.get(normalizeKey(brand));
      }

      // 3. Check existing files in public/assets/products or uploads
      if (!packshotUrl) {
        const candidateExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
        const searchDirs = [
          path.resolve(__dirname, '..', '..', 'public', 'assets', 'products'),
          primaryUploadDir,
        ];

        for (const dir of searchDirs) {
          for (const ext of candidateExtensions) {
            const checkFile = path.join(dir, `${slug}${ext}`);
            if (fs.existsSync(checkFile)) {
              packshotUrl = dir.includes('public')
                ? `/assets/products/${slug}${ext}`
                : `/uploads/${slug}${ext}`;
              break;
            }
          }
          if (packshotUrl) break;
        }
      }

      // Multi-Category Aggregation
      if (aggregatedProducts.has(slug)) {
        const existing = aggregatedProducts.get(slug);
        if (!existing.therapeutic_area_ids.includes(areaInfo.id)) {
          existing.therapeutic_area_ids.push(areaInfo.id);
          existing.categories.push(areaInfo.slug);
          existing.specialty_sheets.push(rawSheetName);
        }
        // Fill in missing fields if earlier sheet didn't have them
        if (!existing.composition && composition) existing.composition = composition;
        if (!existing.product_type && productType) existing.product_type = productType;
        if (!existing.pack_size && packSize) existing.pack_size = packSize;
        if (!existing.short_description && shortDesc) existing.short_description = shortDesc;
        if (!existing.indication && indication) existing.indication = indication;
        if (!existing.dosage && dosage) existing.dosage = dosage;
        if (!existing.mechanism && mechanism) existing.mechanism = mechanism;
        if (!existing.safety && safety) existing.safety = safety;
        if (!existing.packshot_url && packshotUrl) existing.packshot_url = packshotUrl;
      } else {
        aggregatedProducts.set(slug, {
          brand_name: brand,
          slug,
          primary_therapeutic_area_id: areaInfo.id,
          therapeutic_area_ids: [areaInfo.id],
          categories: [areaInfo.slug],
          specialty_sheets: [rawSheetName],
          composition,
          product_type: productType || 'Drug',
          pack_size: packSize,
          short_description: shortDesc,
          indication,
          dosage,
          mechanism,
          safety,
          packshot_url: packshotUrl || null,
        });
      }
    }
  }

  if (aggregatedProducts.size === 0) {
    throw new Error('No valid products found in the uploaded workbook. Please check sheet names and headers.');
  }

  // Step 3: Database Synchronization
  if (mode === 'replace') {
    // Clean wipe for full replacement
    await query('TRUNCATE TABLE product_compositions');
    await query('TRUNCATE TABLE product_benefits');
    await query('TRUNCATE TABLE product_dosage');
    await query('TRUNCATE TABLE product_mechanisms');
    await query('TRUNCATE TABLE product_safety_sections');
    await query('TRUNCATE TABLE product_images');
    await query('TRUNCATE TABLE product_therapeutic_areas');
    await query('DELETE FROM products');
  }

  let createdCount = 0;
  let updatedCount = 0;
  let multiSpecialtyCount = 0;
  let imageLinkedCount = 0;
  const missingImagesList = [];

  let orderIndex = 1;

  for (const [slug, item] of aggregatedProducts) {
    if (item.therapeutic_area_ids.length > 1) {
      multiSpecialtyCount++;
    }

    if (item.packshot_url) {
      imageLinkedCount++;
    } else {
      missingImagesList.push({
        brand_name: item.brand_name,
        slug: item.slug,
        sheets: item.specialty_sheets.join(', '),
      });
    }

    // Check if product already exists in database
    const existingRows = await query('SELECT id FROM products WHERE slug = ? LIMIT 1', [slug]);

    let productId;

    const shortDescVal = (item.short_description || item.composition || '').trim() || null;
    const fullDescVal = (item.short_description || item.composition || '').trim() || null;
    const dosageFormVal = (item.pack_size || '').trim() || null;
    const taglineVal = (item.product_type || '').trim() || null;
    const compSummaryVal = (item.composition || '').trim() || null;
    const packshotVal = item.packshot_url || null;

    if (existingRows && existingRows.length > 0) {
      productId = existingRows[0].id;
      updatedCount++;

      // Update existing record with full specifications (avoid MySQL NULLIF collation conflict)
      await query(
        `UPDATE products SET
           brand_name = ?,
           therapeutic_area_id = ?,
           short_description = COALESCE(?, short_description),
           full_description = COALESCE(?, full_description),
           dosage_form = COALESCE(?, dosage_form),
           tagline = COALESCE(?, tagline),
           composition_summary = COALESCE(?, composition_summary),
           packshot_url = COALESCE(?, packshot_url),
           status = 'published',
           updated_at = NOW()
         WHERE id = ?`,
        [
          item.brand_name,
          item.primary_therapeutic_area_id,
          shortDescVal,
          fullDescVal,
          dosageFormVal,
          taglineVal,
          compSummaryVal,
          packshotVal,
          productId,
        ]
      );
    } else {
      createdCount++;
      // Insert new product
      const insertResult = await query(
        `INSERT INTO products (
           therapeutic_area_id, brand_name, slug, short_description, full_description,
           dosage_form, tagline, composition_summary, packshot_url, status, display_order, seo_title, seo_description
         )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?)`,
        [
          item.primary_therapeutic_area_id,
          item.brand_name,
          slug,
          item.short_description || item.composition || '',
          item.short_description || item.composition || '',
          item.pack_size || '',
          item.product_type || 'Drug',
          item.composition || '',
          packshotVal,
          orderIndex++,
          `${item.brand_name} | Onecore Pharma`,
          item.short_description || `${item.brand_name} clinical formulation`,
        ]
      );
      productId = insertResult.insertId;
    }

    // 1. Update product_therapeutic_areas junction table
    await query('DELETE FROM product_therapeutic_areas WHERE product_id = ?', [productId]);
    for (const tid of item.therapeutic_area_ids) {
      await query(
        `INSERT INTO product_therapeutic_areas (product_id, therapeutic_area_id, display_order)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE display_order = VALUES(display_order)`,
        [productId, tid, orderIndex]
      );
    }

    // 2. Composition Ingredients
    if (item.composition) {
      await query('DELETE FROM product_compositions WHERE product_id = ?', [productId]);
      await query(
        `INSERT INTO product_compositions (product_id, ingredient_name, strength, display_order)
         VALUES (?, ?, '', 1)`,
        [productId, item.composition]
      );
    }

    // 3. Administration and Dosage Guidance
    if (item.dosage) {
      await query('DELETE FROM product_dosage WHERE product_id = ?', [productId]);
      await query(
        `INSERT INTO product_dosage (product_id, heading, description)
         VALUES (?, 'Administration and Dosage Guidance', ?)`,
        [productId, item.dosage]
      );
    }

    // 4. Clinical Indications / Benefits
    const benefits = parsePairedSections(item.indication);
    if (benefits.length > 0) {
      await query('DELETE FROM product_benefits WHERE product_id = ?', [productId]);
      let bOrder = 1;
      for (const b of benefits) {
        await query(
          `INSERT INTO product_benefits (product_id, title, description, display_order)
           VALUES (?, ?, ?, ?)`,
          [productId, b.title, b.description, bOrder++]
        );
      }
    } else if (item.short_description) {
      await query('DELETE FROM product_benefits WHERE product_id = ?', [productId]);
      await query(
        `INSERT INTO product_benefits (product_id, title, description, display_order)
         VALUES (?, 'Clinical Indication', ?, 1)`,
        [productId, item.short_description]
      );
    }

    // 5. Mechanism of Action
    const mechanisms = parseMechanisms(item.mechanism);
    if (mechanisms.length > 0) {
      await query('DELETE FROM product_mechanisms WHERE product_id = ?', [productId]);
      let mOrder = 1;
      for (const m of mechanisms) {
        await query(
          `INSERT INTO product_mechanisms (product_id, title, description, display_order)
           VALUES (?, ?, ?, ?)`,
          [productId, m.title, m.description, mOrder++]
        );
      }
    }

    // 6. Safety Information and Precautions
    const safetySections = parseSafetySections(item.safety);
    if (safetySections.length > 0) {
      await query('DELETE FROM product_safety_sections WHERE product_id = ?', [productId]);
      let sOrder = 1;
      for (const s of safetySections) {
        await query(
          `INSERT INTO product_safety_sections (product_id, section_key, title, description, display_order)
           VALUES (?, ?, ?, ?, ?)`,
          [productId, s.section_key, s.title, s.description, sOrder++]
        );
      }
    }

    // 7. Gallery Packshot Photo
    if (item.packshot_url) {
      await query('DELETE FROM product_images WHERE product_id = ?', [productId]);
      await query(
        `INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
         VALUES (?, ?, ?, 1, 1)`,
        [productId, item.packshot_url, item.brand_name]
      );
    }
  }

  // Calculate total division listings
  let totalListings = 0;
  for (const item of aggregatedProducts.values()) {
    totalListings += item.therapeutic_area_ids.length;
  }

  return {
    success: true,
    totalUniqueProducts: aggregatedProducts.size,
    totalDivisionListings: totalListings,
    createdCount,
    updatedCount,
    multiSpecialtyCount,
    imageLinkedCount,
    missingImagesCount: missingImagesList.length,
    missingImages: missingImagesList,
  };
}
