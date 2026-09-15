import { Router } from 'express';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../controllers/adminUsersController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireSuperAdmin } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticateToken);
router.use(requireSuperAdmin);

router.get('/', getAdminUsers);
router.post('/', createAdminUser);
router.put('/:id', updateAdminUser);
router.delete('/:id', deleteAdminUser);

export default router;
