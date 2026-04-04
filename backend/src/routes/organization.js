import { Router } from 'express';
import {
  createOrganization,
  joinOrganization,
  getMyOrganization,
  getMembers,
  updateMemberRole,
  removeMember,
} from '../controllers/organizationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/create', protect, createOrganization);
router.post('/join', protect, joinOrganization);
router.get('/me', protect, getMyOrganization);

// Admin only routes
router.get('/members', protect, authorize('admin'), getMembers);
router.put('/members/:id/role', protect, authorize('admin'), updateMemberRole);
router.delete('/members/:id', protect, authorize('admin'), removeMember);

export default router;
