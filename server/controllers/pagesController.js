import { query } from '../config/db.js';

// Standard section blueprints for all site pages
export const PAGE_SECTION_DEFAULTS = {
  'home': [
    {
      key: 'hero_banner',
      type: 'hero_banner',
      title: 'Hero Banner & Core Mission',
      content: {
        headline: 'Innovating Formulations for Better Health',
        subheadline: 'Committed to clinical excellence across specialized therapeutic divisions.',
        cta_text: 'Explore Therapeutic Areas',
        cta_link: '/areas-of-care',
        image_url: '/assets/hero-healthcare.jpg'
      }
    },
    {
      key: 'divisions_showcase',
      type: 'divisions_showcase',
      title: 'Therapeutic Divisions Overview',
      content: {
        heading: 'Our Specialized Areas of Care',
        subtext: 'Comprehensive formulations spanning 9 medical domains.'
      }
    },
    {
      key: 'stats_counter',
      type: 'stats_counter',
      title: 'Key Metrics & Numbers',
      content: {
        stat1_val: '9',
        stat1_lbl: 'Divisions',
        stat2_val: '155+',
        stat2_lbl: 'Formulations'
      }
    },
    {
      key: 'quality_promise',
      type: 'quality_promise',
      title: 'Quality Assurance & Compliance',
      content: {
        heading: 'Manufactured to cGMP & WHO Standards',
        body: 'Ensuring highest purity and bioavailability.'
      }
    }
  ],
  'about': [
    {
      key: 'about_hero',
      type: 'about_hero',
      title: 'About Us Hero',
      content: {
        title: 'About Onecore Pharma',
        lead: 'Pioneering accessible, high-efficacy pharmaceutical solutions.',
        image_url: '/assets/about-facility.jpg'
      }
    },
    {
      key: 'corporate_mission',
      type: 'corporate_mission',
      title: 'Mission & Vision',
      content: {
        mission: 'To formulate superior therapeutic molecules that elevate patient care standards.',
        vision: 'To become a globally respected name in clinical formulations.'
      }
    },
    {
      key: 'leadership_overview',
      type: 'leadership_overview',
      title: 'Leadership & Scientific Advisory',
      content: {
        heading: 'Our Scientific Advisory Board',
        description: 'Driven by experienced clinicians and pharmacologists.'
      }
    }
  ],
  'contact': [
    {
      key: 'contact_hero',
      type: 'contact_hero',
      title: 'Hero & Introduction',
      content: {
        heading: 'Get in Touch with Onecore Pharma',
        subheading: 'For product inquiries, distribution networks, and official communication.',
        cta_text: 'Send an Enquiry',
        cta_url: '#enquiry-form',
        image_url: '/assets/internet/contact-direct-helpline.jpg'
      }
    },
    {
      key: 'contact_info_cards',
      type: 'contact_info_cards',
      title: 'Company Contact Coordinates',
      content: {
        registered_office: 'Corporate Headquarters, Industrial Area, Hyderabad, India',
        primary_phone: '+91 40 0000 0000',
        support_email: 'contact@onecorepharma.com',
        business_email: 'business@onecorepharma.com',
        working_hours: 'Monday – Friday: 9:00 AM – 6:00 PM IST'
      }
    },
    {
      key: 'contact_form_settings',
      type: 'contact_form_settings',
      title: 'Inquiry Form & Notification Settings',
      content: {
        form_heading: 'Send an Official Enquiry',
        recipient_email: 'enquiry@onecorepharma.com'
      }
    }
  ],
  'areas-of-care': [
    {
      key: 'portfolio_header',
      type: 'portfolio_header',
      title: 'Portfolio Header',
      content: {
        heading: 'Therapeutic Areas of Care',
        subtext: 'Explore our complete formulation ecosystem across all therapeutic divisions.'
      }
    },
    {
      key: 'division_tabs_section',
      type: 'division_tabs_section',
      title: 'Interactive Division Tabs',
      content: {
        auto_display_all_divisions: true
      }
    }
  ],
  'careers': [
    {
      key: 'careers_hero',
      type: 'careers_hero',
      title: 'Careers Hero',
      content: {
        heading: 'Build Your Career at Onecore',
        subheading: 'Join our passionate team advancing modern pharmaceutical development.'
      }
    },
    {
      key: 'recruitment_contact',
      type: 'recruitment_contact',
      title: 'HR Contact Details',
      content: {
        hr_email: 'careers@onecorepharma.com',
        notice: 'Submit CV with preferred division in the subject line.'
      }
    }
  ],
  'research-quality': [
    {
      key: 'quality_hero',
      type: 'quality_hero',
      title: 'Research & Quality Hero',
      content: {
        heading: 'Rigorous Quality Control & Analytical Testing',
        subheading: 'Adhering to strict international pharmacopoeial specifications.'
      }
    },
    {
      key: 'standards_cards',
      type: 'standards_cards',
      title: 'Certifications & Accreditations',
      content: {
        cGMP: true,
        WHO_GMP: true,
        ISO_certified: true
      }
    }
  ],
  'quality-manufacturing': [
    {
      key: 'quality_hero',
      type: 'quality_hero',
      title: 'Quality & Manufacturing Hero',
      content: {
        heading: 'Quality is part of the product from the beginning.',
        subheading: 'At Onecore Pharma, quality is considered throughout the entire product journey.',
        image_url: '/assets/quality.jpg'
      }
    },
    {
      key: 'standards_cards',
      type: 'standards_cards',
      title: 'Certifications & Accreditations',
      content: {
        cGMP: true,
        WHO_GMP: true,
        ISO_certified: true
      }
    }
  ],
  'patients-caregivers': [
    {
      key: 'patients_hero',
      type: 'patients_hero',
      title: 'Patients & Caregivers Hero',
      content: {
        heading: 'Clear Information. Supportive Care.',
        subheading: 'Transparent resources to help patients and families navigate therapy with confidence.',
        image_url: '/assets/patients-caregivers.jpg'
      }
    },
    {
      key: 'patient_guidance_cards',
      type: 'patient_guidance_cards',
      title: 'Guidance & Educational Support',
      content: {
        heading: 'Resources for Patients and Families',
        body: 'Empowering patients with reliable formulation details and safety advice.'
      }
    }
  ],
  'healthcare-professionals': [
    {
      key: 'hcp_hero',
      type: 'hcp_hero',
      title: 'Healthcare Professionals Hero',
      content: {
        heading: 'Scientific Rigor & Clinical Partnerships',
        subheading: 'Collaborating with medical specialists across therapeutic disciplines to elevate clinical outcomes.',
        image_url: '/assets/internet/healthcare-team-discussion.jpg'
      }
    },
    {
      key: 'clinical_resources',
      type: 'clinical_resources',
      title: 'Clinical Data & Medical Dialogue',
      content: {
        heading: 'Evidence-Based Therapeutic Portfolios',
        subheading: 'Monographs, formulation dossiers, and bioequivalence data for clinicians.'
      }
    }
  ],
  'news': [
    {
      key: 'news_hero',
      type: 'news_hero',
      title: 'News & Perspectives Hero',
      content: {
        heading: 'Perspectives on Healthcare and Innovation',
        subheading: 'Stay updated on our therapeutic developments, formulation research, and corporate milestones.',
        image_url: '/assets/news-1.jpg'
      }
    }
  ],
  'privacy': [
    {
      key: 'banner',
      type: 'hero',
      title: 'Page Banner & Header',
      eyebrow: 'LEGAL & COMPLIANCE',
      heading: 'Privacy Policy',
      subheading: 'How Onecore Pharma collects, protects, and handles personal data.',
      body: 'Onecore Pharma is committed to protecting your privacy and ensuring responsible, transparent handling of all communications and interactions.',
      image_url: '/assets/about-facility.jpg',
    },
    {
      key: 'information_collection',
      type: 'editorial',
      title: '1. Information Collection',
      eyebrow: 'ARTICLE 01',
      heading: '1. Information Collection',
      body: 'Onecore Pharma collects information voluntarily submitted through our contact and inquiry forms, including names, professional affiliations, and contact details necessary to respond to product or partnership communications.',
    },
    {
      key: 'use_of_information',
      type: 'editorial',
      title: '2. Use of Information',
      eyebrow: 'ARTICLE 02',
      heading: '2. Use of Information',
      body: 'Submitted details are used solely to route inquiries to the appropriate departmental function, such as medical information, business partnerships, or customer support.',
    },
    {
      key: 'data_protection',
      type: 'editorial',
      title: '3. Data Protection & Confidentiality',
      eyebrow: 'ARTICLE 03',
      heading: '3. Data Protection & Confidentiality',
      body: 'We maintain reasonable technical and organizational standards to protect communications from unauthorized disclosure, access, or alteration.',
    }
  ],
  'disclaimer': [
    {
      key: 'banner',
      type: 'hero',
      title: 'Page Banner & Header',
      eyebrow: 'LEGAL & REGULATORY',
      heading: 'Disclaimer',
      subheading: 'Regulatory notices, medical boundaries, and conditions of website use.',
      body: 'Please review the following legal disclosures regarding medical information, product specifications, and regulatory frameworks.',
      image_url: '/assets/hero-healthcare.jpg',
    },
    {
      key: 'medical_information_notice',
      type: 'editorial',
      title: 'Medical Information Notice',
      eyebrow: 'NOTICE 01',
      heading: 'Medical Information Notice',
      body: 'The content provided on this website is for informational and educational purposes only and is not intended to replace consultation with a qualified medical professional.',
    },
    {
      key: 'product_availability',
      type: 'editorial',
      title: 'Product Availability',
      eyebrow: 'NOTICE 02',
      heading: 'Product Availability',
      body: 'Product specifications and availability are subject to local regulatory authorizations and marketed formulation guidelines.',
    }
  ]
};

