const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const PortfolioProject = sequelize.define("PortfolioProject", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  builderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  urls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  mediaFiles: {
    type: DataTypes.ARRAY(DataTypes.STRING), // store uploaded file URLs
  },
});

module.exports = PortfolioProject;
