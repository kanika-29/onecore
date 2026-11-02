import '../config/env.js';
import pool, { query } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function syncCatalogToDatabase() {
  console.log('🔄 Starting Onecore Product Catalog Sync to MySQL Database...');
  
  const catalogPath = path.resolve(__dirname, '../data/productsCatalog.json');
  if (!fs.existsSync(catalogPath)) {
    throw new Error(`Catalog file not found at: ${catalogPath}`);
  }

  const products = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
  console.log(`📦 Loaded ${products.length} products from catalog.`);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    console.log('🧹 Purging outdated product child records...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    try {
      await connection.query('ALTER TABLE products MODIFY COLUMN short_description TEXT NULL');
      await connection.query('ALTER TABLE products MODIFY COLUMN composition_summary TEXT NULL');
      await connection.query('ALTER TABLE products MODIFY COLUMN seo_description TEXT NULL');
      await connection.query('ALTER TABLE product_compositions MODIFY COLUMN ingredient_name TEXT NULL');
      await connection.query('ALTER TABLE product_mechanisms MODIFY COLUMN title TEXT NULL');
      await connection.query('ALTER TABLE product_mechanisms MODIFY COLUMN description TEXT NULL');
      await connection.query('ALTER TABLE product_benefits MODIFY COLUMN title TEXT NULL');
      await connection.query('ALTER TABLE product_benefits MODIFY COLUMN description TEXT NULL');
      await connection.query('ALTER TABLE product_dosage MODIFY COLUMN description TEXT NULL');
      await connection.query('ALTER TABLE product_safety_sections MODIFY COLUMN title TEXT NULL');
      await connection.query('ALTER TABLE product_safety_sections MODIFY COLUMN description TEXT NULL');
    } catch (alterErr) {
      console.warn('⚠️ Column modification notice:', alterErr.message);
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_therapeutic_areas (
        product_id INT UNSIGNED NOT NULL,
        therapeutic_area_id INT UNSIGNED NOT NULL,
        display_order INT NOT NULL DEFAULT 0,
        PRIMARY KEY (product_id, therapeutic_area_id),
        KEY (therapeutic_area_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.query('TRUNCATE TABLE product_safety_sections');
    await connection.query('TRUNCATE TABLE product_mechanisms');
    await connection.query('TRUNCATE TABLE product_dosage');
    await connection.query('TRUNCATE TABLE product_benefits');
    await connection.query('TRUNCATE TABLE product_compositions');
    await connection.query('TRUNCATE TABLE product_images');
    await connection.query('TRUNCATE TABLE product_therapeutic_areas');
    await connection.query('TRUNCATE TABLE products');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log(`🚀 Inserting ${products.length} fresh products into database...`);

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const pid = i + 1;

      // 1. Insert product
      await connection.query(
        `INSERT INTO products 
         (id, therapeutic_area_id, brand_name, slug, short_description, full_description, composition_summary, packshot_url, status, display_order, seo_title, seo_description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?)`,
        [
          pid,
          p.therapeutic_area_id,
          p.brand_name,
          p.slug,
          p.short_description,
          p.full_description,
          p.composition_summary,
          p.packshot_url,
          pid,
          `${p.brand_name} | Onecore Pharma`,
          p.short_description,
        ]
      );

      // 1b. Insert into product_therapeutic_areas junction table
      const areas = Array.isArray(p.therapeutic_areas) && p.therapeutic_areas.length > 0
        ? p.therapeutic_areas
        : (Array.isArray(p.therapeutic_area_ids) ? p.therapeutic_area_ids.map(id => ({ id, display_order: pid })) : [{ id: p.therapeutic_area_id, display_order: pid }]);

      for (const a of areas) {
        const targetAreaId = a.id || a.area_id || a;
        const order = a.display_order || pid;
        await connection.query(
          `INSERT INTO product_therapeutic_areas (product_id, therapeutic_area_id, display_order)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE display_order = VALUES(display_order)`,
          [pid, targetAreaId, order]
        );
      }

      // 2. Insert Composition
      if (p.composition_summary) {
        await connection.query(
          `INSERT INTO product_compositions (product_id, ingredient_name, strength, display_order)
           VALUES (?, ?, '', 1)`,
          [pid, p.composition_summary]
        );
      }

      // 3. Insert Dosage
      if (p.dosage_guidance) {
        await connection.query(
          `INSERT INTO product_dosage (product_id, heading, description)
           VALUES (?, 'Administration and Dosage Guidance', ?)`,
          [pid, p.dosage_guidance]
        );
      }

      // 4. Insert Benefits / Indications
      if (Array.isArray(p.benefits)) {
        for (let b = 0; b < p.benefits.length; b++) {
          const item = p.benefits[b];
          await connection.query(
            `INSERT INTO product_benefits (product_id, title, description, display_order)
             VALUES (?, ?, ?, ?)`,
            [pid, item.title, item.description, b + 1]
          );
        }
      }

      // 5. Insert Mechanisms
      if (Array.isArray(p.mechanisms)) {
        for (let m = 0; m < p.mechanisms.length; m++) {
          const item = p.mechanisms[m];
          await connection.query(
            `INSERT INTO product_mechanisms (product_id, title, description, display_order)
             VALUES (?, ?, ?, ?)`,
            [pid, item.title, item.description, m + 1]
          );
        }
      }

      // 6. Insert Safety Sections
      if (Array.isArray(p.safety_sections)) {
        for (let s = 0; s < p.safety_sections.length; s++) {
          const item = p.safety_sections[s];
          await connection.query(
            `INSERT INTO product_safety_sections (product_id, section_key, title, description, display_order)
             VALUES (?, ?, ?, ?, ?)`,
            [pid, item.section_key, item.title, item.description, s + 1]
          );
        }
      }

      // 7. Insert primary packaging packshot image
      if (p.packshot_url && !p.packshot_url.startsWith('/assets/therapeutic-')) {
        await connection.query(
          `INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
           VALUES (?, ?, ?, 1, 0)`,
          [pid, p.packshot_url, `${p.brand_name} Packaging Packshot`]
        );
      }
    }

    await connection.commit();
    console.log(`✅ Successfully synced all ${products.length} products with TM preserved into MySQL!`);
    return { success: true, count: products.length };
  } catch (err) {
    await connection.rollback();
    console.error('❌ Failed to sync products to database:', err);
    throw err;
  } finally {
    connection.release();
  }
}

export async function deleteAllProductsFromDatabase() {
  console.log('🗑️ Purging all products and related child tables from database...');
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE product_safety_sections');
    await connection.query('TRUNCATE TABLE product_mechanisms');
    await connection.query('TRUNCATE TABLE product_dosage');
    await connection.query('TRUNCATE TABLE product_benefits');
    await connection.query('TRUNCATE TABLE product_compositions');
    await connection.query('TRUNCATE TABLE product_images');
    await connection.query('TRUNCATE TABLE product_therapeutic_areas');
    await connection.query('TRUNCATE TABLE products');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    await connection.commit();
    console.log('✅ Successfully purged all products from MySQL database.');
    return { success: true };
  } catch (err) {
    await connection.rollback();
    console.error('❌ Failed to purge products from database:', err);
    throw err;
  } finally {
    connection.release();
  }
}

// Allow direct CLI execution: node server/scripts/syncProducts.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncCatalogToDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

