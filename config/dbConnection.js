require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "mysql",
  logging: false,
});

// sequelize.authenticate()
//   .then(() => console.log("Database connection established successfully."))
//   .catch(err => console.error("Unable to connect to the database:", err));

module.exports = sequelize;
