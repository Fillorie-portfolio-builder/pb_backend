const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");
const Builder = require("../models/Builder");

const SECRET_KEY = process.env.JWT_SECRET;

// Project Owner Registration
exports.registerOwner = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      businessUrl,
      bio,
      profilePicture,
      linkedin,
      mobile,
      offers,
      profession
    } = req.body;

    console.log("Req body", req.body);

    console.log("Registering owner with email:", email);

    // Check if user already exists
    let user = await Owner.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Project Owner
    user = await Owner.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
      accountType: "owner",
      businessUrl,
      bio,
      profileImage: profilePicture,
      linkedin,
      offers: offers || [],
      profession,
    });

    console.log("Project Owner created:", user);

    res
      .status(201)
      .json({ message: "Project Owner registered successfully", user });
  } catch (err) {
    console.error("Error registering project owner:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Portfolio Builder Registration
exports.registerBuilder = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      skills,
      educationalBackground,
      preferredJobTypes,
      availability,
      profileImage,
      bio,
      category,
      subcategories,
      profession,
      location
    } = req.body;

    console.log("Registering builder with email:", email);

    // Check if builder already exists
    let user = await Builder.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Portfolio Builder
    user = await Builder.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone: mobile,
      accountType: "builder",
      skillSets: skills|| [],
      educationalBackground,
      preferredJobTypes: preferredJobTypes || [],
      availability,
      profileImage,
      bio,
      location,
      profession,
      projectsCompleted: 0,
      ratings: 0.0,
      category,
      subcategories,
      location
    });

    console.log("Portfolio Builder created:", user);

    res
      .status(201)
      .json({ message: "Portfolio Builder registered successfully", user });
  } catch (err) {
    console.error("Error registering portfolio builder:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// User Login (Common for Both)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if email exists in Builder or Owner model
    let user = await Owner.findOne({ where: { email } });

    if (!user) {
      user = await Builder.findOne({ where: { email } });
    }

    // ✅ If no user found, return invalid credentials error
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, accountType: user.accountType },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    // ✅ Return user details and token
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        accountType: user.accountType,
        firstName: user.firstName || null, // Some fields may not exist for Owners
        lastName: user.lastName || null,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
