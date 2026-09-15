import { Router } from 'express';
import {
  getTherapeuticAreas,
  getTherapeuticAreaById,
  createTherapeuticArea,
  updateTherapeuticArea,
  deleteTherapeuticArea,
  reorderTherapeuticAreas
} from '../controllers/therapeuticAreasController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireEditorOrAbove, requireAdminOrAbove } from '../middleware/roleMiddleware.js';

const router = Router();

// Public & Admin routes
router.get('/', getTherapeuticAreas);
router.get('/:id', getTherapeuticAreaById);
router.post('/', authenticateToken, requireEditorOrAbove, createTherapeuticArea);
router.put('/:id', authenticateToken, requireEditorOrAbove, updateTherapeuticArea);
router.delete('/:id', authenticateToken, requireAdminOrAbove, deleteTherapeuticArea);
router.post('/reorder', authenticateToken, requireEditorOrAbove, reorderTherapeuticAreas);

export default router;
