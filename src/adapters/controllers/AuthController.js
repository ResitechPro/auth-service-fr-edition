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

    res.status(result.status).json(result.data);
  };

  login = async (req, res) => {
    const { emailOrUserName, password } = req.body;

    const result = await this.loginUseCase.execute({
      emailOrUserName,
      password,
    });

    res.status(result.status).json(result.data);
  };

  logout = async (req, res) => {
    const { refreshToken } = req.body;

    const result = await this.logoutUseCase.execute(refreshToken);

    res.status(result.status).json(result.data);
  };

  refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    const result = await this.refreshTokenUseCase.execute(refreshToken);

    res.status(result.status).json(result.data);
  };
}

export default AuthController;
