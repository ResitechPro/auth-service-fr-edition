import validateData from "../../infrastructure/helpers/validateData.js";
import ClientError from "../../infrastructure/exceptions/ClientError.js";
import NotFoundError from "../../infrastructure/exceptions/NotFoundError.js";
import UnauthorizedError from "../../infrastructure/exceptions/UnauthorizedError.js";
import ForbiddenError from "../../infrastructure/exceptions/ForbiddenError.js";

class AuthServices {
  constructor({
    userRepository,
    userTokenRepository,
    securityService,
    jsonWebToken,
  }) {
    this.userRepository = userRepository;
    this.userTokenRepository = userTokenRepository;
    this.securityService = securityService;
    this.jsonWebToken = jsonWebToken;
  }

  register = async (data) => {
    const user = await this.userRepository.create(data);

    return {
      id: user.id,
      userName: user.userName,
      image: user.image,
      email: user.email,
      isVerified: user.isVerified,
    };
  };

  login = async (data) => {
    const user = await this.userRepository.findByEmailOrUserName(
      data.emailOrUserName
    );

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordValid = await this.securityService.comparePasswords(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Password is incorrect");
    }

    return {
      id: user.id,
      userName: user.userName,
      image: user.image,
      email: user.email,
      isVerified: user.isVerified,
    };
  };

  validateUserCredentials = async (userCredentials) => {
    await Promise.all([
      this.validateRegisterInputs(userCredentials),
      this.validateEmailUnique(userCredentials.email),
      this.validateUserNameUnique(userCredentials.userName),
    ]);
  };

  prepareUserCredentials = async (userCredentials) => {
    delete userCredentials.confirmPassword;
    userCredentials.password = await this.hashPassword(
      userCredentials.password
    );
  };

  getUserCredentials = async (userId) => {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return {
      id: user.id,
      userName: user.userName,
      image: user.image,
      email: user.email,
      isVerified: user.isVerified,
    };
  };

  generateTokens = async (user) => {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken({ id: user.id }),
    ]);
    return { accessToken, refreshToken };
  };

  validateRegisterInputs = async (data) => {
    await validateData(data, "register");
  };

  validateLoginInputs = async (data) => {
    await validateData(data, "login");
  };

  validateEmailUnique = async (email) => {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new ClientError("Email already exists");
    }
  };

  validateUserNameUnique = async (userName) => {
    const user = await this.userRepository.findByUserName(userName);
    if (user) {
      throw new ClientError("Username already exists");
    }
  };

  hashPassword = async (password) => {
    return await this.securityService.hashPassword(password);
  };

  generateAccessToken = async (payload) => {
    return await this.jsonWebToken.sign(payload, "15m");
  };

  generateRefreshToken = async (payload) => {
    return await this.jsonWebToken.sign(payload, "30d");
  };

  verifyToken = async (token) => {
    const result = await this.jsonWebToken.verify(token);

    if (!result.isValid) {
      if (result.error.includes("jwt expired")) {
        throw new ForbiddenError("Token expired");
      }
      throw new UnauthorizedError("Invalid token");
    }

    return result.decoded;
  };

  storeRefreshTokenInDatabase = async (refreshToken, userId) => {
    return await this.userTokenRepository.upsert(refreshToken, userId);
  };

  deleteRefreshTokenFromDatabase = async (refreshToken) => {
    const document = await this.userTokenRepository.softDeleteByToken(
      refreshToken
    );
    if (!document) {
      throw new NotFoundError("Refresh token not found in database");
    }
  };

  checkRefreshTokenInDatabase = async (refreshToken) => {
    const document = await this.userTokenRepository.findByToken(refreshToken);
    if (!document) {
      throw new NotFoundError("Refresh token not found in database");
    }
    return document;
  };
}

export default AuthServices;
