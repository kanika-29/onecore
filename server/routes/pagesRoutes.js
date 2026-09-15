import { Router } from 'express';
import {
  getPages,
  getPageByKey,
  updatePage,
  createPageSection,
  updatePageSection,
  deletePageSection,
  reorderPageSections
} from '../controllers/pagesController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireEditorOrAbove } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getPages);
router.get('/:key', getPageByKey);
router.put('/:id', authenticateToken, requireEditorOrAbove, updatePage);

// Section endpoints
router.post('/:pageId/sections', authenticateToken, requireEditorOrAbove, createPageSection);
router.put('/sections/:id', authenticateToken, requireEditorOrAbove, updatePageSection);
router.delete('/sections/:id', authenticateToken, requireEditorOrAbove, deletePageSection);
router.post('/:pageId/reorder-sections', authenticateToken, requireEditorOrAbove, reorderPageSections);

export default router;
