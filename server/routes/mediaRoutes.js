import { Router } from 'express';
import { getMediaList, uploadMedia, deleteMedia } from '../controllers/mediaController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { requireEditorOrAbove, requireAdminOrSuper } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getMediaList);
router.post('/upload', authenticateToken, requireEditorOrAbove, upload.single('file'), uploadMedia);
router.delete('/:id', authenticateToken, requireAdminOrSuper, deleteMedia);

export default router;