// Aliases
PAGE_SECTION_DEFAULTS['areas_of_care'] = PAGE_SECTION_DEFAULTS['areas-of-care'];
PAGE_SECTION_DEFAULTS['patients_caregivers'] = PAGE_SECTION_DEFAULTS['patients-caregivers'];
PAGE_SECTION_DEFAULTS['healthcare_professionals'] = PAGE_SECTION_DEFAULTS['healthcare-professionals'];
PAGE_SECTION_DEFAULTS['quality_manufacturing'] = PAGE_SECTION_DEFAULTS['quality-manufacturing'];
PAGE_SECTION_DEFAULTS['terms'] = PAGE_SECTION_DEFAULTS['disclaimer'];
PAGE_SECTION_DEFAULTS[''] = PAGE_SECTION_DEFAULTS['home'];

const KNOWN_PAGE_TEMPLATES = [
  { page_key: 'home', title: 'Home', slug: '/' },
  { page_key: 'about', title: 'About Onecore', slug: '/about' },
  { page_key: 'patients-caregivers', title: 'Patients & Caregivers', slug: '/patients-caregivers' },
  { page_key: 'healthcare-professionals', title: 'Healthcare Professionals', slug: '/healthcare-professionals' },
  { page_key: 'quality-manufacturing', title: 'Quality & Manufacturing', slug: '/quality-manufacturing' },
  { page_key: 'areas-of-care', title: 'Therapeutic Areas', slug: '/areas-of-care' },
  { page_key: 'contact', title: 'Contact', slug: '/contact' },
  { page_key: 'news', title: 'News & Perspectives', slug: '/news' },
  { page_key: 'partnerships', title: 'Distribution & Partnerships', slug: '/partnerships' },
  { page_key: 'privacy', title: 'Privacy Statement', slug: '/privacy' },
  { page_key: 'disclaimer', title: 'Terms of Use & Disclaimer', slug: '/disclaimer' },
  { page_key: 'careers', title: 'Careers', slug: '/careers' },
  { page_key: 'research-quality', title: 'Research & Quality', slug: '/research-quality' },
];

