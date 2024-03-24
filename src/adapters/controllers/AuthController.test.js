import AuthController from "./AuthController";
import { jest } from "@jest/globals";

describe("AuthController", () => {
  let authController;
  let loginUseCase;
  let registerUseCase;
  let logoutUseCase;
  let refreshTokenUseCase;

  beforeEach(() => {
    loginUseCase = {
      execute: jest.fn(),
    };
    registerUseCase = {
      execute: jest.fn(),
    };
    logoutUseCase = {
      execute: jest.fn(),
    };
    refreshTokenUseCase = {
      execute: jest.fn(),
    };

    authController = new AuthController({
      loginUseCase,
      registerUseCase,
      logoutUseCase,
      refreshTokenUseCase,
    });
  });

  describe("register", () => {
    it("should call registerUseCase.execute and set cookies", async () => {
      const req = {
        body: {
          userName: "testUser",
          image: "testImage",
          email: "test@example.com",
          password: "testPassword",
          confirmPassword: "testPassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),
      };
      const result = {
        status: 200,
        data: { message: "Registration successful" },
        jwt: {
          accessToken: "testAccessToken",
          refreshToken: "testRefreshToken",
        },
      };
      registerUseCase.execute.mockResolvedValue(result);

      await authController.register(req, res);

      expect(registerUseCase.execute).toHaveBeenCalledWith({
        userName: "testUser",
        image: "testImage",
        email: "test@example.com",
        password: "testPassword",
        confirmPassword: "testPassword",
      });
      expect(res.cookie).toHaveBeenCalledWith(
        "access_token",
        "testAccessToken",
        { httpOnly: true }
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "refresh_token",
        "testRefreshToken",
        { httpOnly: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Registration successful",
      });
    });
  });

  describe("login", () => {
    it("should call loginUseCase.execute and set cookies", async () => {
      const req = {
        body: {
          emailOrUserName: "test@example.com",
          password: "testPassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),
      };
      const result = {
        status: 200,
        data: { message: "Login successful" },
        jwt: {
          accessToken: "testAccessToken",
          refreshToken: "testRefreshToken",
        },
      };
      loginUseCase.execute.mockResolvedValue(result);

      await authController.login(req, res);

      expect(loginUseCase.execute).toHaveBeenCalledWith({
        emailOrUserName: "test@example.com",
        password: "testPassword",
      });
      expect(res.cookie).toHaveBeenCalledWith(
        "access_token",
        "testAccessToken",
        { httpOnly: true }
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "refresh_token",
        "testRefreshToken",
        { httpOnly: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Login successful" });
    });
  });

  describe("logout", () => {
    it("should call logoutUseCase.execute and clear cookies", async () => {
      const req = {
        cookies: {
          refresh_token: "testRefreshToken",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        clearCookie: jest.fn(),
      };
      const result = {
        status: 200,
        data: { message: "Logout successful" },
      };
      logoutUseCase.execute.mockResolvedValue(result);

      await authController.logout(req, res);

      expect(logoutUseCase.execute).toHaveBeenCalledWith("testRefreshToken");
      expect(res.clearCookie).toHaveBeenCalledWith("access_token");
      expect(res.clearCookie).toHaveBeenCalledWith("refresh_token");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
    });
  });

  describe("refreshToken", () => {
    it("should call refreshTokenUseCase.execute and set access_token cookie", async () => {
      const req = {
        cookies: {
          refresh_token: "testRefreshToken",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),
      };
      const result = {
        status: 200,
        data: { message: "Token refreshed" },
        jwt: {
          accessToken: "testAccessToken",
        },
      };
      refreshTokenUseCase.execute.mockResolvedValue(result);

      await authController.refreshToken(req, res);

      expect(refreshTokenUseCase.execute).toHaveBeenCalledWith(
        "testRefreshToken"
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "access_token",
        "testAccessToken",
        { httpOnly: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Token refreshed" });
    });
  });
});
