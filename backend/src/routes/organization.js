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
import {
  validateCreateOrg,
  validateJoinOrg,
  validateUpdateRole,
  validateMemberId,
} from '../middleware/validate.js';

const router = Router();

router.post('/create', protect, validateCreateOrg, createOrganization);
router.post('/join', protect, validateJoinOrg, joinOrganization);
router.get('/me', protect, getMyOrganization);

// Admin only routes
router.get('/members', protect, authorize('admin'), getMembers);
router.put('/members/:id/role', protect, authorize('admin'), validateUpdateRole, updateMemberRole);
router.delete('/members/:id', protect, authorize('admin'), validateMemberId, removeMember);

export default router;
