const { Op } = require("sequelize");
const Builder = require("../models/Builder");
const Project = require("../models/Project");

// Retrieve all Portfolio Builders
exports.getAllPortfolioBuilders = async (req, res) => {
  try {
    const { category, subcategory } = req.query;

    // Build dynamic query filter
    const whereClause = { accountType: "builder" };

    if (category) {
      whereClause.category = category;
    }

    if (subcategory) {
      whereClause.subcategory = subcategory;
    }

    const builders = await Builder.findAll({ where: whereClause });
    res.status(200).json(builders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Retrieve a Portfolio Builder by ID 
exports.getPortfolioBuilderById = async (req, res) => {
  try {
    const { id } = req.params;

    const builder = await Builder.findOne({ where: { id } });

    if (!builder) {
      return res.status(404).json({ message: "Portfolio Builder not found" });
    }

    let projectDetails = [];
    if (Array.isArray(builder.projects) && builder.projects.length > 0) {
      projectDetails = await Project.findAll({
        where: {
          id: {
            [Op.in]: builder.projects,
          },
        },
      });
    }

    res.status(200).json({ ...builder.toJSON(), projects: projectDetails });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
