const Review = require("../models/Review");
const { v4: uuidv4 } = require("uuid");

exports.createReview = async (req, res) => {
    try {
        const { builderId, ownerId, reviewStars, reviewText ,ownername} = req.body;
        const review = await Review.create({
            id: uuidv4(),
            builderId,
            ownerId,
            reviewStars,
            reviewText,
            ownername
        });
        res.status(201).json({ message: "Review created successfully", review });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

exports.getReviewsByBuilder = async (req, res) => {
    try {
        const { builderId } = req.params;
        const reviews = await Review.findAll({ where: { builderId } });
        res.status(200).json(reviews);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}