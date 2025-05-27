const express = require('express');
const { registerOwner, login, registerBuilder, forgotPassword, confirmPassword } = require('../controllers/authController');
const router = express.Router();

// POST /api/auth/signup
router.post('/register-owner', registerOwner);
router.post('/register-builder', registerBuilder);
router.post('/login', login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", confirmPassword);

module.exports = router;
