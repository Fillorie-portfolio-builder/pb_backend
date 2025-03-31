const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authenticateUser = require("../middleware/authMiddleware");

// Route for posting a project (only for logged-in owners)
router.post("/", authenticateUser, projectController.postProject);

// Optional routes for getting projects:
router.get("/owner/:ownerId", projectController.getProjectsByOwner);
router.get("/:id", projectController.getProjectById);

module.exports = router;
