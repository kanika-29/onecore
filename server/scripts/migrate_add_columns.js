/**
 * migrate_add_columns.js
 * Safely adds optional columns to existing tables if they don't exist.
 * Run once: node server/scripts/migrate_add_columns.js
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { query } from '../config/db.js';

async function columnExists(table, column) {
  const rows = await query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return rows.length > 0;
}

async function addColumnIfMissing(table, column, definition) {
  const exists = await columnExists(table, column);
  if (exists) {
    console.log(`  ✓ ${table}.${column} already exists — skipping`);
  } else {
    await query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    console.log(`  ✅ Added ${table}.${column}`);
  }
}

async function main() {
  console.log('\n🔧 Running Onecore CMS column migrations...\n');

  // news_articles
  await addColumnIfMissing('news_articles', 'read_time', "VARCHAR(50) NULL DEFAULT NULL AFTER status");

  // products — optional display fields used in admin UI seed
  await addColumnIfMissing('products', 'dosage_form', "VARCHAR(150) NULL DEFAULT NULL AFTER full_description");
  await addColumnIfMissing('products', 'tagline', "VARCHAR(255) NULL DEFAULT NULL AFTER dosage_form");
  await addColumnIfMissing('products', 'composition_summary', "VARCHAR(500) NULL DEFAULT NULL AFTER tagline");

  // page_sections — ensure items_json exists (may have been added by syncCmsDb)
  await addColumnIfMissing('page_sections', 'items_json', "JSON NULL DEFAULT NULL AFTER body");

  // media table — ensure original_name alias works (schema uses original_filename)
  // We'll use original_filename as the canonical column name. No change needed.

  console.log('\n✅ All migrations complete.\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration error:', err.message);
  process.exit(1);
});
