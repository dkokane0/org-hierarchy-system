const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/dbConnection");
const nodeRoutes = require("./routes/nodeRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./api-docs/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api", nodeRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

sequelize.sync()
  .then(() => console.log("Database synced successfully"))
  .catch(err => console.error("Error syncing database:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
