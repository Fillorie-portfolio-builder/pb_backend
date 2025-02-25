const express = require("express");
const sequelize = require("./src/config/sequelize");
const User = require("./src/models/User");
const authRoutes = require("./src/routes/auth");

const app = express();
app.use(express.json()); // Parse JSON requests

const PORT = process.env.PORT || 5000;

// Sync database and create the table
sequelize.sync({ force: false }) // Set force: true to drop & recreate table
  .then(() => console.log("✅ Database synced"))
  .catch(err => console.error("❌ Error syncing database:", err));

app.use('/api/auth', authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
