import bcrypt from "bcryptjs";

class SecurityService {
  constructor() {
    this.saltRounds = 10;
  }

  async hashPassword(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error("Password hashing failed");
    }
  }

  async comparePasswords(password, hashedPassword) {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch (error) {
      throw new Error("Password comparison failed");
    }
  }
}

export default SecurityService;
