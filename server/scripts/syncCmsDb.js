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

    // 1. Ensure `items_json` column exists in `page_sections`
    const [cols] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'page_sections' AND COLUMN_NAME = 'items_json'
    `, [dbConfig.database]);

    if (cols.length === 0) {
      console.log('➕ Adding `items_json` column to `page_sections`...');
      await connection.query(`
        ALTER TABLE page_sections 
        ADD COLUMN items_json LONGTEXT NULL AFTER body
      `);
    }

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

    // 3. Seed Page Sections for HOME
    const homeSections = [
      {
        page_id: pageIdMap['home'],
        section_key: 'hero',
        section_type: 'hero',
        eyebrow: 'ONECORE PHARMA',
        heading: 'Healthcare centered on people.',
        subheading: 'Purposeful formulations. Dependable quality.',
        body: 'At Onecore Pharma, we develop formulations and healthcare solutions that respond to real clinical needs, with quality built into every step.',
        cta_text: 'Explore Areas of Care',
        cta_url: '/areas-of-care',
        image_url: '/assets/hero-healthcare.jpg',
        display_order: 1,
        is_active: 1,
      },
      {
        page_id: pageIdMap['home'],
        section_key: 'about_overview',
        section_type: 'editorial',
        eyebrow: 'WHO WE ARE',
        heading: 'A pharmaceutical company committed to purposeful formulations.',
        subheading: null,
        body: 'Onecore Pharma operates across key therapeutic disciplines, developing quality medicines with disciplined clinical rigor, patient-first thinking and modern formulation science.',
        cta_text: 'Learn About Onecore',
        cta_url: '/about',
        image_url: '/assets/hero-patients-professionals.jpg',
        display_order: 2,
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
        cta_text: 'View all areas',
        cta_url: '/areas-of-care',
        image_url: null,
        display_order: 3,
        is_active: 1,
      },
      {
        page_id: pageIdMap['home'],
        section_key: 'our_purpose',
        section_type: 'vision_mission',
        eyebrow: 'OUR PURPOSE',
        heading: 'Improve care through medicines and healthcare solutions that matter.',
        subheading: null,
        body: 'Our vision is to be a trusted pharmaceutical company for patients and healthcare professionals across the areas of care we serve. Our mission is to develop and deliver purposeful formulations that address real clinical needs, uphold dependable quality and expand responsibly.',
        cta_text: null,
        cta_url: null,
        image_url: null,
        display_order: 4,
        is_active: 1,
      },
      {
        page_id: pageIdMap['home'],
        section_key: 'quality_dark',
        section_type: 'quality_highlight',
        eyebrow: 'QUALITY ASSURANCE',
        heading: 'Quality is part of the product from the beginning.',
        subheading: null,
        body: 'Medicines carry responsibility. That is why quality needs to be considered across manufacturing, testing, review and release, not treated as a final checkpoint.',
        cta_text: 'Quality Standards',
        cta_url: '/quality-manufacturing',
        image_url: '/assets/quality.jpg',
        display_order: 5,
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
        cta_text: null,
        cta_url: null,
        image_url: null,
        display_order: 6,
        is_active: 1,
      },
      {
        page_id: pageIdMap['home'],
        section_key: 'looking_ahead',
        section_type: 'timeline_list',
        eyebrow: 'LOOKING AHEAD',
        heading: 'Building depth. Expanding thoughtfully.',
        subheading: null,
        body: 'Our roadmap prioritizes therapeutic rigor, medical dialogue, and disciplined expansion that preserves trust.',
        cta_text: null,
        cta_url: null,
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
        cta_text: 'Explore areas of care',
        cta_url: '/areas-of-care',
        image_url: null,
        display_order: 8,
        is_active: 1,
      }
    ];

    // Seed Page Sections for QUALITY & MANUFACTURING
    const qualitySections = [
      {
        page_id: pageIdMap['quality-manufacturing'],
        section_key: 'hero',
        section_type: 'hero',
        eyebrow: 'QUALITY & MANUFACTURING',
        heading: 'Quality built into every stage of the product journey.',
        subheading: null,
        body: 'At Onecore Pharma, quality is not treated as a final checkpoint. It is considered throughout the product journey, from formulation and sourcing to manufacturing, testing and responsible release.',
        cta_text: 'Quality Principles',
        cta_url: '#principles',
        image_url: '/assets/quality.jpg',
        display_order: 1,
        is_active: 1,
      },
      {
        page_id: pageIdMap['quality-manufacturing'],
        section_key: 'commitment',
        section_type: 'editorial',
        eyebrow: 'OUR COMMITMENT',
        heading: 'Quality is part of the product from the beginning.',
        subheading: null,
        body: 'Our approach to quality is built around consistent standards, careful processes and responsible decision-making. We work to ensure that the products we bring to patients and healthcare professionals meet the standards expected of a responsible pharmaceutical company.',
        cta_text: null,
        cta_url: null,
        image_url: null,
        display_order: 2,
        is_active: 1,
      },
      {
        page_id: pageIdMap['quality-manufacturing'],
        section_key: 'manufacturing_excellence',
        section_type: 'editorial_split',
        eyebrow: 'MANUFACTURING EXCELLENCE',
        heading: 'Manufacturing with discipline and control.',
        subheading: null,
        body: 'Our manufacturing approach is focused on controlled processes, reliable sourcing and appropriate quality oversight. We work with manufacturing partners and systems that support the standards expected across our portfolio.',
        cta_text: null,
        cta_url: null,
        image_url: '/assets/hero-healthcare.jpg',
        display_order: 3,
        is_active: 1,
      },
      {
        page_id: pageIdMap['quality-manufacturing'],
        section_key: 'final_cta',
        section_type: 'cta_banner',
        eyebrow: null,
        heading: 'Quality you can depend on.',
        subheading: null,
        body: 'Learn more about Onecore Pharma, our areas of care and our approach to purposeful healthcare.',
        cta_text: 'About Onecore',
        cta_url: '/about',
        image_url: null,
        display_order: 4,
        is_active: 1,
      }
    ];

    // Seed Page Sections for ABOUT
    const aboutSections = [
      {
        page_id: pageIdMap['about'],
        section_key: 'hero',
        section_type: 'hero',
        eyebrow: 'ABOUT ONECORE',
        heading: 'Built on clinical purpose, formulation science, and trust.',
        subheading: null,
        body: 'Onecore Pharma is dedicated to bringing meaningful formulations to healthcare practitioners and patients across diverse therapeutic areas.',
        cta_text: 'Explore Areas of Care',
        cta_url: '/areas-of-care',
        image_url: '/assets/two-perspectives.jpg',
        display_order: 1,
        is_active: 1,
      }
    ];

    const allSections = [...homeSections, ...qualitySections, ...aboutSections];

    for (const sec of allSections) {
      if (!sec.page_id) continue;
      await connection.query(`
        INSERT INTO page_sections 
          (page_id, section_key, section_type, eyebrow, heading, subheading, body, cta_text, cta_url, image_url, display_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          section_type = VALUES(section_type),
          eyebrow = VALUES(eyebrow),
          heading = VALUES(heading),
          subheading = VALUES(subheading),
          body = VALUES(body),
          cta_text = VALUES(cta_text),
          cta_url = VALUES(cta_url),
          image_url = VALUES(image_url),
          display_order = VALUES(display_order),
          is_active = VALUES(is_active)
      `, [
        sec.page_id, sec.section_key, sec.section_type, sec.eyebrow, sec.heading,
        sec.subheading, sec.body, sec.cta_text, sec.cta_url, sec.image_url,
        sec.display_order, sec.is_active
      ]);
    }
    console.log('✅ Page sections synchronized in database.');

    // 4. Ensure site settings are complete
    const defaultSiteSettings = [
      { key: 'site_name', value: 'Onecore Pharma', group: 'general' },
      { key: 'company_name', value: 'Onecore Pharma Pvt. Ltd.', group: 'general' },
      { key: 'logo_url', value: '/assets/onecore-logo.png', group: 'general' },
      { key: 'favicon_url', value: '/assets/favicon.png', group: 'general' },
      { key: 'footer_tagline', value: 'Healthcare centered on people.', group: 'general' },
      { key: 'copyright_text', value: '© 2026 Onecore Pharma Pvt. Ltd.', group: 'general' },
      { key: 'contact_email', value: 'info@onecorepharma.in', group: 'contact' },
      { key: 'contact_phone', value: '8169255034', group: 'contact' },
      { key: 'contact_hours', value: '10 AM to 7 PM', group: 'contact' },
      { key: 'default_seo_title', value: 'Onecore Pharma — Purposeful Formulations, Dependable Quality', group: 'seo' },
      { key: 'default_seo_desc', value: 'Onecore Pharma is a modern pharmaceutical company developing purposeful formulations and healthcare solutions centered on patients and healthcare professionals.', group: 'seo' },
      { 
        key: 'navigation_links', 
        value: JSON.stringify([
          { name: 'About', path: '/about', is_active: true },
          { name: 'Areas of Care', path: '/areas-of-care', is_active: true },
          { name: 'Patients & Caregivers', path: '/patients-caregivers', is_active: true },
          { name: 'Healthcare Professionals', path: '/patients-caregivers#for-professionals', is_active: true },
          { name: 'Quality & Manufacturing', path: '/quality-manufacturing', is_active: true },
          { name: 'News', path: '/news', is_active: true },
        ]), 
        group: 'navigation' 
      },
      { 
        key: 'footer_explore_links', 
        value: JSON.stringify([
          { name: 'Areas of Care', path: '/areas-of-care' },
          { name: 'Patients & Caregivers', path: '/patients-caregivers' },
          { name: 'Healthcare Professionals', path: '/healthcare-professionals' },
          { name: 'News & Perspectives', path: '/news' },
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
          { name: 'About Onecore', path: '/about' },
          { name: 'Quality & Manufacturing', path: '/quality-manufacturing' },
          { name: 'Sustainability', path: '/#sustainability' },
          { name: 'Contact Us', path: '/contact' },
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

    // 5. Scan public/assets and sync with Media Library
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

    // 6. Ensure Super Admin user exists
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
