const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Builder = sequelize.define("Builder", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
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
  phone: {
    type: DataTypes.STRING,
    validate: {
      len: [10, 15], // Ensures phone number length is valid
    },
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
  profession: {
    type: DataTypes.STRING,
  },
  projectsCompleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // ✅ Default to 0 when a builder is created
  },
  ratings: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0, // ✅ Default rating is 0
    validate: {
      min: 0,
      max: 5, // Ratings should be between 0 to 5
    },
  },
  accountType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "builder", // ✅ Default to "builder"
    validate: {
      isIn: [["builder"]],
    },
  },
});

module.exports = Builder;