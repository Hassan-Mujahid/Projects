"use strict";
const { Model, UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ad.init(
    {
      uuid: { type: DataTypes.UUID, defaultValue: UUIDV4, allowNull: false },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "userId must not be empty!" },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "price must not be empty!" },
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "title must not be empty!" },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "description must not be empty!" },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "city must not be empty!" },
        },
      },
      adStreetAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "adStreetAddress must not be empty!" },
        },
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "brand must not be empty!" },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "firstName must not be empty!" },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "lastName must not be empty!" },
        },
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        // validate: {
        // notEmpty: { msg: "Images must not be empty!" },
        // },
      },
    },
    {
      sequelize,
      tableName: "ads",
      modelName: "Ad",
    }
  );
  return Ad;
};
