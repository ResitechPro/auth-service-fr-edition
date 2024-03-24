import dotenv from "dotenv";

dotenv.config();

const environment = {
  app: {
    protocol: process.env.APP_PROTOCOL || "http",
    host: process.env.APP_HOST || "localhost",
    port: process.env.APP_PORT || 3001,
  },
  api: {
    prefix: process.env.API_PREFIX || "api",
  },
  mongo: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017",
    dbName: process.env.MONGO_DB_NAME || "auth-service",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  },
};

export default environment;
