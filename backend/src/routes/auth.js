const express = require('express');
const router = express.Router();

// Placeholder - will be implemented in Phase 2
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

module.exports = router;
