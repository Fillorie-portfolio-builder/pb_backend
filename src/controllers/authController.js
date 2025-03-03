const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SECRET_KEY = process.env.JWT_SECRET;

// Project Owner Registration
exports.registerOwner = async (req, res) => {
  try {
    const { email, password, businessUrl, bio, profileImage, linkedin } = req.body;

    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Project Owner
    user = await User.create({
      email,
      password: hashedPassword,
      accountType: "owner",
      businessUrl,
      bio,
      profileImage,
      linkedin
    });

    res.status(201).json({ message: "Project Owner registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Portfolio Builder Registration
exports.registerBuilder = async (req, res) => {
  try {
    const { email, password, skillSets, educationalBackground, preferredJobTypes, availability, profileImage, bio } = req.body;

    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Portfolio Builder
    user = await User.create({
      email,
      password: hashedPassword,
      accountType: "builder",
      skillSets,
      educationalBackground,
      preferredJobTypes,
      availability,
      profileImage,
      bio
    });

    res.status(201).json({ message: "Portfolio Builder registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// User Login (Common for Both)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, accountType: user.accountType }, SECRET_KEY, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token});
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
