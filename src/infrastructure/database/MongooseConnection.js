import mongoose from "mongoose";
import environment from "../config/environment.js";
import logger from "../packages/pino/logger.js";

class MongooseConnection {
  static instance = null;
  connected = false;

  constructor() {
    this.connect();
  }

  static getInstance() {
    if (!MongooseConnection.instance) {
      MongooseConnection.instance = new MongooseConnection();
    }

    return MongooseConnection.instance;
  }

  connect() {
    if (this.connected) {
      return;
    }

    mongoose.set("strictQuery", true);

    mongoose.connect(environment.mongo.uri, {
      dbName: environment.mongo.dbName,
    });

    mongoose.connection.once("open", () => {
      logger.info("connection to database established successfully");
      this.connected = true;
    });

    mongoose.connection.on("error", (error) => {
      logger.error(`error while connecting to database: ${error}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.info("database connection closed");
      this.connected = false;
    });
  }
}

export default MongooseConnection;
