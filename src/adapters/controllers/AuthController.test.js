import AuthController from "./AuthController";
import { jest } from "@jest/globals";

const mockRegisterUseCase = {
  execute: jest.fn(),
};

const mockLoginUseCase = {
  execute: jest.fn(),
};

const mockLogoutUseCase = {
  execute: jest.fn(),
};

const mockRefreshTokenUseCase = {
  execute: jest.fn(),
};

const authController = new AuthController({
  registerUseCase: mockRegisterUseCase,
  loginUseCase: mockLoginUseCase,
  logoutUseCase: mockLogoutUseCase,
  refreshTokenUseCase: mockRefreshTokenUseCase,
});

describe("AuthController", () => {
  test("Registering a user", async () => {
    const req = {
      body: {
        userName: "test",
        email: "test@example.com",
        password: "password",
        confirmPassword: "password",
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockRegisterUseCase.execute.mockResolvedValue({
      status: 200,
      data: { message: "User registered successfully" },
    });
    await authController.register(req, res);
    expect(mockRegisterUseCase.execute).toHaveBeenCalledWith({
      userName: "test",
      email: "test@example.com",
      password: "password",
      confirmPassword: "password",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
    });
  });

  test("User login", async () => {
    const req = {
      body: { emailOrUserName: "test@example.com", password: "password" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockLoginUseCase.execute.mockResolvedValue({
      status: 200,
      data: { token: "mockToken" },
    });
    await authController.login(req, res);
    expect(mockLoginUseCase.execute).toHaveBeenCalledWith({
      emailOrUserName: "test@example.com",
      password: "password",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "mockToken" });
  });

  test("User logout", async () => {
    const req = { body: { refreshToken: "mockRefreshToken" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockLogoutUseCase.execute.mockResolvedValue({
      status: 200,
      data: { message: "User logged out successfully" },
    });
    await authController.logout(req, res);
    expect(mockLogoutUseCase.execute).toHaveBeenCalledWith("mockRefreshToken");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User logged out successfully",
    });
  });

  test("Refreshing token", async () => {
    const req = { body: { refreshToken: "mockRefreshToken" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockRefreshTokenUseCase.execute.mockResolvedValue({
      status: 200,
      data: { token: "mockNewToken" },
    });
    await authController.refreshToken(req, res);
    expect(mockRefreshTokenUseCase.execute).toHaveBeenCalledWith(
      "mockRefreshToken"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "mockNewToken" });
  });
});
