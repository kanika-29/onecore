import { Router } from 'express';
import {
  getSettings,
  updateContactSettings,
  updateSiteSetting,
  updateSettings,
} from '../controllers/settingsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdminOrSuper } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getSettings);
router.get('/storage-diagnostic', async (req, res) => {
  try {
    const { getStorageDiagnostic } = await import('../utils/storage.js');
    const { query } = await import('../config/db.js');
    const diag = getStorageDiagnostic();
    let recentMedia = [];
    try {
      recentMedia = await query('SELECT id, filename, file_path, original_filename, created_at FROM media ORDER BY id DESC LIMIT 30');
    } catch {}
    res.json({ success: true, data: diag, recentMedia });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
});
router.put('/bulk', authenticateToken, requireAdminOrSuper, updateSettings);
router.put('/contact', authenticateToken, requireAdminOrSuper, updateContactSettings);
router.put('/site/:key', authenticateToken, requireAdminOrSuper, updateSiteSetting);

export default router;

