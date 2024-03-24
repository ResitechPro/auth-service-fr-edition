import { Router } from "express";
import SwaggerDocs from "../../packages/swagger/SwaggerDocs.js";
import authRoutes from "./authRoutes.js";

const routes = Router();
const swaggerDocs = new SwaggerDocs();

/**
 * @openapi
 * /:
 *   get:
 *     summary: Get welcome message
 *     description: Returns a welcome message.
 *     responses:
 *       '200':
 *         description: A successful response
 */
routes.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World!",
  });
});

routes.use("/auth", authRoutes);

swaggerDocs.setup(routes);

export default routes;
