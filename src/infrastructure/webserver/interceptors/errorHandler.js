import CustomError from "../../exceptions/CustomError.js";
import logger from "../../packages/pino/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (!(err instanceof CustomError)) {
    res.status(500).json({
      message: "Server error, please try again later",
    });
  } else {
    const { message, additionalInfo, status } = err;
    const response = {
      message,
      ...(additionalInfo && { additionalInfo }),
    };
    res.status(status).json(response);
  }
};

export default errorHandler;