/**
 * Universal auto-seeding helper:
 * Directly inserts default modular sections into MySQL for any page that has 0 sections.
 */
export const autoSeedPageSections = async (page) => {
  if (!page || !page.id) return [];
  const cleanSlug = (page.slug || '').replace(/^\/+/, '').toLowerCase();
  const cleanKey = (page.page_key || '').replace(/^\/+/, '').toLowerCase();

  const defaults =
    PAGE_SECTION_DEFAULTS[cleanSlug] ||
    PAGE_SECTION_DEFAULTS[cleanKey] ||
    PAGE_SECTION_DEFAULTS[cleanSlug.replace(/-/g, '_')] ||
    PAGE_SECTION_DEFAULTS[cleanKey.replace(/-/g, '_')] ||
    PAGE_SECTION_DEFAULTS[cleanSlug.replace(/_/g, '-')] ||
    PAGE_SECTION_DEFAULTS[cleanKey.replace(/_/g, '-')] ||
    (cleanSlug === '' ? PAGE_SECTION_DEFAULTS['home'] : null);

  if (!defaults || defaults.length === 0) return [];

  for (let i = 0; i < defaults.length; i++) {
    const def = defaults[i];
    const secKey = def.key || def.type || `section_${i + 1}`;
    const secType = def.type || 'editorial';
    const secTitle = def.title || def.heading || def.content?.headline || def.content?.heading || def.content?.title || secKey;
    const heading = def.heading || def.content?.headline || def.content?.heading || def.content?.title || secTitle;
    const subheading = def.subheading || def.content?.subheadline || def.content?.subtext || def.content?.lead || def.content?.subheading || null;
    const body = def.body || def.content?.body || def.content?.description || def.content?.mission || null;
    const ctaText = def.cta_text || def.content?.cta_text || null;
    const ctaUrl = def.cta_url || def.content?.cta_link || def.content?.cta_url || null;
    const imageUrl = def.image_url || def.content?.image_url || null;
    const contentJson = JSON.stringify(def.content || {});

    let itemsJson = null;
    if (def.items) {
      itemsJson = JSON.stringify(def.items);
    } else if (def.content?.mission && def.content?.vision) {
      itemsJson = JSON.stringify([
        { title: 'Our Mission', desc: def.content.mission },
        { title: 'Our Vision', desc: def.content.vision }
      ]);
    } else if (def.content?.stat1_val) {
      itemsJson = JSON.stringify([
        { stat: def.content.stat1_val, title: def.content.stat1_lbl || 'Metric 1' },
        { stat: def.content.stat2_val || '', title: def.content.stat2_lbl || 'Metric 2' }
      ]);
    } else if (secKey === 'contact_info_cards' || secType === 'contact_info_cards') {
      itemsJson = JSON.stringify([
        { channel: 'SUPPORT EMAIL', title: 'Support Email', value: def.content.support_email || 'contact@onecorepharma.com', cta_text: 'Write to info desk', cta_url: `mailto:${def.content.support_email || 'contact@onecorepharma.com'}` },
        { channel: 'PRIMARY PHONE', title: 'Primary Phone', value: def.content.primary_phone || '+91 40 0000 0000', cta_text: 'Call our team', cta_url: `tel:${(def.content.primary_phone || '+914000000000').replace(/[^0-9+]/g, '')}` },
        { channel: 'BUSINESS HOURS', title: 'Working Hours', value: def.content.working_hours || 'Monday – Friday: 9:00 AM – 6:00 PM IST', cta_text: 'WORKING DAYS // MON – SAT', cta_url: '' },
        { channel: 'BUSINESS EMAIL', title: 'Business Email', value: def.content.business_email || 'business@onecorepharma.com', cta_text: 'Email business desk', cta_url: `mailto:${def.content.business_email || 'business@onecorepharma.com'}` },
        { channel: 'REGISTERED OFFICE', title: 'Registered Office', value: def.content.registered_office || 'Corporate Headquarters, Industrial Area, Hyderabad, India', cta_text: 'Headquarters', cta_url: '#contact-details' }
      ]);
    }

    await query(
      `INSERT INTO page_sections 
        (page_id, section_key, section_type, eyebrow, heading, subheading, body, cta_text, cta_url, image_url, display_order, is_active, items_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, NOW(), NOW())`,
      [
        page.id,
        secKey,
        secType,
        def.content?.eyebrow || def.eyebrow || null,
        heading || secTitle || '',
        subheading,
        body,
        ctaText,
        ctaUrl,
        imageUrl,
        i + 1,
        itemsJson || contentJson
      ]
    );
  }

  const [newSections] = await query(
    'SELECT * FROM page_sections WHERE page_id = ? ORDER BY display_order ASC, id ASC',
    [page.id]
  );
  return newSections;
};

