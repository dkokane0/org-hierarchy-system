const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConnection");

const Node = sequelize.define("Node", {
  NODE_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  NODE_NAME: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  NODE_TYPE: {
    type: DataTypes.ENUM("location", "employee", "department"),
    allowNull: false,
  },
  NODE_COLOR: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  PARENT_ID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

console.log("Node model defined successfully.");

module.exports = Node;
