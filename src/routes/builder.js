const express = require("express");
const router = express.Router();
const {getAllPortfolioBuilders, getPortfolioBuilderById} = require("../controllers/builderController");

router.get("/", getAllPortfolioBuilders);
router.get("/:id", getPortfolioBuilderById);

module.exports = router;