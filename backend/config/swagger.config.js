import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Freelancer Bidding API",
      version: "1.0.0",
      description: "API for user authentication",
    },
    servers: [
      {
        url: "http://localhost:3000", // adjust if needed
      },
    ],
  },
  apis: ["./routes/*.js"], // adjust to point to where your route files are
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerUi, swaggerSpec };