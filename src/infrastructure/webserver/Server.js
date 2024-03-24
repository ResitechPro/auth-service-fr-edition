import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import environment from "../config/environment.js";
import errorHandler from "./interceptors/errorHandler.js";
import DependencyInjection from "../../ioc-container/DependencyInjection.js";
import logger from "../packages/pino/logger.js";

class Server {
  constructor() {
    this.app = express();
    this.protocol = environment.app.protocol;
    this.host = environment.app.host;
    this.port = environment.app.port;
    this.prefix = environment.api.prefix;
  }

  setupRoutes = async () => {
    const routes = await import("./routes/index.js");

    this.app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    this.app.use(`/${this.prefix}`, routes.default);
  };

  configureMiddlewares = () => {
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  };

  configureErrorHandling = () => {
    this.app.use(errorHandler);
  };

  configureCors = () => {
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );
  };

  connectToDatabase = () => {
    // TODO: Implement database connection
  };

  start = async () => {
    this.app.listen(this.port, () => {
      logger.info(
        `Server running on ${this.protocol}://${this.host}:${this.port}`
      );
    });

    DependencyInjection.setup();
    this.configureMiddlewares();
    this.configureCors();
    await this.setupRoutes();
    this.configureErrorHandling();
    this.connectToDatabase();
  };
}

export default Server;
