import { Router } from 'express';

const router = Router();

// Placeholder - will be implemented in Phase 5
router.post('/upload', (req, res) => {
  res.json({ message: 'Upload video endpoint' });
});

router.get('/', (req, res) => {
  res.json({ message: 'List videos endpoint' });
});

export default router;
