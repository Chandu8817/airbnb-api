
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
// Using hardcoded version to avoid JSON import issues
const API_VERSION = "1.0.0";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Airbnb Clone API",
      version: API_VERSION,
      description: "API documentation for Airbnb backend",
      contact: {
        name: "API Support",
        url: "https://github.com/yourusername/airbnb-backend-hyper-hire/issues"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Development server"
      },
      {
        url: "https://api.yourapp.com/api",
        description: "Production server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in the format: Bearer <token>"
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/controllers/*.ts",
    "./src/routes/*.ts"
  ],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  // Swagger page
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Airbnb API Documentation",
      customfavIcon: "/assets/favicon.ico"
    })
  );

  // Docs in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  // eslint-disable-next-line no-console
  console.log(`📖 Swagger docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
