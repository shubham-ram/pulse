import { Router } from 'express';
import { createOrganization, joinOrganization, getMyOrganization } from '../controllers/organizationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/create', protect, createOrganization);
router.post('/join', protect, joinOrganization);
router.get('/me', protect, getMyOrganization);

export default router;
