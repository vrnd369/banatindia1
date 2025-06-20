const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Protected route example
router.get('/me', auth, (req, res) => {
  res.json({ message: 'Protected route accessed successfully', user: req.user });
});

module.exports = router; 