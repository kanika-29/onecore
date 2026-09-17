import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'onecore_pharma',
  multipleStatements: true,
};

async function syncCms() {
  console.log('🔄 Starting Onecore Pharma CMS Database Synchronization...');

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database `onecore_pharma`');

    // 1. Ensure required columns exist in `page_sections`
    const ensureColumn = async (colName, colDef) => {
      const [cols] = await connection.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'page_sections' AND COLUMN_NAME = ?
      `, [dbConfig.database, colName]);

      if (cols.length === 0) {
        console.log(`➕ Adding \`${colName}\` column to \`page_sections\`...`);
        await connection.query(`ALTER TABLE page_sections ADD COLUMN ${colDef}`);
      }
    };

    await ensureColumn('items_json', 'items_json LONGTEXT NULL AFTER body');
    await ensureColumn('secondary_cta_text', 'secondary_cta_text VARCHAR(100) NULL AFTER cta_url');
    await ensureColumn('secondary_cta_url', 'secondary_cta_url VARCHAR(255) NULL AFTER secondary_cta_text');

    // 2. Ensure pages exist
    const pages = [
      {
        page_key: 'home',
        title: 'Home',
        slug: '/',
        status: 'published',
        seo_title: 'Onecore Pharma — Purposeful Formulations, Dependable Quality',
        seo_description: 'Onecore Pharma is a modern pharmaceutical company developing purposeful formulations and healthcare solutions centered on patients and healthcare professionals.'
      },
      {
        page_key: 'about',
        title: 'About Onecore',
        slug: '/about',
        status: 'published',
        seo_title: 'About Us | Onecore Pharma',
        seo_description: 'Learn about Onecore Pharma, our foundational principles, disciplined pharmaceutical development and commitment to dependable healthcare.'
      },
      {
        page_key: 'patients-caregivers',
        title: 'Patients & Caregivers',
        slug: '/patients-caregivers',
        status: 'published',
        seo_title: 'Patients & Caregivers | Onecore Pharma',
        seo_description: 'Resources and factual medicine information for patients and caregivers navigating treatment with Onecore formulations.'
      },
      {
        page_key: 'healthcare-professionals',
        title: 'Healthcare Professionals',
        slug: '/healthcare-professionals',
        status: 'published',
        seo_title: 'Healthcare Professionals | Onecore Pharma',
        seo_description: 'Scientific information, clinical dialogue and medical data for doctors and healthcare professionals.'
      },
      {
        page_key: 'quality-manufacturing',
        title: 'Quality & Manufacturing',
        slug: '/quality-manufacturing',
        status: 'published',
        seo_title: 'Quality & Manufacturing | Onecore Pharma',
        seo_description: 'Quality built into every stage of the product journey at Onecore Pharma. Controlled processes, dependable standards and responsible release.'
      },
      {
        page_key: 'areas-of-care',
        title: 'Therapeutic Areas',
        slug: '/areas-of-care',
        status: 'published',
        seo_title: 'Therapeutic Areas | Onecore Pharma',
        seo_description: 'Explore the therapeutic areas and healthcare needs represented across the Onecore Pharma portfolio.'
      },
      {
        page_key: 'contact',
        title: 'Contact',
        slug: '/contact',
        status: 'published',
        seo_title: 'Contact Us | Onecore Pharma',
        seo_description: 'Get in touch with Onecore Pharma for product information, business and distribution enquiries, careers and general company communication.'
      },
      {
        page_key: 'news',
        title: 'News & Perspectives',
        slug: '/news',
        status: 'published',
        seo_title: 'News & Perspectives | Onecore Pharma',
        seo_description: 'Insights, clinical updates and formulation perspectives from Onecore Pharma.'
      }
    ];

    for (const page of pages) {
      await connection.query(`
        INSERT INTO pages (page_key, title, slug, status, seo_title, seo_description)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          slug = VALUES(slug),
          status = VALUES(status),
          seo_title = VALUES(seo_title),
          seo_description = VALUES(seo_description)
      `, [page.page_key, page.title, page.slug, page.status, page.seo_title, page.seo_description]);
    }
    console.log('✅ Pages registered in CMS.');

    // Fetch page IDs map
    const [dbPages] = await connection.query('SELECT id, page_key FROM pages');
    const pageIdMap = {};
    dbPages.forEach(p => { pageIdMap[p.page_key] = p.id; });

    // =========================================================================
    // 3. HOME SECTIONS
    // =========================================================================
    const homeSections = [
      {
        page_id: pageIdMap['home'],
        section_key: 'hero',
        section_type: 'hero',
        eyebrow: 'ABOUT ONECORE',
        heading: 'Healthcare is personal. \nOur approach should be too.',
        subheading: 'Purposeful formulations. Dependable quality.',
        body: 'Onecore Pharma is a pharmaceutical company focused on purposeful formulations, dependable quality and the needs of patients and healthcare professionals.',
        items_json: null,
        cta_text: 'Discover Onecore',
        cta_url: '/about',
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: '/assets/hero-healthcare.jpg',
        display_order: 1,
        is_active: 1,
      },
      {
        page_id: pageIdMap['home'],
        section_key: 'areas_of_care',
        section_type: 'cards_grid',
        eyebrow: 'AREAS OF CARE',
        heading: 'Focused expertise. Purposeful healthcare.',
        subheading: null,
        body: 'Our specialized divisions deliver focused therapies across major medical fields.',
        items_json: null,
        cta_text: 'Explore',
        cta_url: '/areas-of-care',
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 2,
        is_active: 1,
      },
      {
        page_id: pageIdMap['home'],
        section_key: 'our_purpose',
        section_type: 'vision_mission',
        eyebrow: 'OUR PURPOSE',
        heading: 'Improve care through medicines and healthcare solutions that matter.',
        subheading: null,
        body: null,
        items_json: JSON.stringify([
          {
            title: 'OUR VISION',
            desc: 'To be a trusted pharmaceutical company for patients and healthcare professionals across the areas of care we serve.'
          },
          {
            title: 'OUR MISSION',
            desc: 'To develop and deliver purposeful formulations that address real clinical needs, uphold dependable quality and expand responsibly into areas where we can make a meaningful difference.'
          }
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 3,
        is_active: 1,
      },
      {
        page_id: pageIdMap['home'],
        section_key: 'quality_assurance',
        section_type: 'quality_highlight',
        eyebrow: 'QUALITY ASSURANCE',
        heading: 'Quality is part of the product from the beginning.',
        subheading: 'Our approach is centered on qualified manufacturing environments, appropriate quality controls and disciplined review before products reach the market.',
        body: 'Medicines carry responsibility. That is why quality needs to be considered across manufacturing, testing, review and release, not treated as a final checkpoint.',
        items_json: JSON.stringify([
          {
            title: 'Consistent standards',
            desc: 'Quality expectations aligned to the nature and regulatory requirements of each product.'
          },
          {
            title: 'Responsible release',
            desc: 'Review and controls designed to support product consistency and reliability.'
          }
        ]),
        cta_text: 'Quality Standards',
        cta_url: '/quality-manufacturing',
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: '/assets/quality.jpg',
        display_order: 4,
        is_active: 1,
      },
      {
        page_id: pageIdMap['home'],
        section_key: 'sustainability',
        section_type: 'features_columns',
        eyebrow: 'SUSTAINABILITY',
        heading: 'Better health and a healthier future belong together.',
        subheading: null,
        body: 'Our responsibility extends beyond the products we provide. As Onecore grows, we want responsible choices to become part of how we operate, how we source and how we work with our partners.',
        items_json: JSON.stringify([
          {
            eyebrow: 'RESPONSIBLE OPERATIONS',
            title: 'Use resources thoughtfully.',
            desc: 'Work toward more efficient use of energy, water and materials across the operations and manufacturing network that support our products.',
            icon: 'Cpu'
          },
          {
            eyebrow: 'PACKAGING',
            title: 'Reduce what is unnecessary.',
            desc: 'Evaluate packaging choices with the aim of reducing avoidable material use while protecting product quality, safety and stability.',
            icon: 'Leaf'
          },
          {
            eyebrow: 'RESPONSIBLE PARTNERSHIPS',
            title: 'Grow with shared standards.',
            desc: 'Build relationships with partners who share expectations around quality, compliance, ethical conduct and environmental responsibility.',
            icon: 'Users'
          }
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 5,
        is_active: 1,
      },
      {
        page_id: pageIdMap['home'],
        section_key: 'looking_ahead',
        section_type: 'timeline_list',
        eyebrow: 'LOOKING AHEAD',
        heading: 'Building depth. \nExpanding thoughtfully.',
        subheading: null,
        body: 'Our roadmap prioritizes therapeutic rigor, medical dialogue, and disciplined expansion that preserves trust.',
        items_json: JSON.stringify([
          {
            title: 'Deepen therapeutic expertise',
            desc: 'Build stronger portfolios within our core areas of care.'
          },
          {
            title: 'Strengthen medical engagement',
            desc: 'Stay closer to clinical practice and evolving healthcare needs.'
          },
          {
            title: 'Expand thoughtfully',
            desc: 'Enter new areas where the portfolio can add meaningful value.'
          },
          {
            title: 'Grow responsibly',
            desc: 'Strengthen quality, partnerships and sustainable practices as the organisation scales.'
          }
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 6,
        is_active: 1,
      },
      {
        page_id: pageIdMap['home'],
        section_key: 'news_preview',
        section_type: 'editorial',
        eyebrow: 'LATEST FROM ONECORE',
        heading: 'News & perspectives.',
        subheading: null,
        body: null,
        items_json: null,
        cta_text: 'View all news',
        cta_url: '/news',
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 7,
        is_active: 1,
      },
      {
        page_id: pageIdMap['home'],
        section_key: 'final_cta',
        section_type: 'cta_banner',
        eyebrow: null,
        heading: 'Purposeful healthcare, across every area we serve.',
        subheading: null,
        body: 'Explore the therapeutic areas and formulations that make up the Onecore portfolio.',
        items_json: null,
        cta_text: 'Explore areas of care',
        cta_url: '/areas-of-care',
        secondary_cta_text: 'Connect With Us',
        secondary_cta_url: '/contact',
        image_url: null,
        display_order: 8,
        is_active: 1,
      }
    ];

    // =========================================================================
    // 4. ABOUT SECTIONS
    // =========================================================================
    const aboutSections = [
      {
        page_id: pageIdMap['about'],
        section_key: 'hero',
        section_type: 'hero',
        eyebrow: 'ABOUT ONECORE',
        heading: 'Purposeful formulations. Dependable quality. Patient-centered care.',
        subheading: null,
        body: 'Onecore Pharma is built around the belief that modern pharmaceutical science achieves its highest impact when aligned closely with the clinical reality of patients and doctors.',
        items_json: null,
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: '/assets/about-video-poster.jpg',
        display_order: 1,
        is_active: 1,
      },
      {
        page_id: pageIdMap['about'],
        section_key: 'foundation',
        section_type: 'editorial_split',
        eyebrow: 'OUR FOUNDATION',
        heading: 'Our Foundation & Vision',
        subheading: null,
        body: 'At Onecore Pharma, every formulation starts with a distinct clinical question: How can this medicine make treatment more reliable, accessible, and comfortable for the patient?\n\nWe bring together rigorous research, disciplined quality oversight, and ethical supply chain standards across multi-therapeutic disciplines to serve patients and clinicians with dependable healthcare solutions.',
        items_json: JSON.stringify([
          {
            stat: '09+',
            title: 'Therapeutic Specialties',
            desc: 'Comprehensive portfolio addressing clinical nuances across essential therapeutic categories.'
          },
          {
            stat: '100%',
            title: 'Quality Release Protocol',
            desc: 'Multi-tier analytical verification and strict batch release authorization before clinical distribution.'
          }
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: '/assets/about-facility.jpg',
        display_order: 2,
        is_active: 1,
      },
      {
        page_id: pageIdMap['about'],
        section_key: 'principles',
        section_type: 'cards_grid',
        eyebrow: 'FOUNDATIONAL PRINCIPLES',
        heading: 'Principles guiding every decision.',
        subheading: 'A disciplined framework connecting formulation science with clinical trust and everyday care.',
        body: null,
        items_json: JSON.stringify([
          {
            title: 'Clinical Relevance',
            description: 'Focusing formulation research on real-world medical challenges and patient comfort.',
            detail: 'Aligning active pharmaceutical ingredients and delivery formats with physician feedback and daily regimen realities.'
          },
          {
            title: 'Uncompromising Quality',
            description: 'Treating quality as an intrinsic requirement from raw material intake to final market release.',
            detail: 'Adhering to strict cGMP parameters, validated analytical testing, and comprehensive batch traceability.'
          },
          {
            title: 'Responsible Stewardship',
            description: 'Building lasting partnerships and adopting sustainable manufacturing standards.',
            detail: 'Committed to ethical commercial practices, continuous pharmacovigilance, and long-term healthcare integrity.'
          }
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 3,
        is_active: 1,
      },
      {
        page_id: pageIdMap['about'],
        section_key: 'commitments',
        section_type: 'cards_grid',
        eyebrow: 'OUR COMMITMENTS',
        heading: 'Disciplined science, human focus.',
        subheading: 'Connecting clinical insight with dependable pharmaceutical manufacturing to deliver medicines people can trust.',
        body: null,
        items_json: JSON.stringify([
          {
            title: 'Therapeutic Breadth',
            text: 'Developing specialized portfolios across essential medical disciplines including General Medicine, Paediatrics, ENT, Orthopaedics, and Oncology.',
            icon: 'Layers'
          },
          {
            title: 'Formulation Integrity',
            text: 'Every batch is verified through rigorous stability testing, identity verification, and multi-stage analytical checkpoints.',
            icon: 'ShieldCheck'
          },
          {
            title: 'Patient Centricity',
            text: 'Creating clear, transparent product information and reliable supply chains to support continuity in everyday care.',
            icon: 'HeartPulse'
          }
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 4,
        is_active: 1,
      },
      {
        page_id: pageIdMap['about'],
        section_key: 'final_cta',
        section_type: 'cta_banner',
        eyebrow: null,
        heading: 'Explore our therapeutic specialties and quality disciplines.',
        subheading: null,
        body: 'Discover how our formulations serve diverse clinical disciplines with dependable consistency.',
        items_json: null,
        cta_text: 'Areas of Care',
        cta_url: '/areas-of-care',
        secondary_cta_text: 'Quality Standards',
        secondary_cta_url: '/quality-manufacturing',
        image_url: null,
        display_order: 5,
        is_active: 1,
      }
    ];

    // =========================================================================
    // 5. PATIENTS & CAREGIVERS SECTIONS
    // =========================================================================
    const patientsSections = [
      {
        page_id: pageIdMap['patients-caregivers'],
        section_key: 'hero',
        section_type: 'hero',
        eyebrow: 'PATIENTS & PROFESSIONALS',
        heading: 'For the people receiving care. \nAnd the people providing it.',
        subheading: null,
        body: 'Patients live the experience of a health condition. Healthcare professionals bring the knowledge and judgement needed to manage it.\n\nAt Onecore, both perspectives matter. Our role is to support them with dependable products, clear information and responsible communication.',
        items_json: null,
        cta_text: 'For patients',
        cta_url: '#for-patients',
        secondary_cta_text: 'For healthcare professionals',
        secondary_cta_url: '#for-professionals',
        image_url: '/assets/hero-patients-professionals.jpg',
        display_order: 1,
        is_active: 1,
      },
      {
        page_id: pageIdMap['patients-caregivers'],
        section_key: 'two_perspectives',
        section_type: 'editorial_split',
        eyebrow: 'TWO PERSPECTIVES',
        heading: 'Different experiences. \nThe same goal.',
        subheading: null,
        body: 'Good healthcare depends on understanding both the person living with a condition and the professional responsible for treating it.\n\nWe want Onecore to stay close to both. That means listening to patient needs, respecting clinical practice and making sure our products and information remain relevant to real healthcare.',
        items_json: null,
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: '/assets/two-perspectives.jpg',
        display_order: 2,
        is_active: 1,
      },
      {
        page_id: pageIdMap['patients-caregivers'],
        section_key: 'our_role',
        section_type: 'cards_grid',
        eyebrow: 'OUR ROLE',
        heading: 'Listen carefully. \nSupport responsibly. \nKeep the person behind the medicine in view.',
        subheading: null,
        body: null,
        items_json: JSON.stringify([
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
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 3,
        is_active: 1,
      },
      {
        page_id: pageIdMap['patients-caregivers'],
        section_key: 'for_patients',
        section_type: 'editorial_split',
        eyebrow: 'FOR PATIENTS AND CAREGIVERS',
        heading: 'You should be able to understand the medicines that are part of your care.',
        subheading: null,
        body: 'Clear information helps patients and caregivers take a more informed role in the treatment journey.\n\nOnecore provides factual information about its products and encourages patients to speak with their doctor or pharmacist when they have questions about their individual treatment.',
        items_json: JSON.stringify([
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
        ]),
        cta_text: 'Product information',
        cta_url: '/areas-of-care',
        secondary_cta_text: 'Report a concern',
        secondary_cta_url: '#patient-safety',
        image_url: '/assets/patients-caregivers.jpg',
        display_order: 4,
        is_active: 1,
      },
      {
        page_id: pageIdMap['patients-caregivers'],
        section_key: 'for_professionals',
        section_type: 'cards_grid',
        eyebrow: 'FOR HEALTHCARE PROFESSIONALS',
        heading: 'Supporting clinical practice with clear product information.',
        subheading: null,
        body: 'Healthcare professionals make treatment decisions by bringing together science, clinical experience and the needs of each individual patient.\n\nOur responsibility is to make accurate product information accessible and to maintain clear channels for safety and quality reporting.',
        items_json: JSON.stringify([
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
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: '/assets/healthcare-professionals.jpg',
        display_order: 5,
        is_active: 1,
      },
      {
        page_id: pageIdMap['patients-caregivers'],
        section_key: 'treatment_journey',
        section_type: 'timeline_list',
        eyebrow: 'THE TREATMENT JOURNEY',
        heading: 'A prescription begins in the clinic. \nCare continues beyond it.',
        subheading: null,
        body: 'Healthcare professionals make treatment decisions in the clinical setting. Patients then carry those decisions into everyday life.\n\nWe believe a responsible pharmaceutical company should understand both parts of that journey and support them with medicines and information people can depend on.',
        items_json: JSON.stringify([
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
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: '/assets/treatment-journey.jpg',
        display_order: 6,
        is_active: 1,
      },
      {
        page_id: pageIdMap['patients-caregivers'],
        section_key: 'patient_safety',
        section_type: 'cards_grid',
        eyebrow: 'PATIENT SAFETY',
        heading: 'Safety information deserves a clear way to reach us.',
        subheading: 'For medical emergencies, patients should seek immediate medical attention from an appropriate healthcare service.',
        body: 'If a patient, caregiver or healthcare professional becomes aware of a suspected side effect or product quality concern involving a Onecore product, that information can be reported for appropriate review.',
        items_json: JSON.stringify([
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
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 7,
        is_active: 1,
      },
      {
        page_id: pageIdMap['patients-caregivers'],
        section_key: 'final_cta',
        section_type: 'cta_banner',
        eyebrow: 'ONECORE SUPPORT',
        heading: 'Here for the people who use our medicines and the professionals who care for them.',
        subheading: null,
        body: 'Find product information, access professional resources or report a safety or quality concern.',
        items_json: null,
        cta_text: 'Contact Onecore',
        cta_url: '/contact',
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 8,
        is_active: 1,
      }
    ];

    // =========================================================================
    // 6. QUALITY & MANUFACTURING SECTIONS
    // =========================================================================
    const qualitySections = [
      {
        page_id: pageIdMap['quality-manufacturing'],
        section_key: 'hero',
        section_type: 'hero',
        eyebrow: 'QUALITY & MANUFACTURING',
        heading: 'Quality built into every stage of the product journey.',
        subheading: null,
        body: 'At Onecore Pharma, quality is not treated as a final checkpoint. It is considered throughout the product journey, from formulation and sourcing to manufacturing, testing and responsible release.',
        items_json: null,
        cta_text: 'Quality Principles',
        cta_url: '#principles',
        secondary_cta_text: 'Explore Specialties',
        secondary_cta_url: '/areas-of-care',
        image_url: '/assets/quality.jpg',
        display_order: 1,
        is_active: 1,
      },
      {
        page_id: pageIdMap['quality-manufacturing'],
        section_key: 'principles',
        section_type: 'cards_grid',
        eyebrow: 'FOUNDATIONAL PRINCIPLES',
        heading: 'Principles that guide our quality approach.',
        subheading: null,
        body: 'A disciplined commitment to patient safety, regulatory compliance, and formulation excellence across every batch.',
        items_json: JSON.stringify([
          {
            title: 'Consistent Standards',
            desc: 'Quality begins with clear specifications, controlled processes and consistent standards across the product lifecycle.'
          },
          {
            title: 'Responsible Release',
            desc: 'Products are released only after the appropriate quality requirements and checks have been completed.'
          },
          {
            title: 'Controlled Processes',
            desc: 'Manufacturing and quality processes are designed to support consistency, traceability and dependable product performance.'
          },
          {
            title: 'Continuous Improvement',
            desc: 'We continuously look for opportunities to strengthen processes, improve reliability and support better quality outcomes.'
          }
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 2,
        is_active: 1,
      },
      {
        page_id: pageIdMap['quality-manufacturing'],
        section_key: 'manufacturing_standards',
        section_type: 'editorial_split',
        eyebrow: 'MANUFACTURING DISCIPLINES',
        heading: 'Manufacturing with discipline and control.',
        subheading: null,
        body: 'Onecore formulations are produced in qualified manufacturing environments adhering strictly to cGMP and regulatory standards.',
        items_json: JSON.stringify([
          {
            title: 'Validated Processes',
            desc: 'Equipment calibration and environmental monitoring.'
          },
          {
            title: 'Batch Traceability',
            desc: 'End-to-end documentation across the supply chain.'
          }
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: '/assets/hero-healthcare.jpg',
        display_order: 3,
        is_active: 1,
      },
      {
        page_id: pageIdMap['quality-manufacturing'],
        section_key: 'assurance_steps',
        section_type: 'cards_grid',
        eyebrow: 'QUALITY ASSURANCE',
        heading: 'Controls throughout the lifecycle.',
        subheading: 'Key assurance stages designed to support formulation reliability from raw ingredient selection to clinical availability.',
        body: null,
        items_json: JSON.stringify([
          {
            title: 'Raw material and supplier oversight',
            desc: 'Disciplined evaluation and verification of starting materials, active pharmaceutical ingredients and qualified supply partners.'
          },
          {
            title: 'Defined specifications',
            desc: 'Clear chemical, physical and stability benchmarks established for every formulation across its shelf life.'
          },
          {
            title: 'Manufacturing process controls',
            desc: 'Structured in-process monitoring and calibrated equipment parameters designed to ensure batch consistency.'
          },
          {
            title: 'Testing and quality checks',
            desc: 'Rigorous analytical and microbiological testing conducted to verify identity, purity, potency and dosage uniformity.'
          },
          {
            title: 'Documentation and traceability',
            desc: 'Complete batch records, systematic tracking and full audit trails maintained throughout production and storage.'
          },
          {
            title: 'Responsible product release',
            desc: 'Independent quality review and systematic verification before any product batch is authorized for clinical distribution.'
          }
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 4,
        is_active: 1,
      },
      {
        page_id: pageIdMap['quality-manufacturing'],
        section_key: 'final_cta',
        section_type: 'cta_banner',
        eyebrow: null,
        heading: 'Quality you can depend on.',
        subheading: null,
        body: 'Explore the therapeutic areas and formulations that make up the Onecore portfolio.',
        items_json: null,
        cta_text: 'Explore Areas of Care',
        cta_url: '/areas-of-care',
        secondary_cta_text: 'Contact Quality Team',
        secondary_cta_url: '/contact',
        image_url: null,
        display_order: 5,
        is_active: 1,
      }
    ];

    // =========================================================================
    // 7. CONTACT SECTIONS
    // =========================================================================
    const contactSections = [
      {
        page_id: pageIdMap['contact'],
        section_key: 'hero',
        section_type: 'hero',
        eyebrow: 'CONTACT ONECORE',
        heading: 'Start a conversation with Onecore.',
        subheading: null,
        body: 'Whether you are looking for product information, exploring a business opportunity or simply want to reach our team, we will help direct your enquiry to the appropriate place.',
        items_json: null,
        cta_text: 'Send an Enquiry',
        cta_url: '#enquiry-form',
        secondary_cta_text: 'Contact Details',
        secondary_cta_url: '#contact-details',
        image_url: '/assets/patients-caregivers.jpg',
        display_order: 1,
        is_active: 1,
      },
      {
        page_id: pageIdMap['contact'],
        section_key: 'direct_channels',
        section_type: 'cards_grid',
        eyebrow: 'GET IN TOUCH',
        heading: 'Contact',
        subheading: 'We’d love to hear from you. Whether you’re a healthcare professional interested in our products or a patient seeking more information, reach out to us',
        body: null,
        items_json: JSON.stringify([
          {
            channel: 'EMAIL',
            value: 'info@onecorepharma.in',
            desc: 'For general company and product related enquiries.',
            cta_text: 'Write to info desk',
            cta_url: 'mailto:info@onecorepharma.in'
          },
          {
            channel: 'PHONE',
            value: '8169255034',
            desc: 'Available during business hours.',
            cta_text: 'Call our team',
            cta_url: 'tel:8169255034'
          },
          {
            channel: 'BUSINESS HOURS',
            value: '10 AM - 7 PM',
            desc: 'For enquiries handled by the Onecore team.',
            cta_text: 'WORKING DAYS // MON – SAT',
            cta_url: null
          }
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 2,
        is_active: 1,
      },
      {
        page_id: pageIdMap['contact'],
        section_key: 'enquiry_types',
        section_type: 'timeline_list',
        eyebrow: 'HOW CAN WE HELP?',
        heading: 'Choose the reason for getting in touch.',
        subheading: 'Selecting the right enquiry type helps your message reach the relevant Onecore team.',
        body: null,
        items_json: JSON.stringify([
          {
            num: '01',
            title: 'Product information',
            description: 'For factual information about Onecore products, compositions and available dosage forms.',
            value: 'Product information'
          },
          {
            num: '02',
            title: 'Business & distribution',
            description: 'For distribution, institutional supply and other commercial partnership discussions.',
            value: 'Business and distribution'
          },
          {
            num: '03',
            title: 'Careers',
            description: 'For opportunities to work with Onecore and career related communication.',
            value: 'Careers'
          },
          {
            num: '04',
            title: 'General enquiries',
            description: 'For company related questions that do not fall into another category.',
            value: 'General enquiry'
          }
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 3,
        is_active: 1,
      },
      {
        page_id: pageIdMap['contact'],
        section_key: 'form_intro',
        section_type: 'editorial',
        eyebrow: 'SEND AN ENQUIRY',
        heading: 'Tell us how we can help.',
        subheading: 'Please do not use this form for medical emergencies or to request individual diagnosis, treatment or changes to prescribed medicines. For personal medical advice, contact a qualified healthcare professional.',
        body: 'Complete the form and your enquiry can be directed to the appropriate team.',
        items_json: null,
        cta_text: 'Submit enquiry',
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 4,
        is_active: 1,
      },
      {
        page_id: pageIdMap['contact'],
        section_key: 'patient_safety',
        section_type: 'cards_grid',
        eyebrow: 'PATIENT SAFETY',
        heading: 'Reporting a safety or quality concern?',
        subheading: 'Use the dedicated safety reporting route.',
        body: 'Suspected side effects and product quality concerns should be reported through the appropriate safety channel so the information can be reviewed correctly.',
        items_json: JSON.stringify([
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
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 5,
        is_active: 1,
      },
      {
        page_id: pageIdMap['contact'],
        section_key: 'process_steps',
        section_type: 'timeline_list',
        eyebrow: 'WHAT HAPPENS NEXT',
        heading: 'Your message goes to the team best placed to respond.',
        subheading: null,
        body: null,
        items_json: JSON.stringify([
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
        ]),
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 6,
        is_active: 1,
      },
      {
        page_id: pageIdMap['contact'],
        section_key: 'final_cta',
        section_type: 'cta_banner',
        eyebrow: 'ONECORE PHARMA',
        heading: 'Healthcare centered on people.',
        subheading: null,
        body: null,
        items_json: null,
        cta_text: 'Explore Onecore',
        cta_url: '/about',
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 7,
        is_active: 1,
      }
    ];

    // =========================================================================
    // 8. NEWS SECTIONS
    // =========================================================================
    const newsSections = [
      {
        page_id: pageIdMap['news'],
        section_key: 'hero',
        section_type: 'hero',
        eyebrow: 'NEWS & PERSPECTIVES',
        heading: 'Insights, clinical updates and formulation perspectives.',
        subheading: null,
        body: 'Stay updated with therapeutic breakthroughs, clinical partnership highlights, and sustainable manufacturing practices from Onecore Pharma.',
        items_json: null,
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 1,
        is_active: 1,
      }
    ];

    // =========================================================================
    // 9. THERAPEUTIC AREAS SECTIONS
    // =========================================================================
    const areasSections = [
      {
        page_id: pageIdMap['areas-of-care'],
        section_key: 'hero',
        section_type: 'hero',
        eyebrow: 'THERAPEUTIC AREAS',
        heading: 'Healthcare needs are different. \nSo are the solutions they require.',
        subheading: null,
        body: 'Explore the areas of care represented across the Onecore portfolio and discover the medicines and formulations within each specialty.',
        items_json: null,
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: '/assets/therapeutic-hero.jpg',
        display_order: 1,
        is_active: 1,
      },
      {
        page_id: pageIdMap['areas-of-care'],
        section_key: 'portfolio_intro',
        section_type: 'editorial',
        eyebrow: 'OUR PORTFOLIO',
        heading: 'Explore by area of care.',
        subheading: null,
        body: 'Choose a specialty to discover the Onecore products and formulations within that area.',
        items_json: null,
        cta_text: null,
        cta_url: null,
        secondary_cta_text: null,
        secondary_cta_url: null,
        image_url: null,
        display_order: 2,
        is_active: 1,
      }
    ];

    const allSections = [
      ...homeSections,
      ...aboutSections,
      ...patientsSections,
      ...qualitySections,
      ...contactSections,
      ...newsSections,
      ...areasSections,
    ];

    for (const sec of allSections) {
      if (!sec.page_id) continue;
      await connection.query(`
        INSERT INTO page_sections 
          (page_id, section_key, section_type, eyebrow, heading, subheading, body, items_json, cta_text, cta_url, secondary_cta_text, secondary_cta_url, image_url, display_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          section_type = VALUES(section_type),
          eyebrow = VALUES(eyebrow),
          heading = VALUES(heading),
          subheading = VALUES(subheading),
          body = VALUES(body),
          items_json = IF(items_json IS NULL OR items_json = '', VALUES(items_json), items_json),
          cta_text = VALUES(cta_text),
          cta_url = VALUES(cta_url),
          secondary_cta_text = VALUES(secondary_cta_text),
          secondary_cta_url = VALUES(secondary_cta_url),
          image_url = VALUES(image_url),
          display_order = VALUES(display_order),
          is_active = VALUES(is_active)
      `, [
        sec.page_id, sec.section_key, sec.section_type, sec.eyebrow, sec.heading,
        sec.subheading, sec.body, sec.items_json, sec.cta_text, sec.cta_url,
        sec.secondary_cta_text, sec.secondary_cta_url, sec.image_url,
        sec.display_order, sec.is_active
      ]);
    }
    console.log('✅ Page sections synchronized in database.');

    // 10. Ensure site settings are complete
    const defaultSiteSettings = [
      { key: 'site_name', value: 'Onecore Pharma', group: 'general' },
      { key: 'company_name', value: 'Onecore Pharma Pvt. Ltd.', group: 'general' },
      { key: 'logo_url', value: '/assets/onecore-logo.png', group: 'general' },
      { key: 'favicon_url', value: '/assets/favicon.png', group: 'general' },
      { key: 'footer_tagline', value: 'Healthcare centered on people.', group: 'general' },
      { key: 'copyright_text', value: '© 2026 Onecore Pharma Pvt. Ltd.', group: 'general' },
      { key: 'contact_email', value: 'info@onecorepharma.in', group: 'contact' },
      { key: 'contact_phone', value: '8169255034', group: 'contact' },
      { key: 'contact_hours', value: '10 AM - 7 PM', group: 'contact' },
      { key: 'default_seo_title', value: 'Onecore Pharma — Purposeful Formulations, Dependable Quality', group: 'seo' },
      { key: 'default_seo_desc', value: 'Onecore Pharma is a modern pharmaceutical company developing purposeful formulations and healthcare solutions centered on patients and healthcare professionals.', group: 'seo' },
      {
        key: 'navigation_links',
        value: JSON.stringify([
          { name: 'About', path: '/about', is_active: true },
          { name: 'Areas of Care', path: '/areas-of-care', is_active: true },
          { name: 'Patients & Caregivers', path: '/patients-caregivers', is_active: true },
          { name: 'Quality & Manufacturing', path: '/quality-manufacturing', is_active: true },
          { name: 'News', path: '/news', is_active: true },
        ]),
        group: 'navigation'
      },
      {
        key: 'footer_explore_links',
        value: JSON.stringify([
          { name: 'About Onecore', path: '/about' },
          { name: 'Areas of Care', path: '/areas-of-care' },
          { name: 'Patients & Caregivers', path: '/patients-caregivers' },
          { name: 'Quality & Manufacturing', path: '/quality-manufacturing' },
          { name: 'Contact', path: '/contact' },
        ]),
        group: 'footer'
      },
      {
        key: 'footer_product_links',
        value: JSON.stringify([
          { name: 'OneFLEXO', path: '/products/oneflexo' },
          { name: 'Orthopaedics Portfolio', path: '/areas-of-care#orthopaedics' },
          { name: 'Product Information', path: '/contact' },
        ]),
        group: 'footer'
      },
      {
        key: 'footer_company_links',
        value: JSON.stringify([
          { name: 'Zeovus Sports', path: '#', isExternal: true },
          { name: 'Zeovus Vet', path: '#', isExternal: true },
          { name: 'Zeovus Life', path: '#', isExternal: true },
          { name: 'Zeovus Food', path: '#', isExternal: true },
          { name: 'Onecore', path: '/', isExternal: false },
          { name: 'Xearma', path: '#', isExternal: true },
          { name: 'Zeovus Health', path: '#', isExternal: true },
          { name: 'Zeovus Herbs', path: '#', isExternal: true },
        ]),
        group: 'footer'
      }
    ];

    for (const setting of defaultSiteSettings) {
      await connection.query(`
        INSERT INTO site_settings (setting_key, setting_value, setting_group)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          setting_value = VALUES(setting_value),
          setting_group = VALUES(setting_group)
      `, [setting.key, setting.value, setting.group]);
    }
    console.log('✅ Site settings, navigation and footer synchronized.');

    // 11. Scan public/assets and sync with Media Library
    const publicAssetsDir = path.join(__dirname, '..', '..', 'public', 'assets');
    if (fs.existsSync(publicAssetsDir)) {
      const files = fs.readdirSync(publicAssetsDir);
      for (const file of files) {
        const filePath = path.join(publicAssetsDir, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          const ext = path.extname(file).toLowerCase();
          let mime = 'image/jpeg';
          if (ext === '.png') mime = 'image/png';
          else if (ext === '.svg') mime = 'image/svg+xml';
          else if (ext === '.webp') mime = 'image/webp';

          const assetUrl = `/assets/${file}`;
          const title = file.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '');

          await connection.query(`
            INSERT INTO media (filename, original_filename, file_path, mime_type, file_size, alt_text)
            SELECT ?, ?, ?, ?, ?, ?
            WHERE NOT EXISTS (
              SELECT 1 FROM media WHERE file_path = ? OR filename = ?
            )
          `, [file, file, assetUrl, mime, stat.size, title, assetUrl, file]);
        }
      }
      console.log('✅ Public assets cataloged into Media Library.');
    }

    // 12. Ensure Super Admin user exists
    const passwordHash = await bcrypt.hash('Admin@Onecore2026!', 12);
    await connection.query(`
      INSERT INTO admin_users (name, email, password_hash, role_id, is_active, must_change_password)
      VALUES ('Super Administrator', 'admin@onecorepharma.in', ?, 1, 1, 0)
      ON DUPLICATE KEY UPDATE
        role_id = 1,
        is_active = 1
    `, [passwordHash]);
    console.log('✅ Super Admin account verified.');

    console.log('🎉 Onecore Pharma CMS database synchronization finished successfully!');
  } catch (err) {
    console.error('❌ Error during CMS sync:', err);
  } finally {
    if (connection) await connection.end();
  }
}

syncCms();
