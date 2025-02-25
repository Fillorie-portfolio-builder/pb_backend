const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  linkedin: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
  bio: {
    type: DataTypes.TEXT,
  },
  profileImage: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
  businessUrl: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
  educationalBackground: {
    type: DataTypes.TEXT,
  },
  skillSets: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  preferredJobTypes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  availability: {
    type: DataTypes.STRING,
  },
  accountType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["owner", "builder"]],
    },
  },
});

module.exports = User;
