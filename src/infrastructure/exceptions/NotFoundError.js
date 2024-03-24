import CustomError from "./CustomError.js";

class NotFoundError extends CustomError {
  constructor(message) {
    super(message, 404);
  }
}

export default NotFoundError;
