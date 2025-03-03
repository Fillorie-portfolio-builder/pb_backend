const { User } = require("../models/User");

// Retrieve all Project Owners
exports.getAllProjectOwners = async (req, res) => {
  try {
    const owners = await User.findAll({ where: { accountType: "owner" } });
    res.status(200).json(owners);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Retrieve a Project Owner by ID
exports.getProjectOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await User.findOne({ where: { id, accountType: "owner" } });

    if (!owner) return res.status(404).json({ message: "Project Owner not found" });

    res.status(200).json(owner);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
