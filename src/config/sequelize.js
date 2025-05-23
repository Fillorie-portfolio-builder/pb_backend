const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  port: process.env.DB_PORT,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Set to false for AWS RDS
    },
  },
  logging: false, // Disable logging SQL queries in console
});

async function testDBConnection() {
  try {
    await sequelize.authenticate();
    sequelize.sync({ alter: true })
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
}

testDBConnection();

module.exports = sequelize;
