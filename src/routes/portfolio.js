const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController");
const authenticateUser = require("../middleware/authMiddleware");

router.post("/", authenticateUser, portfolioController.createPortfolioProject);
router.get("/builder/:builderId", portfolioController.getProjectsByBuilder);
router.get("/:id", portfolioController.getProjectById);
router.delete("/:id", authenticateUser, portfolioController.deleteProject);

module.exports = router;
