import jwt from "jsonwebtoken";

class JsonWebToken {
  constructor(privateKey, publicKey) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  sign = (payload, exp = "1h") => {
    const options = {
      algorithm: "RS256",
      expiresIn: exp,
    };

    return jwt.sign(payload, this.privateKey, options);
  };

  verify = (token) => {
    const options = {
      algorithms: ["RS256"],
    };

    try {
      const decoded = jwt.verify(token, this.publicKey, options);
      return {
        isValid: true,
        decoded,
      };
    } catch (err) {
      return {
        isValid: false,
        error: err.message,
      };
    }
  };
}

export default JsonWebToken;
