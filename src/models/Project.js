const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  ownerId: {
    type: DataTypes.UUID,
    allowNull: true, // If it's a portfolio project, no ownerId
  },
  builderId: {
    type: DataTypes.UUID,
    allowNull: true, // If it's an owner project, no builderId
  },

  // Common
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },

  timeline: {
    type: DataTypes.STRING,
  },

  category: {
    type: DataTypes.STRING,
  },

  subcategory: {
    type: DataTypes.STRING,
  },

  technologies: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },

  knowledgeRequired: {
    type: DataTypes.TEXT,
  },

  // For builder-posted portfolio projects
  urls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  mediaFiles: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },


});

module.exports = Project;