const setNoCacheHeaders = (res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
};

export const getPages = async (req, res, next) => {
  try {
    setNoCacheHeaders(res);

    // Auto-seed missing known pages in MySQL
    for (const t of KNOWN_PAGE_TEMPLATES) {
      const existing = await query('SELECT id FROM pages WHERE page_key = ? OR slug = ?', [t.page_key, t.slug]);
      if (!existing || existing.length === 0) {
        await query(
          'INSERT INTO pages (page_key, title, slug, status, seo_title, seo_description, created_at, updated_at) VALUES (?, ?, ?, "published", ?, ?, NOW(), NOW())',
          [t.page_key, t.title, t.slug, `${t.title} | Onecore Pharma`, `Overview and detailed information on ${t.title} at Onecore Pharma.`]
        );
      }
    }

    // Auto-seed missing sections across all pages in MySQL
    const allPages = await query('SELECT * FROM pages');
    for (const p of allPages) {
      const [secCount] = await query(
        'SELECT COUNT(*) as count FROM page_sections WHERE page_id = ?',
        [p.id]
      );
      if (secCount?.count === 0) {
        await autoSeedPageSections(p);
      }
    }

    const pages = await query(`
      SELECT p.*, COUNT(s.id) as section_count
      FROM pages p
      LEFT JOIN page_sections s ON p.id = s.page_id
      GROUP BY p.id
      ORDER BY p.id ASC
    `);
    return res.status(200).json({ success: true, data: pages });
  } catch (error) {
    next(error);
  }
};

