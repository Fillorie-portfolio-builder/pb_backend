const express = require("express");
const sequelize = require("./src/config/sequelize");
const User = require("./src/models/User");
const authRoutes = require("./src/routes/auth");
const builderRoutes = require("./src/routes/builder");
const portfolioRoutes = require("./src/routes/portfolio");
const projectRoutes = require("./src/routes/project");
const cors = require("cors");

const app = express();
app.use(express.json()); // Parse JSON requests
app.use(cors());

const PORT = process.env.PORT || 5000;

// Sync database and create the table
sequelize.sync({ force: false }) // Set force: true to drop & recreate table
  .then(() => console.log("✅ Database synced"))
  .catch(err => console.error("❌ Error syncing database:", err));

app.use('/api/auth', authRoutes);
app.use("/api/builder", builderRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/project", projectRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
