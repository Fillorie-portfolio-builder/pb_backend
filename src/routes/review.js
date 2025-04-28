const express = require('express');
const { createReview, getReviewsByBuilder } = require('../controllers/reviewController');
const router = express.Router();

router.post('/createReview', createReview);
router.get('/getReviewsByBuilder/:builderId', getReviewsByBuilder);

module.exports = router;