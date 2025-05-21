const express = require('express');
const { updateProfile, updateEmail, updatePassword } = require('../controllers/authController');
const router = express.Router();

router.put('/updateprofile/:id', updateProfile);
router.put('/updateEmail/:id', updateEmail);
router.put('/updatePassword/:id', updatePassword);
router.put('/update-builder-details/:id', updateBuilder);

module.exports = router;