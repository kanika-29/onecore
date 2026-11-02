import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Multi-Version Environment Auto-Discovery for Hostinger & Cloud Deployments
 * Automatically locates .env across active build, parent directories, and all
 * sibling Hostinger build versions in hbuilds/versions/* so credentials persist
 * across every git deployment.
 */
export function loadEnvironment() {
  // If required environment variables are already set (e.g. from Hostinger hPanel Environment Variables), we're good
  if (process.env.DB_USER && process.env.DB_PASSWORD) {
    console.log('✅ Environment variables already present in process.env (Hostinger System / hPanel):', {
      DB_HOST: process.env.DB_HOST || 'localhost',
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME || 'u222341186_onecore',
    });

    // Write a permanent backup to hbuilds/.env and server/.env so credentials never get lost
    try {
      const envContent = [
        `PORT=${process.env.PORT || 5000}`,
        `NODE_ENV=${process.env.NODE_ENV || 'production'}`,
        `JWT_SECRET=${process.env.JWT_SECRET || 'onecore_pharma_jwt_secure_key_2026_super_secret_token'}`,
        `JWT_EXPIRES_IN=${process.env.JWT_EXPIRES_IN || '7d'}`,
        `DB_HOST=${process.env.DB_HOST || 'localhost'}`,
        `DB_PORT=${process.env.DB_PORT || 3306}`,
        `DB_USER=${process.env.DB_USER}`,
        `DB_PASSWORD=${process.env.DB_PASSWORD}`,
        `DB_NAME=${process.env.DB_NAME || 'u222341186_onecore'}`,
      ].join('\n') + '\n';

      const primaryEnv = path.resolve(__dirname, '..', '.env');
      if (!fs.existsSync(primaryEnv)) {
        fs.writeFileSync(primaryEnv, envContent, 'utf-8');
      }

      let cur = __dirname;
      for (let i = 0; i < 7; i++) {
        cur = path.dirname(cur);
        if (path.basename(cur) === 'hbuilds') {
          const hbuildsEnv = path.join(cur, '.env');
          fs.writeFileSync(hbuildsEnv, envContent, 'utf-8');
          console.log(`✅ Persisted backup environment to: ${hbuildsEnv}`);
          break;
        }
      }
    } catch {}

    return 'process.env';
  }

  const primaryEnvPath = path.resolve(__dirname, '..', '.env');
  const rootEnvPath = path.resolve(__dirname, '../..', '.env');
  const cwdEnvPath = path.resolve(process.cwd(), '.env');
  const cwdServerEnvPath = path.resolve(process.cwd(), 'server', '.env');

  // Candidate paths in order of priority
  const candidates = [
    primaryEnvPath,
    rootEnvPath,
    cwdEnvPath,
    cwdServerEnvPath,
  ];

  // 1. Check parent directories of __dirname and process.cwd() up to 7 levels (e.g. hbuilds/.env, domain root .env)
  try {
    let curDir = __dirname;
    for (let i = 0; i < 7; i++) {
      curDir = path.dirname(curDir);
      candidates.push(path.join(curDir, '.env'));
      candidates.push(path.join(curDir, 'server', '.env'));
      candidates.push(path.join(curDir, 'shared', '.env'));
      candidates.push(path.join(curDir, 'shared_env', '.env'));
    }

    let curCwd = process.cwd();
    for (let i = 0; i < 7; i++) {
      curCwd = path.dirname(curCwd);
      candidates.push(path.join(curCwd, '.env'));
      candidates.push(path.join(curCwd, 'server', '.env'));
    }
  } catch {}

  // 2. Auto-scan all sibling Hostinger build versions in hbuilds/versions/*/
  try {
    const searchRoots = [
      path.resolve(__dirname, '../../..'),
      path.resolve(__dirname, '../../../..'),
      path.resolve(__dirname, '../../../../..'),
      path.resolve(process.cwd(), '..'),
      path.resolve(process.cwd(), '../..'),
    ];

    for (const r of searchRoots) {
      const versionsDir = path.basename(r) === 'versions' ? r : path.join(r, 'versions');
      if (fs.existsSync(versionsDir)) {
        try {
          const verFolders = fs.readdirSync(versionsDir);
          for (const ver of verFolders) {
            candidates.push(path.join(versionsDir, ver, 'nodejs', 'server', '.env'));
            candidates.push(path.join(versionsDir, ver, 'server', '.env'));
            candidates.push(path.join(versionsDir, ver, 'nodejs', '.env'));
            candidates.push(path.join(versionsDir, ver, '.env'));
          }
        } catch {}
      }
    }
  } catch {}

  let loadedFile = null;
  const uniqueCandidates = [...new Set(candidates.filter(Boolean))];

  for (const cand of uniqueCandidates) {
    if (fs.existsSync(cand)) {
      try {
        const stats = fs.statSync(cand);
        if (stats.isFile() && stats.size > 0) {
          const content = fs.readFileSync(cand, 'utf-8');
          // Must contain at least DB or JWT configuration
          if (content.includes('DB_') || content.includes('JWT_') || content.includes('PORT')) {
            dotenv.config({ path: cand });
            loadedFile = cand;
            console.log(`✅ Loaded environment configuration from: ${cand}`);

            // Auto-persist into current active server/.env so local reads are instant
            if (cand !== primaryEnvPath) {
              try {
                fs.copyFileSync(cand, primaryEnvPath);
                console.log(`✅ Auto-synced .env to active build at: ${primaryEnvPath}`);
              } catch {}
            }

            // Also persist into persistent hbuilds root directory so future deploys always find it
            try {
              let cur = __dirname;
              for (let i = 0; i < 6; i++) {
                cur = path.dirname(cur);
                if (path.basename(cur) === 'hbuilds') {
                  const persistentEnv = path.join(cur, '.env');
                  if (!fs.existsSync(persistentEnv)) {
                    fs.copyFileSync(cand, persistentEnv);
                    console.log(`✅ Auto-synced persistent .env to: ${persistentEnv}`);
                  }
                  break;
                }
              }
            } catch {}

            break;
          }
        }
      } catch {}
    }
  }

  if (!loadedFile) {
    dotenv.config({ path: primaryEnvPath });
  }

  return loadedFile;
}

// Execute immediately upon module import
loadEnvironment();

export default loadEnvironment;
