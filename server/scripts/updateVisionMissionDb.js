import { query } from '../config/db.js';

const newVisionText = 'To become one of India’s most trusted healthcare companies, shaping better health and better lives through quality, innovation and purpose.';
const newMissionText = 'To provide the medical fraternity with trusted medicines and innovative healthcare solutions, while empowering our people and stakeholders through intellectual, professional and financial growth.';

async function run() {
  console.log('🔄 Checking and updating Vision & Mission in MySQL database...');
  try {
    const rows = await query("SELECT id, page_id, section_key, heading, items_json FROM page_sections WHERE section_key IN ('mission_vision', 'our_purpose') OR items_json LIKE '%Vision%'");
    console.log(`Found ${rows.length} relevant sections in page_sections:`);
    
    for (const row of rows) {
      console.log(`- ID: ${row.id}, PageID: ${row.page_id}, Key: ${row.section_key}`);
      let items = [];
      try {
        items = typeof row.items_json === 'string' ? JSON.parse(row.items_json) : (row.items_json || []);
      } catch (err) {
        console.error(`  Error parsing items_json for ID ${row.id}:`, err.message);
        continue;
      }

      let updated = false;
      if (Array.isArray(items)) {
        for (const item of items) {
          const t = (item.title || '').toLowerCase();
          if (t.includes('vision')) {
            console.log(`  Updating Vision item in section ${row.section_key}...`);
            item.desc = newVisionText;
            updated = true;
          }
          if (t.includes('mission')) {
            console.log(`  Updating Mission item in section ${row.section_key}...`);
            item.desc = newMissionText;
            updated = true;
          }
        }
      }

      if (updated) {
        const newJson = JSON.stringify(items);
        await query("UPDATE page_sections SET items_json = ? WHERE id = ?", [newJson, row.id]);
        console.log(`  ✅ Successfully updated section ID ${row.id}`);
      }
    }

    // Also check if About page has mission_vision section
    const aboutPages = await query("SELECT id FROM pages WHERE page_key = 'about' OR slug = '/about'");
    if (aboutPages && aboutPages.length > 0) {
      const aboutId = aboutPages[0].id;
      const existingMv = await query("SELECT id FROM page_sections WHERE page_id = ? AND section_key = 'mission_vision'", [aboutId]);
      if (existingMv.length === 0) {
        console.log('  Adding mission_vision section to About page in DB...');
        const newItems = JSON.stringify([
          {
            title: 'Our Vision',
            desc: newVisionText,
          },
          {
            title: 'Our Mission',
            desc: newMissionText,
          }
        ]);
        await query(`
          INSERT INTO page_sections (page_id, section_key, section_type, eyebrow, heading, items_json, display_order, is_active)
          VALUES (?, 'mission_vision', 'vision_mission', 'VISION & MISSION', 'Vision & Mission', ?, 2, 1)
        `, [aboutId, newItems]);
        console.log('  ✅ Created mission_vision section in DB.');
      }
    }

    console.log('🎉 Vision & Mission database synchronization completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during update:', err.message);
    process.exit(1);
  }
}

run();
