import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import getCurrentDirname from "../../helpers/getCurrentDirname.js";
import environment from "../../config/environment.js";
import logger from "../pino/logger.js";

class SwaggerDocs {
  constructor() {
    this.__dirname = getCurrentDirname(import.meta.url);
    this.appUrl = `${environment.app.protocol}://${environment.app.host}:${environment.app.port}`;

    this.swaggerOptions = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "SyndiPay API",
          version: "1.0.0",
          description:
            "Simplifying syndicate payment management for housing complexes",
        },
        components: {
          securitySchemas: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        servers: [
          {
            url: `${this.appUrl}/${environment.api.prefix}`,
          },
        ],
      },
      apis: [`${this.__dirname}/../../webserver/routes/**/*.js`],
    };
  }

  setup = (routes) => {
    const swaggerDocs = swaggerJsdoc(this.swaggerOptions);
    routes.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    routes.get("docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerDocs);
    });

    logger.info(
      `Docs available at ${this.appUrl}/${environment.api.prefix}/docs`
    );
  };
}

export default SwaggerDocs;
