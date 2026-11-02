import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { getStoragePaths } from '../utils/storage.js';

// Auto-detect Hostinger persistent shared storage
const { sharedDir } = getStoragePaths(__dirname);

function resolveSafeUploadDir() {
  const customDir = process.env.UPLOADS_DIR ? path.resolve(process.env.UPLOADS_DIR) : null;
  if (customDir) {
    try {
      if (!fs.existsSync(customDir)) fs.mkdirSync(customDir, { recursive: true });
      fs.accessSync(customDir, fs.constants.W_OK);
      return customDir;
    } catch (e) {
      console.warn('[Upload] Custom UPLOADS_DIR not writable, falling back:', customDir, e.message);
    }
  }

  if (sharedDir) {
    try {
      if (!fs.existsSync(sharedDir)) fs.mkdirSync(sharedDir, { recursive: true });
      fs.accessSync(sharedDir, fs.constants.W_OK);
      return sharedDir;
    } catch (e) {
      console.warn('[Upload] Shared storage dir not writable:', sharedDir, e.message);
    }
  }

  const local = path.join(__dirname, '..', 'uploads');
  try {
    if (!fs.existsSync(local)) fs.mkdirSync(local, { recursive: true });
  } catch {}
  return local;
}

const uploadDir = resolveSafeUploadDir();

const localUploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(localUploadsDir)) {
  try { fs.mkdirSync(localUploadsDir, { recursive: true }); } catch {}
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBaseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const finalFilename = `${safeBaseName}-${uniqueSuffix}${ext}`;
    
    // Asynchronously guarantee file is replicated to sharedDir, localUploadsDir, and public assets
    setTimeout(() => {
      try {
        const savedFile = path.join(uploadDir, finalFilename);
        if (fs.existsSync(savedFile)) {
          if (sharedDir && uploadDir !== sharedDir) {
            const sharedDest = path.join(sharedDir, finalFilename);
            if (!fs.existsSync(sharedDest)) {
              fs.copyFileSync(savedFile, sharedDest);
            }
          }
          if (localUploadsDir && uploadDir !== localUploadsDir) {
            const localDest = path.join(localUploadsDir, finalFilename);
            if (!fs.existsSync(localDest)) {
              fs.copyFileSync(savedFile, localDest);
            }
          }
          // Also sync to public assets if accessible
          const publicUploads = path.join(__dirname, '../../public/assets/uploads');
          if (fs.existsSync(publicUploads)) {
            try { fs.copyFileSync(savedFile, path.join(publicUploads, finalFilename)); } catch {}
          }
        }
      } catch {}
    }, 200);
    
    cb(null, finalFilename);
  },
});

const allowedMimes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
];

const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, SVG, PDF`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});
