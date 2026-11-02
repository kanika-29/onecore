import { query } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncAllCmsSections() {
  console.log('🚀 Starting Full CMS Synchronization & Enhancement...\n');

  try {
    // ---------------------------------------------------------
    // 1. CREATE product_images TABLE IF NOT EXISTS
    // ---------------------------------------------------------
    console.log('📦 1. Setting up product_images table...');
    await query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        product_id INT UNSIGNED NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        alt_text VARCHAR(255) DEFAULT NULL,
        is_primary TINYINT(1) DEFAULT 0,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_product_id (product_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ product_images table ready.');

    // Populate existing product images into product_images table
    const [existingCount] = await query('SELECT COUNT(*) as count FROM product_images');
    if (existingCount.count === 0) {
      console.log('📸 Migrating existing packshot images into product_images table...');
      const prodsWithImages = await query(
        "SELECT id, brand_name, packshot_url FROM products WHERE packshot_url IS NOT NULL AND packshot_url != ''"
      );
      for (const prod of prodsWithImages) {
        await query(
          `INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
           VALUES (?, ?, ?, 1, 0)`,
          [prod.id, prod.packshot_url, `${prod.brand_name} Packshot`]
        );
      }
      console.log(`✅ Seeded ${prodsWithImages.length} initial product photos.`);
    } else {
      console.log(`ℹ️ product_images table already has ${existingCount.count} photos.`);
    }

    // ---------------------------------------------------------
    // 2. REGISTER ALL APPROVED IMAGES IN MEDIA TABLE
    // ---------------------------------------------------------
    console.log('\n🖼️ 2. Synchronizing approved assets to media table...');
    const publicAssetsDir = path.join(__dirname, '..', '..', 'public', 'assets');

    const scanDirectory = (dir, urlPrefix) => {
      let results = [];
      if (!fs.existsSync(dir)) return results;
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          results = results.concat(scanDirectory(fullPath, `${urlPrefix}/${file}`));
        } else {
          const ext = path.extname(file).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.mp4'].includes(ext)) {
            results.push({
              filename: file,
              filePath: `${urlPrefix}/${file}`,
              size: stat.size,
              ext: ext.replace('.', ''),
            });
          }
        }
      }
      return results;
    };

    const assets = scanDirectory(publicAssetsDir, '/assets');
    let addedAssetsCount = 0;

    for (const asset of assets) {
      const mimeType = asset.ext === 'mp4' ? 'video/mp4' : `image/${asset.ext === 'jpg' ? 'jpeg' : asset.ext}`;
      const friendlyAlt = asset.filename
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const [existing] = await query('SELECT id FROM media WHERE file_path = ?', [asset.filePath]);
      if (!existing) {
        await query(
          `INSERT INTO media (filename, original_filename, file_path, mime_type, file_size, alt_text, created_at)
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [asset.filename, asset.filename, asset.filePath, mimeType, asset.size, friendlyAlt]
        );
        addedAssetsCount++;
      }
    }
    console.log(`✅ Synced approved assets. (${addedAssetsCount} newly added to media library)`);

    // ---------------------------------------------------------
    // 3. SYNCHRONIZE PAGES AND SECTIONS FOR EVERY PAGE
    // ---------------------------------------------------------
    console.log('\n📄 3. Harmonizing page sections and keys...');

    // Helper to get or create page
    const getOrCreatePage = async (pageKey, title, seoTitle, seoDesc) => {
      const rows = await query('SELECT id FROM pages WHERE page_key = ?', [pageKey]);
      if (rows && rows.length > 0) return rows[0].id;
      const slugVal = pageKey === 'home' ? '/' : `/${pageKey}`;
      const res = await query(
        'INSERT INTO pages (page_key, title, slug, seo_title, seo_description, status) VALUES (?, ?, ?, ?, ?, "published")',
        [pageKey, title, slugVal, seoTitle, seoDesc]
      );
      return res.insertId;
    };

    // Helper to upsert section
    const upsertSection = async (pageId, sectionKey, type, data) => {
      const existing = await query(
        'SELECT id FROM page_sections WHERE page_id = ? AND section_key = ?',
        [pageId, sectionKey]
      );

      const itemsJson = data.items ? JSON.stringify(data.items) : null;

      if (existing && existing.length > 0) {
        await query(
          `UPDATE page_sections SET
             section_type = ?,
             heading = ?,
             subheading = ?,
             eyebrow = ?,
             body = ?,
             image_url = ?,
             video_url = ?,
             cta_text = ?,
             cta_url = ?,
             secondary_cta_text = ?,
             secondary_cta_url = ?,
             items_json = IFNULL(items_json, ?),
             is_active = 1
           WHERE id = ?`,
          [
            type,
            data.heading || data.title || '',
            data.subheading || data.subtitle || '',
            data.eyebrow || '',
            data.body || '',
            data.image_url || '',
            data.video_url || '',
            data.cta_text || '',
            data.cta_url || '',
            data.secondary_cta_text || '',
            data.secondary_cta_url || '',
            itemsJson,
            existing[0].id,
          ]
        );
      } else {
        await query(
          `INSERT INTO page_sections (
             page_id, section_key, section_type, heading, subheading, eyebrow, body,
             image_url, video_url, cta_text, cta_url, secondary_cta_text, secondary_cta_url,
             items_json, is_active, display_order
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
          [
            pageId,
            sectionKey,
            type,
            data.heading || data.title || '',
            data.subheading || data.subtitle || '',
            data.eyebrow || '',
            data.body || '',
            data.image_url || '',
            data.video_url || '',
            data.cta_text || '',
            data.cta_url || '',
            data.secondary_cta_text || '',
            data.secondary_cta_url || '',
            itemsJson,
            data.display_order || 0,
          ]
        );
      }
    };

    // Page 1: Home — Align hero image to /assets/hero-healthcare.jpg and section keys
    const homeId = await getOrCreatePage('home', 'Home', 'Onecore Pharma | Prescribing a Better Tomorrow', 'Pharmaceutical excellence in India');
    await query("UPDATE page_sections SET image_url = '/assets/hero-healthcare.jpg' WHERE page_id = ? AND section_key = 'hero'", [homeId]);
    await query("UPDATE page_sections SET section_key = 'about_onecore' WHERE page_id = ? AND section_key = 'about_overview'", [homeId]);

    // Page 2: About — Add missing mission_vision section
    const aboutId = await getOrCreatePage('about', 'About Onecore', 'About Onecore Pharma', 'Our foundation and vision');
    await upsertSection(aboutId, 'mission_vision', 'vision_mission', {
      heading: 'Our Vision & Mission',
      subheading: 'Guided by patient health outcomes and ethical medicine delivery across India.',
      items: [
        {
          num: '01',
          title: 'Our Vision',
          desc: 'To become one of India’s most trusted healthcare companies, shaping better health and better lives through quality, innovation and purpose.',
        },
        {
          num: '02',
          title: 'Our Mission',
          desc: 'To provide the medical fraternity with trusted medicines and innovative healthcare solutions, while empowering our people and stakeholders through intellectual, professional and financial growth.',
        },
      ],
      display_order: 1,
    });

    // Page 7: Contact — Update enquiry_types to partnerships_section with 4 pillars
    const contactId = await getOrCreatePage('contact', 'Contact', 'Contact Onecore Pharma', 'Get in touch with Onecore');
    await query("UPDATE page_sections SET section_key = 'partnerships_section' WHERE page_id = ? AND section_key = 'enquiry_types'", [contactId]);
    await upsertSection(contactId, 'partnerships_section', 'timeline_list', {
      heading: 'Distribution & Franchise Partnerships',
      subheading: 'Grow with Onecore.',
      eyebrow: 'PARTNERSHIP OPPORTUNITIES',
      body: 'We are expanding our distribution network across India and are looking to partner with pharmaceutical distributors and franchise partners who understand their markets and want to build for the long term.',
      cta_text: 'Explore Partnerships',
      cta_url: '/partnerships',
      items: [
        {
          num: '01',
          title: 'Broad portfolio',
          desc: 'Access products across multiple therapeutic areas, helping you build a more diversified business.',
        },
        {
          num: '02',
          title: 'Territory focused approach',
          desc: 'Work within clearly discussed markets with a focus on sustainable product movement and growth.',
        },
        {
          num: '03',
          title: 'Better inventory planning',
          desc: 'We believe in practical stock planning and consistent replenishment rather than unnecessary inventory loading.',
        },
        {
          num: '04',
          title: 'Partner support',
          desc: 'Receive product information, promotional support and a dedicated point of contact to resolve operational questions.',
        },
      ],
      display_order: 2,
    });

    // Page: Partnerships (Dedicated Page)
    const partId = await getOrCreatePage(
      'partnerships',
      'Distribution & Partnerships',
      'Distribution & Franchise Partnerships | Onecore Pharma',
      'Partner with Onecore Pharma across India'
    );
    await upsertSection(partId, 'hero', 'hero', {
      eyebrow: 'GROW WITH ONECORE',
      heading: 'Distribution & Franchise Partnerships.',
      subheading: 'Reliable supply, structured commercial support, and long-term value creation.',
      body: 'We are expanding our distribution network across India and are looking to partner with pharmaceutical distributors and franchise partners who understand their markets and want to build for the long term.',
      image_url: '/assets/about-facility.jpg',
      cta_text: 'Apply for Partnership',
      cta_url: '#partner-form',
      display_order: 0,
    });
    await upsertSection(partId, 'pillars', 'cards_grid', {
      eyebrow: 'STRATEGIC ADVANTAGES',
      heading: 'Why partner with Onecore',
      subheading: 'A disciplined commercial framework designed for mutual growth and sustainable distribution.',
      items: [
        {
          num: '01',
          title: 'Broad portfolio',
          desc: 'Access products across multiple therapeutic areas, helping you build a more diversified business.',
        },
        {
          num: '02',
          title: 'Territory focused approach',
          desc: 'Work within clearly discussed markets with a focus on sustainable product movement and growth.',
        },
        {
          num: '03',
          title: 'Better inventory planning',
          desc: 'We believe in practical stock planning and consistent replenishment rather than unnecessary inventory loading.',
        },
        {
          num: '04',
          title: 'Partner support',
          desc: 'Receive product information, promotional support and a dedicated point of contact to resolve operational questions.',
        },
      ],
      display_order: 1,
    });

    // Page: Areas of Care (Catalog Page)
    const areasPageId = await getOrCreatePage(
      'areas-of-care',
      'Therapeutic Areas',
      'Areas of Care | Onecore Pharma',
      'Specialized therapeutic formulations across 9 divisions'
    );
    await upsertSection(areasPageId, 'hero', 'hero', {
      eyebrow: '',
      heading: 'Our medicines & areas of care.',
      subheading: 'Explore Onecore’s 9 specialized therapeutic divisions and over 60 clinically engineered prescription medicines, supportive therapies, and micronutrient formulations.',
      display_order: 0,
    });
    await upsertSection(areasPageId, 'portfolio_intro', 'editorial', {
      heading: 'Explore by area of care',
      body: 'Every division is dedicated to addressing specific clinical indications with patient-first precision.',
      display_order: 1,
    });

    console.log('✅ All pages and sections harmonized and linked.');
    console.log('\n🎉 CMS SYNCHRONIZATION COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Sync Error:', err);
    process.exit(1);
  }
}

syncAllCmsSections();
