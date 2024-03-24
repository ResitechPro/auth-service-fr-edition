import AuthServices from "./AuthServices";
import { jest } from "@jest/globals";

describe("AuthServices", () => {
  let authServices;
  let userRepository;
  let userTokenRepository;
  let securityService;
  let jsonWebToken;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmailOrUserName: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUserName: jest.fn(),
    };
    userTokenRepository = {
      upsert: jest.fn(),
      softDeleteByToken: jest.fn(),
      findByToken: jest.fn(),
    };
    securityService = {
      comparePasswords: jest.fn(),
      hashPassword: jest.fn(),
    };
    jsonWebToken = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    authServices = new AuthServices({
      userRepository,
      userTokenRepository,
      securityService,
      jsonWebToken,
    });
  });

  describe("register", () => {
    it("should register a user", async () => {
      const data = {
        userName: "john_doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
      };
      const user = {
        id: "userId",
        userName: "john_doe",
        image: null,
        email: "john@example.com",
        isVerified: false,
      };

      userRepository.create.mockResolvedValue(user);

      const result = await authServices.register(data);

      expect(userRepository.create).toHaveBeenCalledWith(data);
      expect(result).toEqual({
        id: user.id,
        userName: user.userName,
        image: user.image,
        email: user.email,
        isVerified: user.isVerified,
      });
    });
  });

  describe("login", () => {
    it("should login a user", async () => {
      const data = {
        emailOrUserName: "john@example.com",
        password: "password123",
      };
      const user = {
        id: "userId",
        userName: "john_doe",
        image: null,
        email: "john@example.com",
        isVerified: true,
        password: "hashedPassword",
      };

      userRepository.findByEmailOrUserName.mockResolvedValue(user);
      securityService.comparePasswords.mockResolvedValue(true);

      const result = await authServices.login(data);

      expect(userRepository.findByEmailOrUserName).toHaveBeenCalledWith(
        data.emailOrUserName
      );
      expect(securityService.comparePasswords).toHaveBeenCalledWith(
        data.password,
        user.password
      );
      expect(result).toEqual({
        id: user.id,
        userName: user.userName,
        image: user.image,
        email: user.email,
        isVerified: user.isVerified,
      });
    });

    it("should throw an error if user is not found", async () => {
      const data = {
        emailOrUserName: "john@example.com",
        password: "password123",
      };

      userRepository.findByEmailOrUserName.mockResolvedValue(null);

      await expect(authServices.login(data)).rejects.toThrow("User not found");
    });

    it("should throw an error if password is incorrect", async () => {
      const data = {
        emailOrUserName: "john@example.com",
        password: "password123",
      };
      const user = {
        id: "userId",
        userName: "john_doe",
        image: null,
        email: "john@example.com",
        isVerified: true,
        password: "hashedPassword",
      };

      userRepository.findByEmailOrUserName.mockResolvedValue(user);
      securityService.comparePasswords.mockResolvedValue(false);

      await expect(authServices.login(data)).rejects.toThrow(
        "Password is incorrect"
      );
    });
  });
});
