import { Router } from 'express';

const router = Router();

// Placeholder - will be implemented later
router.post('/', (req, res) => {
  res.json({ message: 'Create category endpoint' });
});

router.get('/', (req, res) => {
  res.json({ message: 'List categories endpoint' });
});

export default router;
