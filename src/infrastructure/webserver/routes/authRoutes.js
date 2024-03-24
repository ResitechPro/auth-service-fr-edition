import { Router } from "express";
import Container from "../../../ioc-container/Container.js";
import asyncHandler from "../interceptors/asyncHandler.js";

const authRoutes = Router();
const container = Container.getInstance();
const authController = container.resolve("authController");

authRoutes.post("/register", asyncHandler(authController.register));

authRoutes.post("/login", asyncHandler(authController.login));

authRoutes.post("/logout", asyncHandler(authController.logout));

authRoutes.post("/refresh-token", asyncHandler(authController.refreshToken));

export default authRoutes;
