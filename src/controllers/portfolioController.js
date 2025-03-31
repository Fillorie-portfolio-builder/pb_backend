const PortfolioProject = require("../models/PortfolioProject");
const { v4: uuidv4 } = require("uuid");

// Create new portfolio project
exports.createPortfolioProject = async (req, res) => {
  try {
    const { projectName, description, urls, mediaFiles } = req.body;
    const builderId = req.user.id; // ✅ Get builderId from authenticated user token

    if (req.user.accountType !== "builder") {
      return res
        .status(403)
        .json({ message: "Only builders can create portfolio projects" });
    }

    const newProject = await PortfolioProject.create({
      id: uuidv4(),
      builderId,
      projectName,
      description,
      urls,
      mediaFiles,
    });

    res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all projects by builder
exports.getProjectsByBuilder = async (req, res) => {
  try {
    const { builderId } = req.params;
    const projects = await PortfolioProject.findAll({ where: { builderId } });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single project by project ID
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await PortfolioProject.findByPk(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a project (optional)
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await PortfolioProject.destroy({ where: { id } });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
