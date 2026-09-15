import { Router } from 'express';
import {
  submitContactEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../controllers/contactsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdminOrSuper } from '../middleware/roleMiddleware.js';

const router = Router();

// Public submission route
router.post('/contact', submitContactEnquiry);

// Protected Admin enquiry management routes
router.get('/admin/enquiries', authenticateToken, getEnquiries);
router.get('/admin/enquiries/:id', authenticateToken, getEnquiryById);
router.patch('/admin/enquiries/:id', authenticateToken, updateEnquiryStatus);
router.delete('/admin/enquiries/:id', authenticateToken, requireAdminOrSuper, deleteEnquiry);

export default router;
