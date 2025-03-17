const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Owner = sequelize.define("Owner", {
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
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 15],
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
  businessUrl: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
  accountType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "owner", // ✅ Set default account type to "owner"
    validate: {
      isIn: [["owner"]],
    },
  },
  offers: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  profession: {
    type: DataTypes.STRING,
  },
});

module.exports = Owner;