import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Checks whether a directory is writable.
 */
export function isWritableDir(dir) {
  if (!dir) return false;
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Dynamically traverses up the directory tree to locate persistent storage
 * on Hostinger (e.g. hbuilds/shared_uploads or domain/shared_uploads)
 * and discovers the versions directory to rescue previously uploaded files.
 */
export function getStoragePaths(startDir = __dirname) {
  let curr = path.resolve(startDir);
  let sharedDir = null;
  let versionsDir = null;
  let domainDir = null;
  let hbuildsDir = null;

  for (let i = 0; i < 10; i++) {
    const parent = path.dirname(curr);
    if (!parent || parent === curr) break;

    const base = path.basename(curr);

    // If there is an existing shared_uploads folder
    const candidateShared = path.join(curr, 'shared_uploads');
    if (fs.existsSync(candidateShared)) {
      try {
        if (fs.statSync(candidateShared).isDirectory() && isWritableDir(candidateShared)) {
          sharedDir = candidateShared;
        }
      } catch {}
    }

    // Hostinger hbuilds root
    if (base === 'hbuilds') {
      hbuildsDir = curr;
      if (!sharedDir) {
        sharedDir = path.join(curr, 'shared_uploads');
      }
    }

    // Hostinger versioned deployments folder
    if (base === 'versions') {
      versionsDir = curr;
      if (!hbuildsDir) hbuildsDir = parent;
      if (!sharedDir) {
        sharedDir = path.join(parent, 'shared_uploads');
      }
    }

    // Domain root or public_html
    if (
      base.includes('hostingersite.com') ||
      base.includes('onecorepharma') ||
      base === 'public_html'
    ) {
      domainDir = curr;
    }

    curr = parent;
  }

  // Fallback to domain root if hbuilds wasn't directly found
  if (!sharedDir && domainDir) {
    sharedDir = path.join(domainDir, 'shared_uploads');
  }

  // Ensure persistent shared_uploads directory exists and is writable
  if (sharedDir && !fs.existsSync(sharedDir)) {
    try {
      fs.mkdirSync(sharedDir, { recursive: true });
    } catch (err) {
      console.warn('[Storage] Could not create shared directory:', sharedDir, err.message);
    }
  }

  return { sharedDir, versionsDir, hbuildsDir, domainDir };
}

/**
 * Rescues all orphan uploads from historical deployment and source folders
 * into the persistent shared_uploads directory.
 */
export function rescueAllOrphanUploads() {
  const { sharedDir, versionsDir, hbuildsDir } = getStoragePaths(__dirname);
  const localUploadsDir = path.resolve(__dirname, '../uploads');
  const rescued = [];

  const targetDir = (sharedDir && isWritableDir(sharedDir)) ? sharedDir : localUploadsDir;
  if (!targetDir || !fs.existsSync(targetDir)) return rescued;

  const candidateDirs = [
    hbuildsDir ? path.join(hbuildsDir, 'last-source', 'server', 'uploads') : null,
    hbuildsDir ? path.join(hbuildsDir, 'last-source', 'public', 'assets', 'uploads') : null,
    hbuildsDir ? path.join(hbuildsDir, 'last-source', 'uploads') : null,
    hbuildsDir ? path.join(hbuildsDir, 'current', 'nodejs', 'server', 'uploads') : null,
    hbuildsDir ? path.join(hbuildsDir, 'current', 'server', 'uploads') : null,
    hbuildsDir ? path.join(hbuildsDir, 'current', 'uploads') : null,
    path.resolve(__dirname, '../public/assets/uploads'),
    path.resolve(__dirname, '../../public/assets/uploads'),
  ].filter(Boolean);

  // Add all version directories if present
  if (versionsDir && fs.existsSync(versionsDir)) {
    try {
      const vers = fs.readdirSync(versionsDir);
      for (const ver of vers) {
        const verPath = path.join(versionsDir, ver);
        candidateDirs.push(path.join(verPath, 'server', 'uploads'));
        candidateDirs.push(path.join(verPath, 'nodejs', 'server', 'uploads'));
        candidateDirs.push(path.join(verPath, 'uploads'));
        candidateDirs.push(path.join(verPath, 'public', 'assets', 'uploads'));
      }
    } catch {}
  }

  for (const dir of candidateDirs) {
    try {
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (!file || file.startsWith('.')) continue;
          if (file.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i)) {
            const srcPath = path.join(dir, file);
            const destPath = path.join(targetDir, file);
            if (!fs.existsSync(destPath) && fs.existsSync(srcPath)) {
              try {
                fs.copyFileSync(srcPath, destPath);
                rescued.push({ file, from: dir, to: targetDir });
                if (localUploadsDir && targetDir !== localUploadsDir) {
                  try { fs.copyFileSync(srcPath, path.join(localUploadsDir, file)); } catch {}
                }
              } catch {}
            }
          }
        }
      }
    } catch {}
  }

  return rescued;
}

/**
 * Locates an uploaded file across:
 * 1. Persistent shared_uploads directory
 * 2. Custom UPLOADS_DIR (if set and writable)
 * 3. Historical build and source directories (last-source, current, versions)
 * 4. Local server/uploads directory
 * 5. Public assets uploads fallback directories
 */
