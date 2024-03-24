class LoginUseCase {
  constructor({ authServices }) {
    this.authServices = authServices;
  }

  execute = async (data) => {
    await this.authServices.validateLoginInputs(data);

    const user = await this.authServices.login(data);

    const { accessToken, refreshToken } =
      await this.authServices.generateTokens(user);

    await this.authServices.storeRefreshTokenInDatabase(refreshToken);

    return {
      status: 200,
      jwt: {
        accessToken,
        refreshToken,
      },
      data: {
        message: "Login successfully",
        user,
      },
    };
  };
}

export default LoginUseCase;
