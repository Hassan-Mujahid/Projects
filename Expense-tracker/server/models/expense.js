"use strict";
const { Model, UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  expense.init(
    {
      uuid: { type: DataTypes.UUID, defaultValue: UUIDV4 },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Text must not be empty" },
          notNull: { msg: "User must enter some text" },
        },
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Amount must not be Empty" },
          notNull: { msg: "User must enter some amount" },
        },
      },
    },
    {
      sequelize,
      modelName: "expense",
    }
  );
  return expense;
};
