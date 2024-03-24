class AuthController {
  constructor({
    loginUseCase,
    registerUseCase,
    logoutUseCase,
    refreshTokenUseCase,
  }) {
    this.loginUseCase = loginUseCase;
    this.registerUseCase = registerUseCase;
    this.logoutUseCase = logoutUseCase;
    this.refreshTokenUseCase = refreshTokenUseCase;
  }

  register = async (req, res) => {
    const { userName, image, email, password, confirmPassword } = req.body;

    const result = await this.registerUseCase.execute({
      userName,
      image,
      email,
      password,
      confirmPassword,
    });

    if (result?.jwt) {
      res.cookie("access_token", result.jwt.accessToken, { httpOnly: true });
      res.cookie("refresh_token", result.jwt.refreshToken, { httpOnly: true });
    }

    res.status(result.status).json(result.data);
  };

  login = async (req, res) => {
    const { emailOrUserName, password } = req.body;

    const result = await this.loginUseCase.execute({
      emailOrUserName,
      password,
    });

    if (result?.jwt) {
      res.cookie("access_token", result.jwt.accessToken, { httpOnly: true });
      res.cookie("refresh_token", result.jwt.refreshToken, { httpOnly: true });
    }

    res.status(result.status).json(result.data);
  };

  logout = async (req, res) => {
    const { refresh_token } = req.cookies;

    const result = await this.logoutUseCase.execute(refresh_token);

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(result.status).json(result.data);
  };

  refreshToken = async (req, res) => {
    const { refresh_token } = req.cookies;

    const result = await this.refreshTokenUseCase.execute(refresh_token);

    if (result.jwt) {
      res.cookie("access_token", result.jwt.accessToken, { httpOnly: true });
    }

    res.status(result.status).json(result.data);
  };
}

export default AuthController;
