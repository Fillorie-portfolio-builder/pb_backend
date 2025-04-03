const express = require('express');
const { getProjectOwnerById } = require('../controllers/ownerController');
const router = express.Router();

router.get('/:id', getProjectOwnerById);

module.exports = router;