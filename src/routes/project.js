const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authenticateUser = require("../middleware/authMiddleware");

// Route for posting a project (only for logged-in owners)
router.post("/", authenticateUser, projectController.postProject);

// Optional routes for getting projects:
router.get("/owner/:ownerId", projectController.getProjectsByOwner);
router.get("/:id", projectController.getProjectById);
router.get("/", projectController.getAllProjects);
router.put("/:id", projectController.updateProject);
router.post("/:projectId/interested", authenticateUser, projectController.markAsInterested);
router.post("/:projectId/assign-builder", authenticateUser, projectController.assignBuilderToProject);

module.exports = router;
  
  