export const getPageByKey = async (req, res, next) => {
  try {
    setNoCacheHeaders(res);
    const { key } = req.params;
    const isPublic = !req.user;

    const cleanKey = (key || '').replace(/^\/+/, '').toLowerCase();
    const formattedSlug = key.startsWith('/') ? key : `/${key}`;

    let pages = await query(
      'SELECT * FROM pages WHERE page_key = ? OR slug = ? OR slug = ? OR id = ?',
      [key, key, formattedSlug, isNaN(key) ? -1 : parseInt(key, 10)]
    );

    // If page record doesn't exist in `pages`, check known templates and auto-create parent page
    if (!pages || pages.length === 0) {
      const template = KNOWN_PAGE_TEMPLATES.find(
        (t) => t.page_key === cleanKey || t.slug === formattedSlug || t.page_key === key
      );
      if (template || PAGE_SECTION_DEFAULTS[cleanKey]) {
        const title = template?.title || cleanKey.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const slug = template?.slug || formattedSlug;
        const pageKey = template?.page_key || cleanKey;
        await query(
          'INSERT INTO pages (page_key, title, slug, status, seo_title, seo_description, created_at, updated_at) VALUES (?, ?, ?, "published", ?, ?, NOW(), NOW())',
          [pageKey, title, slug, `${title} | Onecore Pharma`, `Overview and detailed information on ${title} at Onecore Pharma.`]
        );
        pages = await query(
          'SELECT * FROM pages WHERE page_key = ? OR slug = ?',
          [pageKey, slug]
        );
      }
    }

    if (!pages || pages.length === 0) {
      return res.status(404).json({ success: false, message: 'Page not found.' });
    }

    const page = pages[0];
    let sectionSql = 'SELECT * FROM page_sections WHERE page_id = ?';
    if (isPublic) {
      sectionSql += ' AND is_active = 1';
    }
    sectionSql += ' ORDER BY display_order ASC, id ASC';

    let sections = await query(sectionSql, [page.id]);

    // Check if sections exist; if not, immediately auto-seed from blueprint directly into MySQL
    if (!sections || sections.length === 0) {
      await autoSeedPageSections(page);
      sections = await query(sectionSql, [page.id]);
    }

    page.sections = sections;

    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

export const updatePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, status, seo_title, seo_description } = req.body;

    const updates = [];
    const params = [];

    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (slug !== undefined) { updates.push('slug = ?'); params.push(slug); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    if (seo_title !== undefined) { updates.push('seo_title = ?'); params.push(seo_title); }
    if (seo_description !== undefined) { updates.push('seo_description = ?'); params.push(seo_description); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided.' });
    }

    params.push(id);
    await query(`UPDATE pages SET ${updates.join(', ')} WHERE id = ?`, params);

    return res.status(200).json({
      success: true,
      message: 'Page settings updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const createPageSection = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const {
      section_key,
      section_type,
      section_title,
      eyebrow,
      heading,
      subheading,
      body,
      items_json,
      content_json,
      cta_text,
      cta_url,
      secondary_cta_text,
      secondary_cta_url,
      image_url,
      video_url,
      display_order,
      is_active,
    } = req.body;

    if (!section_key || !section_key.trim()) {
      return res.status(400).json({ success: false, message: 'Section key identifier is required.' });
    }

    // Determine max display order if not provided
    let order = display_order;
    if (order === undefined) {
      const [maxOrder] = await query('SELECT MAX(display_order) as max_order FROM page_sections WHERE page_id = ?', [pageId]);
      order = (maxOrder?.max_order || 0) + 1;
    }

    const finalHeading = heading || section_title || '';
    const finalItemsJson = items_json !== undefined 
      ? (typeof items_json === 'object' ? JSON.stringify(items_json) : items_json) 
      : (content_json !== undefined ? (typeof content_json === 'object' ? JSON.stringify(content_json) : content_json) : null);

    const result = await query(`
      INSERT INTO page_sections 
        (page_id, section_key, section_type, eyebrow, heading, subheading, body, items_json, cta_text, cta_url, secondary_cta_text, secondary_cta_url, image_url, video_url, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      pageId,
      section_key.trim().toLowerCase().replace(/\s+/g, '_'),
      section_type || 'editorial',
      eyebrow || null,
      finalHeading,
      subheading || null,
      body || null,
      finalItemsJson,
      cta_text || null,
      cta_url || null,
      secondary_cta_text || null,
      secondary_cta_url || null,
      image_url || null,
      video_url || null,
      order,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ]);

    setNoCacheHeaders(res);
    return res.status(201).json({
      success: true,
      message: 'Page section created successfully.',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePageSection = async (req, res, next) => {
  try {
    setNoCacheHeaders(res);
    const { id } = req.params;
    const {
      eyebrow,
      heading,
      subheading,
      body,
      items_json,
      content_json,
      section_title,
      cta_text,
      cta_url,
      secondary_cta_text,
      secondary_cta_url,
      image_url,
      image_mobile_url,
      mobile_image_url,
      video_url,
      is_active,
      display_order,
      order_index,
      section_type,
    } = req.body;

    const updates = [];
    const params = [];
    const mobileImg = image_mobile_url !== undefined ? image_mobile_url : mobile_image_url;

    if (eyebrow !== undefined) { updates.push('eyebrow = ?'); params.push(eyebrow); }
    if (heading !== undefined || section_title !== undefined) { 
      updates.push('heading = ?'); 
      params.push(heading !== undefined ? heading : section_title); 
    }
    if (subheading !== undefined) { updates.push('subheading = ?'); params.push(subheading); }
    if (body !== undefined) { updates.push('body = ?'); params.push(body); }
    if (items_json !== undefined || content_json !== undefined) {
      let val = items_json !== undefined ? items_json : content_json;
      if (typeof val === 'string') {
        try { val = JSON.parse(val); } catch {}
      }
      if (val && typeof val === 'object' && !Array.isArray(val) && mobileImg !== undefined) {
        val.image_mobile_url = mobileImg;
      }
      updates.push('items_json = ?');
      params.push(typeof val === 'object' ? JSON.stringify(val) : val);
    }
    if (cta_text !== undefined) { updates.push('cta_text = ?'); params.push(cta_text); }
    if (cta_url !== undefined) { updates.push('cta_url = ?'); params.push(cta_url); }
    if (secondary_cta_text !== undefined) { updates.push('secondary_cta_text = ?'); params.push(secondary_cta_text); }
    if (secondary_cta_url !== undefined) { updates.push('secondary_cta_url = ?'); params.push(secondary_cta_url); }
    if (image_url !== undefined) { updates.push('image_url = ?'); params.push(image_url); }
    if (video_url !== undefined) { updates.push('video_url = ?'); params.push(video_url); }
    if (is_active !== undefined) { updates.push('is_active = ?'); params.push(is_active ? 1 : 0); }
    if (display_order !== undefined || order_index !== undefined) {
      updates.push('display_order = ?');
      params.push(display_order !== undefined ? display_order : order_index);
    }
    if (section_type !== undefined) { updates.push('section_type = ?'); params.push(section_type); }

    if (updates.length === 0 && mobileImg === undefined) {
      return res.status(400).json({ success: false, message: 'No fields provided.' });
    }

    if (updates.length > 0) {
      params.push(id);
      await query(`UPDATE page_sections SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    if (mobileImg !== undefined) {
      try {
        await query('UPDATE page_sections SET image_mobile_url = ? WHERE id = ?', [mobileImg, id]);
      } catch (colErr) {
        if (colErr.code === 'ER_BAD_FIELD_ERROR' || colErr.message?.includes('image_mobile_url')) {
          try {
            await query('ALTER TABLE page_sections ADD COLUMN image_mobile_url VARCHAR(255) NULL AFTER image_url');
            await query('UPDATE page_sections SET image_mobile_url = ? WHERE id = ?', [mobileImg, id]);
          } catch {}
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Page section updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const deletePageSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM page_sections WHERE id = ?', [id]);
    return res.status(200).json({
      success: true,
      message: 'Page section deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const reorderPageSections = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const { orderedIds } = req.body; // Array of section IDs in new order

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds must be an array of section IDs.' });
    }

    for (let index = 0; index < orderedIds.length; index++) {
      await query(
        'UPDATE page_sections SET display_order = ? WHERE id = ? AND page_id = ?',
        [index + 1, orderedIds[index], pageId]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Section order updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
