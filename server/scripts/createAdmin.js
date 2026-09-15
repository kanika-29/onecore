import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function createAdminUser() {
  console.log('====================================================');
  console.log(' Onecore Pharma — Create Super Admin User');
  console.log('====================================================\n');

  // Check command line arguments: --name=..., --email=..., --password=...
  const args = process.argv.slice(2);
  let name = '';
  let email = '';
  let password = '';

  args.forEach((arg) => {
    if (arg.startsWith('--name=')) name = arg.split('=')[1];
    if (arg.startsWith('--email=')) email = arg.split('=')[1];
    if (arg.startsWith('--password=')) password = arg.split('=')[1];
  });

  if (!name) name = await askQuestion('Enter Admin Full Name (e.g. Administrator): ') || 'Super Administrator';
  if (!email) email = await askQuestion('Enter Admin Email (e.g. admin@onecorepharma.in): ') || 'admin@onecorepharma.in';
  if (!password) password = await askQuestion('Enter Admin Password: ') || 'Admin@Onecore2026!';

  if (!email || !password) {
    console.error('❌ Error: Email and password are required.');
    process.exit(1);
  }

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'onecore_pharma',
  };

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('\n Connected to MySQL database `onecore_pharma`');

    // Hash password using bcryptjs
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert or update admin user
    const [result] = await connection.execute(
      `INSERT INTO admin_users (name, email, password_hash, role_id, is_active, must_change_password)
       VALUES (?, ?, ?, 1, 1, 0)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         password_hash = VALUES(password_hash),
         role_id = 1,
         is_active = 1`,
      [name, email, passwordHash]
    );

    console.log('✅ Super Admin created/updated successfully!');
    console.log('----------------------------------------------------');
    console.log(`👤 Name:     ${name}`);
    console.log(`📧 Email:    ${email}`);
    console.log(`🔑 Role:     Super Admin`);
    console.log(`🌐 Login at: http://localhost:3000/admin/login`);
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('❌ Error creating Super Admin user:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

createAdminUser();
