const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");
const Builder = require("../models/Builder");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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
    
    const sanitizedBusinessUrl = businessUrl?.trim() || null;

    // Create Project Owner
    user = await Owner.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
      accountType: "owner",
      businessUrl: sanitizedBusinessUrl,
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
      skillSets: skills || [],
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

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, bio, mobile } = req.body;

    let user = await Owner.findOne({ where: { id } });
    if (!user) {
      user = await Builder.findOne({ where: { id } });
      if (!user) return res.status(404).json({ message: 'User not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio) user.bio = bio;
    if (mobile) {
      if (user instanceof Owner) user.mobile = mobile;
      else if (user instanceof Builder) user.phone = mobile;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ message: 'New email is required' });
    }

    let user = await Owner.findOne({ where: { id } });
    if (!user) {
      user = await Builder.findOne({ where: { id } });
      if (!user) return res.status(404).json({ message: 'User not found' });
    }

    const emailExistsInOwner = await Owner.findOne({ where: { email: newEmail } });
    const emailExistsInBuilder = await Builder.findOne({ where: { email: newEmail } });

    if ((emailExistsInOwner && emailExistsInOwner.id !== id) ||
      (emailExistsInBuilder && emailExistsInBuilder.id !== id)) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    user.email = newEmail;
    await user.save();

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Email updated successfully',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Error updating email:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    let user = await Owner.findOne({ where: { id } });
    if (!user) {
      user = await Builder.findOne({ where: { id } });
      if (!user) return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateBuilder = async (req, res) => {
  try {
    const builderId = req.params.id;
    const {
      firstName,
      lastName,
      email,
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

    console.log("Updating builder with ID:", builderId);

    let builder = await Builder.findByPk(builderId);
    if (!builder) {
      return res.status(404).json({ message: "Builder not found" });
    }
    const updatedData = {
      firstName,
      lastName,
      email,
      phone: mobile,
      skillSets: skills || [],
      educationalBackground,
      preferredJobTypes: preferredJobTypes || [],
      availability,
      profileImage,
      bio,
      category,
      subcategories,
      profession,
      location
    };

    await builder.update(updatedData);

    console.log("Builder updated:", builder);

    res.status(200).json({ message: "Builder updated successfully", builder });
  } catch (err) {
    console.error("Error updating builder:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.sendForgotPasswordEmail = async (email, name, resetUrl) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // ✅ Hostinger SMTP server
    port: 465, // ✅ Use 465 for SSL, or 587 for TLS
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'PORTFOILO BUILDER - Reset Password',
    html: `
     <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333333; line-height: 1.6;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #4a4a4a; margin: 0; font-size: 24px;">Portfolio Builder</h1>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
          <h2 style="color: #2c3e50; margin-top: 0; font-size: 20px;">Reset Your Password</h2>
          
          <p style="margin-bottom: 20px;">Hey ${name},</p>
          
          <p style="margin-bottom: 20px;">You requested to reset your password. Click the button below to set a new password:</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" style="background-color: #6c5ce7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block; box-shadow: 0 2px 4px rgba(108, 92, 231, 0.2);">
              Reset Password
            </a>
          </div>
          
          <p style="margin-bottom: 20px; font-size: 14px; color: #7f8c8d;">
            This link will expire in 10 mintus. If you didn't request this, please ignore this email.
          </p>
          
          <div style="border-top: 1px solid #e9ecef; margin-top: 30px; padding-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #7f8c8d;">
              Best regards,<br>
              <strong style="color: #2c3e50;">Team Portfolio Builder</strong>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #95a5a6;">
          <p style="margin: 0;">© 2025 Portfolio Builder Team. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("emai", email);
  try {
    // Check if user exists
    let user = await Owner.findOne({ where: { email } });
    console.log(user);
    if (!user) {
      user = await Builder.findOne({ where: { email } });
      console.log(user);
      if (!user) return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 600000; // 10 minutes expiration

    console.log("resetToken", resetToken);
    console.log("resetTokenExpires", resetTokenExpires);
    user.verificationToken = resetToken;
    user.verificationTokenExpires = resetTokenExpires;


    await user.save();

    const resetUrl = `http://${process.env.API_BASE}/reset-password/token=${resetToken}`;
    await exports.sendForgotPasswordEmail(email, user.firstName, resetUrl);

    res.status(200).json({
      message: "Password reset link sent",
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
}

exports.confirmPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    // Find the user by the token
    let user = await Owner.findOne({ verificationToken: token });
    // console.log("user1", user);
    if (!user) {
      user = await Builder.findOne({ verificationToken: token });
      // console.log("user2", user);

      if (!user) return res.status(404).json({ message: 'User not found' });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.verificationToken = null;
    user.verificationTokenExpires = null;

    await user.save();

    res.status(200).json({ message: "Password Updated Successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

