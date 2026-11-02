import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import {
  getPageByKey,
  createPageSection,
  updatePageSection,
  deletePageSection,
} from '../controllers/pagesController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireEditorOrAbove } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/dashboard', authenticateToken, getDashboardStats);

// Admin section & page endpoints
router.get('/pages/:key', authenticateToken, getPageByKey);
router.put('/sections/:id', authenticateToken, requireEditorOrAbove, updatePageSection);
router.post('/pages/:pageId/sections', authenticateToken, requireEditorOrAbove, createPageSection);
router.delete('/sections/:id', authenticateToken, requireEditorOrAbove, deletePageSection);

export default router;