export function findUploadedFile(filename, customUploadsDir = null) {
  const cleanName = path.basename(filename || '');
  if (!cleanName || cleanName === '.' || cleanName === '..') return null;

  const { sharedDir, versionsDir, hbuildsDir } = getStoragePaths(__dirname);
  const localUploadsDir = path.resolve(__dirname, '../uploads');
  const parentUploadsDir = path.resolve(__dirname, '../../uploads');

  // Primary directories in priority order
  const searchDirs = [
    sharedDir,
    customUploadsDir && isWritableDir(customUploadsDir) ? path.resolve(customUploadsDir) : null,
    hbuildsDir ? path.join(hbuildsDir, 'shared_uploads') : null,
    hbuildsDir ? path.join(hbuildsDir, 'last-source', 'server', 'uploads') : null,
    hbuildsDir ? path.join(hbuildsDir, 'last-source', 'public', 'assets', 'uploads') : null,
    hbuildsDir ? path.join(hbuildsDir, 'last-source', 'uploads') : null,
    hbuildsDir ? path.join(hbuildsDir, 'current', 'nodejs', 'server', 'uploads') : null,
    hbuildsDir ? path.join(hbuildsDir, 'current', 'server', 'uploads') : null,
    hbuildsDir ? path.join(hbuildsDir, 'current', 'uploads') : null,
    localUploadsDir,
    parentUploadsDir,
    path.resolve(__dirname, '../public/assets/uploads'),
    path.resolve(__dirname, '../public/assets'),
    path.resolve(__dirname, '../../public/assets/uploads'),
    path.resolve(__dirname, '../../public/assets'),
    path.resolve(__dirname, '../dist/assets/uploads'),
    path.resolve(__dirname, '../../dist/assets/uploads'),
  ].filter(Boolean);

  for (const dir of searchDirs) {
    try {
      if (fs.existsSync(dir)) {
        const candidate = path.join(dir, cleanName);
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          // If found in a secondary location, copy into sharedDir and localUploadsDir immediately
          if (sharedDir && dir !== sharedDir && isWritableDir(sharedDir)) {
            try {
              const sharedTarget = path.join(sharedDir, cleanName);
              if (!fs.existsSync(sharedTarget)) {
                fs.copyFileSync(candidate, sharedTarget);
              }
            } catch {}
          }
          if (localUploadsDir && dir !== localUploadsDir) {
            try {
              const localTarget = path.join(localUploadsDir, cleanName);
              if (!fs.existsSync(localTarget)) {
                fs.copyFileSync(candidate, localTarget);
              }
            } catch {}
          }
          return candidate;
        }
      }
    } catch {}
  }

  // Auto-rescue from sibling Hostinger versions
  if (versionsDir && fs.existsSync(versionsDir)) {
    try {
      const versionEntries = fs.readdirSync(versionsDir);
      for (const ver of versionEntries) {
        const verPath = path.join(versionsDir, ver);
        const candidates = [
          path.join(verPath, 'server', 'uploads', cleanName),
          path.join(verPath, 'nodejs', 'server', 'uploads', cleanName),
          path.join(verPath, 'uploads', cleanName),
          path.join(verPath, 'nodejs', 'uploads', cleanName),
          path.join(verPath, 'public', 'assets', 'uploads', cleanName),
        ];

        for (const cand of candidates) {
          try {
            if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
              if (sharedDir && isWritableDir(sharedDir)) {
                try { fs.copyFileSync(cand, path.join(sharedDir, cleanName)); } catch {}
              }
              if (localUploadsDir) {
                try { fs.copyFileSync(cand, path.join(localUploadsDir, cleanName)); } catch {}
              }
              return cand;
            }
          } catch {}
        }
      }
    } catch (err) {
      console.warn('[Storage] Error scanning sibling versions:', err.message);
    }
  }

  return null;
}

/**
 * Diagnostic tool to inspect Hostinger filesystem structure, discovery paths,
 * writable state, and run an auto-rescue on demand.
 */
export function getStorageDiagnostic() {
  const { sharedDir, versionsDir, hbuildsDir, domainDir } = getStoragePaths(__dirname);
  const cwd = process.cwd();
  const dirTree = [];

  let curr = path.resolve(__dirname);
  for (let i = 0; i < 6; i++) {
    try {
      const entries = fs.readdirSync(curr).slice(0, 30);
      dirTree.push({ path: curr, entries });
    } catch (e) {
      dirTree.push({ path: curr, error: e.message });
    }
    const parent = path.dirname(curr);
    if (!parent || parent === curr) break;
    curr = parent;
  }

  // Run auto-rescue to ensure all historical uploads are consolidated
  const rescued = rescueAllOrphanUploads();

  // List all files currently in sharedDir
  let sharedFiles = [];
  if (sharedDir && fs.existsSync(sharedDir)) {
    try {
      sharedFiles = fs.readdirSync(sharedDir).filter(f => !f.startsWith('.'));
    } catch {}
  }

  const customUploadsDir = process.env.UPLOADS_DIR ? path.resolve(process.env.UPLOADS_DIR) : null;

  return {
    cwd,
    dirname: __dirname,
    uploadsEnv: process.env.UPLOADS_DIR || null,
    isCustomUploadsDirWritable: customUploadsDir ? isWritableDir(customUploadsDir) : null,
    sharedDir,
    isSharedDirWritable: sharedDir ? isWritableDir(sharedDir) : false,
    versionsDir,
    hbuildsDir,
    domainDir,
    dirTree,
    rescuedCount: rescued.length,
    rescuedSample: rescued.slice(0, 20),
    sharedFilesCount: sharedFiles.length,
    sharedFilesSample: sharedFiles.slice(0, 30),
  };
}
