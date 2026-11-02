import { query } from '../config/db.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getStoragePaths, rescueAllOrphanUploads } from '../utils/storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getMediaList = async (req, res, next) => {
  try {
    // 1. Run auto-rescue to ensure all historical uploads across builds are in sharedDir
    try {
      rescueAllOrphanUploads();
    } catch {}

    // 2. Fetch existing media records from database
    const media = await query(
      `SELECT m.*, u.name as uploaded_by_name
       FROM media m
       LEFT JOIN admin_users u ON m.uploaded_by = u.id
       ORDER BY m.created_at DESC`
    );

    const existingFilenames = new Set((media || []).map((m) => m.filename));

    // 3. Scan physical upload directories to auto-register any missing files into media table
    const { sharedDir } = getStoragePaths(__dirname);
    const candidateDirs = [
      path.resolve(__dirname, '../../public/assets/uploads'),
      path.resolve(__dirname, '../public/assets/uploads'),
      sharedDir,
      path.resolve(__dirname, '../uploads'),
    ].filter(Boolean);

    for (const dir of candidateDirs) {
      try {
        if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            if (!file || file.startsWith('.')) continue;
            if (file.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i) && !existingFilenames.has(file)) {
              try {
                const stat = fs.statSync(path.join(dir, file));
                const ext = path.extname(file).toLowerCase();
                const mime =
                  ext === '.png'
                    ? 'image/png'
                    : ext === '.webp'
                    ? 'image/webp'
                    : ext === '.svg'
                    ? 'image/svg+xml'
                    : 'image/jpeg';
                const relativePath = `/uploads/${file}`;

                await query(
                  `INSERT INTO media (filename, original_filename, file_path, mime_type, file_size, alt_text, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                  [file, file, relativePath, mime, stat.size, file]
                );
                existingFilenames.add(file);
              } catch {}
            }
          }
        }
      } catch {}
    }

    // 4. Re-query so all newly cataloged media are included
    const refreshedMedia = await query(
      `SELECT m.*, u.name as uploaded_by_name
       FROM media m
       LEFT JOIN admin_users u ON m.uploaded_by = u.id
       ORDER BY m.created_at DESC`
    );

    const normalizedMedia = (refreshedMedia || []).map((item) => {
      const file = item.file_path || item.url || item.path || item.filename || '';

      let cleanUrl = '';
      if (!file) {
        cleanUrl = '';
      } else if (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('data:')) {
        cleanUrl = file;
      } else if (file.startsWith('/assets/') || file.startsWith('assets/')) {
        cleanUrl = file.startsWith('/assets/') ? file : `/${file}`;
      } else {
        // Ensure path always begins with '/uploads/' and never has duplicate slashes
        cleanUrl = file.startsWith('/uploads/')
          ? file
          : `/uploads/${file.replace(/^\/+/, '')}`;
        // Prevent duplicate /uploads/uploads/
        cleanUrl = cleanUrl.replace(/^\/uploads\/uploads\//, '/uploads/');
      }

      return {
        ...item,
        file_path: cleanUrl,
        url: cleanUrl,
        path: cleanUrl,
      };
    });

    return res.status(200).json({ success: true, data: normalizedMedia });
  } catch (error) {
    next(error);
  }
};

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { altText } = req.body;
    const file = req.file;
    const cleanFilename = file.filename.replace(/^\/+/, '').replace(/^uploads\//, '');
    const relativePath = `/uploads/${cleanFilename}`;

    const result = await query(
      `INSERT INTO media (filename, original_filename, file_path, mime_type, file_size, alt_text, uploaded_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        file.filename,
        file.originalname,
        relativePath,
        file.mimetype,
        file.size,
        altText || file.originalname,
        req.user?.id || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      data: {
        id: result.insertId,
        filename: file.filename,
        original_filename: file.originalname,
        file_path: relativePath,
        url: relativePath,
        path: relativePath,
        mime_type: file.mimetype,
        file_size: file.size,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mediaItems = await query('SELECT * FROM media WHERE id = ?', [id]);

    if (!mediaItems || mediaItems.length === 0) {
      return res.status(404).json({ success: false, message: 'Media not found.' });
    }

    const media = mediaItems[0];
    const diskPath = path.join(process.cwd(), 'uploads', media.filename);

    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
      } catch (err) {
        console.warn('Failed to delete file from disk:', err.message);
      }
    }

    await query('DELETE FROM media WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Media deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
