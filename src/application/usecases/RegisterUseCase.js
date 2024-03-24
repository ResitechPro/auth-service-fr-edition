class RegisterUseCase {
  constructor({ authServices }) {
    this.authServices = authServices;
  }

  execute = async (userCredentials) => {
    await this.authServices.validateUserCredentials(userCredentials);

    await this.authServices.prepareUserCredentials(userCredentials);

    const user = await this.authServices.register(userCredentials);

    const { accessToken, refreshToken } =
      await this.authServices.generateTokens(user);

    await this.authServices.storeRefreshTokenInDatabase(refreshToken, user.id);

    return {
      status: 200,
      jwt: {
        accessToken,
        refreshToken,
      },
      data: {
        message: "Register successfully",
        user,
      },
    };
  };
}

export default RegisterUseCase;
