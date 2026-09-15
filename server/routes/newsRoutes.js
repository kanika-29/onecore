import { Router } from 'express';
import {
  getNews,
  getNewsByIdOrSlug,
  createNews,
  updateNews,
  deleteNews,
} from '../controllers/newsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireEditorOrAbove } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getNews);
router.get('/:identifier', getNewsByIdOrSlug);
router.post('/', authenticateToken, requireEditorOrAbove, createNews);
router.put('/:id', authenticateToken, requireEditorOrAbove, updateNews);
router.delete('/:id', authenticateToken, requireEditorOrAbove, deleteNews);

export default router;
