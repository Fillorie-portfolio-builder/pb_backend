const Project = require("../models/Project");
const Builder = require("../models/Builder");

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

    // 👇 Fetch builder details if interestedBuilders exist
    if (
      Array.isArray(project.interestedBuilders) &&
      project.interestedBuilders.length > 0
    ) {
      const builders = await Builder.findAll({
        where: {
          id: project.interestedBuilders,
        },
        attributes: ["id", "firstName", "lastName", "profileImage"], // customize fields
      });
      project.dataValues.interestedBuilderDetails = builders; // attach for frontend
    }

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

exports.markAsInterested = async (req, res) => {
  const { projectId } = req.params;
  const builderId = req.user.id; // assumes auth middleware sets req.user

  try {
    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Ensure 'interestedBuilders' is initialized
    if (!Array.isArray(project.interestedBuilders)) {
      console.log("hukauka");
      project.interestedBuilders = [];
    }

    // Avoid duplicate entries
    if (!project.interestedBuilders.includes(builderId)) {
      console.log("ehewhe");
      await project.update({
        interestedBuilders: [...project.interestedBuilders, builderId],
      });
      await project.save();
    }

    res.status(200).json({ message: "Marked as interested", project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.assignBuilderToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { builderId } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const builder = await Builder.findByPk(builderId);
    if (!builder.projects.includes(projectId)) {
      await builder.update({
        projects: [...builder.projects, projectId],
      });
      await builder.save();
    }


    project.builderId = builderId;
    await project.save();

    res.status(200).json({ message: "Builder assigned successfully", project });
  } catch (err) {
    console.error("Error assigning builder:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.markProjectCompletedByBuilder = async (req, res) => {
  const { projectId } = req.params;
  const { builderId } = req.body;

  if (!builderId) {
    return res.status(400).json({ message: "Builder ID is required" });
  }

  try {
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.builderId !== builderId) {
      return res.status(403).json({ message: "Not authorized to mark this project" });
    }

    if (project.completionStatus === "confirmed_by_owner") {
      return res.status(400).json({ message: "Project already confirmed by owner" });
    }

    await project.update({ completionStatus: "completed_by_builder" });

    return res.status(200).json({ message: "Project marked as completed by builder", project });
  } catch (err) {
    console.error("Error updating project completion:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

exports.confirmProjectCompletionByOwner = async (req, res) => {
  const { projectId } = req.params;
  const { ownerId } = req.body;

  try {
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.ownerId !== ownerId) {
      return res.status(403).json({ message: "Only the owner can confirm completion" });
    }

    if (project.completionStatus !== "completed_by_builder") {
      return res.status(400).json({ message: "Builder has not marked the project as completed" });
    }

    await project.update({ completionStatus: "confirmed_by_owner" });

    res.status(200).json({ message: "Project completion confirmed by owner", project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
