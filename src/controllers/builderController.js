const { User } = require("../models/User");

// Retrieve all Portfolio Builders
exports.getAllPortfolioBuilders = async (req, res) => {
  try {
    const builders = await User.findAll({ where: { accountType: "builder" } });
    res.status(200).json(builders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Retrieve a Portfolio Builder by ID
exports.getPortfolioBuilderById = async (req, res) => {
  try {
    const { id } = req.params;
    const builder = await User.findOne({
      where: { id, accountType: "builder" },
    });

    if (!builder)
      return res.status(404).json({ message: "Portfolio Builder not found" });

    res.status(200).json(builder);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};