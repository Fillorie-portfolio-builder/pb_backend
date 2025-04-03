const Project = require("../models/Project");

const { v4: uuidv4 } = require("uuid");

exports.postProject = async (req, res) => {
  try {
    const {
      projectName,
      description,
      timeline,
      technologies,
      knowledgeRequired,
      urls,
      mediaFiles,
      category,
      subcategory,
    } = req.body;
    const ownerId = req.user.id; // Get ownerId from the authenticated user

    if (req.user.accountType !== "owner") {
      return res
        .status(403)
        .json({ message: "Only project owners can post projects." });
    }

    const newProject = await Project.create({
      id: uuidv4(),
      ownerId,
      projectName,
      description,
      timeline,
      technologies,
      knowledgeRequired,
      urls,
      mediaFiles,
      category,
      subcategory,
    });

    res
      .status(201)
      .json({ message: "Project posted successfully", project: newProject });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// (Optional) Get all projects by owner
exports.getProjectsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const projects = await Project.findAll({ where: { ownerId } });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// (Optional) Get single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const { category } = req.query;

    const whereClause = {};
    if (category) whereClause.category = category;

    const projects = await Project.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
