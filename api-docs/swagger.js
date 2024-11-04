const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Organization Tree API",
      version: "1.0.0",
      description: "API documentation for managing organization tree",
    },
    servers: [{ url: `http://localhost:3000` }],
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsDoc(swaggerOptions);
