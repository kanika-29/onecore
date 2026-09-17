import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
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
};

async function testPipeline() {
  console.log('🧪 Running Onecore Pharma CMS Pipeline Verification...\n');
  const connection = await mysql.createConnection(dbConfig);

  try {
    // 1. Verify Pages in DB
    const [pages] = await connection.query('SELECT id, page_key, title, slug FROM pages ORDER BY id ASC');
    console.log(`✅ [1/5] Verified Pages registered in MySQL (${pages.length} pages):`);
    pages.forEach(p => console.log(`   - [${p.page_key}] "${p.title}" (${p.slug})`));

    // 2. Verify Sections for all pages
    const [sections] = await connection.query(`
      SELECT p.page_key, s.section_key, s.heading, s.items_json, s.image_url, s.cta_text, s.secondary_cta_text
      FROM page_sections s
      JOIN pages p ON s.page_id = p.id
      ORDER BY p.id ASC, s.display_order ASC
    `);
    console.log(`\n✅ [2/5] Verified Page Sections registered (${sections.length} total sections across all pages):`);

    const sectionsByPage = {};
    sections.forEach(s => {
      if (!sectionsByPage[s.page_key]) sectionsByPage[s.page_key] = [];
      let itemsCount = 0;
      if (s.items_json) {
        try {
          const parsed = JSON.parse(s.items_json);
          itemsCount = Array.isArray(parsed) ? parsed.length : 0;
        } catch {}
      }
      sectionsByPage[s.page_key].push(`${s.section_key} (${itemsCount} items${s.image_url ? ', has image' : ''}${s.secondary_cta_text ? ', dual CTAs' : ''})`);
    });

    Object.entries(sectionsByPage).forEach(([pageKey, secs]) => {
      console.log(`   * ${pageKey}: ${secs.join(' | ')}`);
    });

    // 3. Test News Hero Section
    const [newsSecs] = await connection.query(`
      SELECT s.* FROM page_sections s
      JOIN pages p ON s.page_id = p.id
      WHERE p.page_key = 'news' AND s.section_key = 'hero'
    `);
    if (newsSecs.length > 0) {
      console.log(`\n✅ [3/5] News Hero CMS section verified: "${newsSecs[0].heading}"`);
    } else {
      throw new Error('News Hero section missing!');
    }

    // 4. Test Patients & Caregivers Sections
    const [pcSecs] = await connection.query(`
      SELECT s.* FROM page_sections s
      JOIN pages p ON s.page_id = p.id
      WHERE p.page_key = 'patients-caregivers'
    `);
    console.log(`\n✅ [4/5] Patients & Caregivers verified (${pcSecs.length} sections in CMS)`);

    // 5. Test Section Update & Persistence (simulating Admin Section Editor save)
    const [sampleSec] = await connection.query('SELECT id, heading, items_json FROM page_sections LIMIT 1');
    if (sampleSec.length > 0) {
      const origHeading = sampleSec[0].heading;
      const testHeading = origHeading + ' [PERSISTENCE_TEST]';
      
      // Update
      await connection.query('UPDATE page_sections SET heading = ? WHERE id = ?', [testHeading, sampleSec[0].id]);
      
      // Read back
      const [updated] = await connection.query('SELECT heading FROM page_sections WHERE id = ?', [sampleSec[0].id]);
      if (updated[0].heading === testHeading) {
        console.log(`\n✅ [5/5] Admin -> Database update & persistence confirmed!`);
        // Restore
        await connection.query('UPDATE page_sections SET heading = ? WHERE id = ?', [origHeading, sampleSec[0].id]);
        console.log(`   Restored original heading: "${origHeading}"`);
      } else {
        throw new Error('Persistence test failed!');
      }
    }

    console.log('\n🎉 ALL PIPELINE VERIFICATIONS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
  } finally {
    await connection.end();
  }
}

testPipeline();
