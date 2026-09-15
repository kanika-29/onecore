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
router.put('/bulk', authenticateToken, requireAdminOrSuper, updateSettings);
router.put('/contact', authenticateToken, requireAdminOrSuper, updateContactSettings);
router.put('/site/:key', authenticateToken, requireAdminOrSuper, updateSiteSetting);

export default router;

