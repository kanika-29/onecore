import { query } from '../config/db.js';
import path from 'path';
import fs from 'fs';

export const getMediaList = async (req, res, next) => {
  try {
    const media = await query(
      `SELECT m.*, u.name as uploaded_by_name
       FROM media m
       LEFT JOIN admin_users u ON m.uploaded_by = u.id
       ORDER BY m.created_at DESC`
    );

    return res.status(200).json({ success: true, data: media });
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
    const relativePath = `/uploads/${file.filename}`;

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
