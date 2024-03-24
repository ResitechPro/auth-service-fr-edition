import { Router } from "express";
import Container from "../../../ioc-container/Container.js";
import asyncHandler from "../interceptors/asyncHandler.js";

const authRoutes = Router();
const container = Container.getInstance();
const authController = container.resolve("authController");

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Endpoint to register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request data
 */
authRoutes.post("/register", asyncHandler(authController.register));

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login user
 *     description: Endpoint to login an existing user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrUserName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized, invalid credentials
 */
authRoutes.post("/login", asyncHandler(authController.login));

/**
 * @openapi
 * /logout:
 *   post:
 *     summary: Logout user
 *     description: Endpoint to logout an authenticated user.
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized, user not authenticated
 */
authRoutes.post("/logout", asyncHandler(authController.logout));

/**
 * @openapi
 * /refresh-token:
 *   post:
 *     summary: Refresh user access token
 *     description: Endpoint to refresh user access token using refresh token.
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Unauthorized, invalid refresh token
 */
authRoutes.post("/refresh-token", asyncHandler(authController.refreshToken));

export default authRoutes;
