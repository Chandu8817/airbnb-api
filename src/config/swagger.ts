import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Airbnb Clone API",
      version: "1.0.0",
      description: "API documentation for Airbnb backend",
    },
    servers: [
      {
        url: "http://localhost:4000", // update for prod
      },
    ],
  },
  apis: ["./src/controllers/*.ts"], // location of your controllers
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app: Express, port: number) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(`📖 Swagger docs available at http://localhost:${port}/api-docs`);
}
