class AuthMiddleware {
  constructor({ authServices }) {
    this.authServices = authServices;
  }

  authenticateUser = async (req, res, next) => {
    const { access_token } = req.cookies;
    if (!access_token) {
      res.status(401).json({ error: "Access Denied: Token not provided" });
    }

    const decoded = await this.authServices.verifyToken(access_token);

    req.user = decoded;
    next();
  };
}

export default AuthMiddleware;
