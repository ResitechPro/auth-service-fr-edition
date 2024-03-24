import CustomError from "./CustomError.js";

class ClientError extends CustomError {
  constructor(message) {
    super(message, 400);
  }
}

export default ClientError;
