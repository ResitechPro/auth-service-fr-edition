import fs from "fs";
import path from "path";
import Container from "./Container.js";

// singleton ==========================================================================
const container = Container.getInstance();
// ====================================================================================

// helpers ============================================================================
import getCurrentDirname from "../infrastructure/helpers/getCurrentDirname.js";
// ====================================================================================

// packages ===========================================================================
import SecurityService from "../infrastructure/packages/bcrypt/SecurityService.js";
import JsonWebToken from "../infrastructure/packages/jwt/JsonWebToken.js";
// ====================================================================================

// models =============================================================================
// TODO: Import the models
// ====================================================================================

// repositories =======================================================================
import UserRepository from "../adapters/repositories/UserRepository.js";
import UserTokenRepository from "../adapters/repositories/UserTokenRepository.js";
// ====================================================================================

// controllers ========================================================================
import AuthController from "../adapters/controllers/AuthController.js";
// ====================================================================================

// middlewares ========================================================================
import AuthMiddleware from "../adapters/middlewares/AuthMiddleware.js";
// ====================================================================================

// services ===========================================================================
import AuthServices from "../application/services/AuthServices.js";
// ====================================================================================

// use cases ==========================================================================
import LoginUseCase from "../application/usecases/LoginUseCase.js";
import LogoutUseCase from "../application/usecases/LogoutUseCase.js";
import RefreshTokenUseCase from "../application/usecases/RefreshTokenUseCase.js";
import RegisterUseCase from "../application/usecases/RegisterUseCase.js";
// ====================================================================================

class DependencyInjection {
  static setup = () => {
    const __dirname = getCurrentDirname(import.meta.url);
    const privatePemPath = path.resolve(__dirname, "../../keys/private.pem");
    const publicPemPath = path.resolve(__dirname, "../../keys/public.pem");

    // packages =======================================================================
    const jsonWebToken = new JsonWebToken(
      fs.readFileSync(privatePemPath),
      fs.readFileSync(publicPemPath)
    );
    const securityService = new SecurityService();
    // =================================================================================

    // repositories ====================================================================
    const userRepository = new UserRepository(/* User */); // TODO: Add the User model
    const userTokenRepository = new UserTokenRepository(/* UserToken */); // TODO: Add the UserToken model
    // =================================================================================

    // services ========================================================================
    const authServices = new AuthServices({
      userRepository,
      userTokenRepository,
      securityService,
      jsonWebToken,
    });
    // =================================================================================

    // use cases =======================================================================
    const loginUseCase = new LoginUseCase({ authServices });
    const registerUseCase = new RegisterUseCase({ authServices });
    const refreshTokenUseCase = new RefreshTokenUseCase({ authServices });
    const logoutUseCase = new LogoutUseCase({ authServices });
    // =================================================================================

    // controllers =====================================================================
    const authController = new AuthController({
      loginUseCase,
      registerUseCase,
      logoutUseCase,
      refreshTokenUseCase,
    });
    // =================================================================================

    // middlewares =====================================================================
    const authMiddleware = new AuthMiddleware({ authServices });
    // =================================================================================

    const dependencies = [
      { name: "jsonWebToken", instance: jsonWebToken },
      { name: "securityService", instance: securityService },
      { name: "userRepository", instance: userRepository },
      { name: "userTokenRepository", instance: userTokenRepository },
      { name: "authService", instance: authServices },
      { name: "loginUseCase", instance: loginUseCase },
      { name: "registerUseCase", instance: registerUseCase },
      { name: "refreshTokenUseCase", instance: refreshTokenUseCase },
      { name: "logoutUseCase", instance: logoutUseCase },
      { name: "authController", instance: authController },
      { name: "authMiddleware", instance: authMiddleware },
    ];

    dependencies.forEach((dependency) => {
      container.register(dependency.name, dependency.instance);
    });
  };
}

export default DependencyInjection;
