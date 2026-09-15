import { Router } from 'express';
import {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
  reorderProducts
} from '../controllers/productsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireEditorOrAbove, requireAdminOrAbove } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getProducts);
router.get('/:identifier', getProductByIdOrSlug);
router.post('/', authenticateToken, requireEditorOrAbove, createProduct);
router.put('/:id', authenticateToken, requireEditorOrAbove, updateProduct);
router.delete('/:id', authenticateToken, requireAdminOrAbove, deleteProduct);
router.post('/reorder', authenticateToken, requireEditorOrAbove, reorderProducts);

export default router;
