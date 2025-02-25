const express = require('express');
const { registerOwner, login, registerBuilder } = require('../controllers/authController');
const router = express.Router();

// POST /api/auth/signup
router.post('/register-owner', registerOwner);
router.post('/register-builder', registerBuilder);
router.post('/login', login);

module.exports = router;
