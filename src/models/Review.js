const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Review = sequelize.define("Review", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    builderId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    ownername: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    reviewStars: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    reviewText: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

module.exports = Review;