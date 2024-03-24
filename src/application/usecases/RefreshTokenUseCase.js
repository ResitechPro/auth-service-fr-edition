import UnauthorizedError from "../../../infrastructure/exceptions/UnauthorizedError.js";

class RefreshTokenUseCase {
  constructor({ authServices }) {
    this.authServices = authServices;
  }

  execute = async (refreshToken) => {
    if (!refreshToken) {
      throw new UnauthorizedError("Missing refresh token");
    }

    const payload = await this.authServices.verifyToken(refreshToken);

    const userCredentials = await this.authServices.getUserCredentials(
      payload.id
    );

    const accessToken = await this.authServices.generateAccessToken(
      userCredentials
    );

    return {
      status: 200,
      jwt: {
        accessToken,
      },
      data: {
        message: "Access token has been refreshed successfully!",
      },
    };
  };
}

export default RefreshTokenUseCase;
