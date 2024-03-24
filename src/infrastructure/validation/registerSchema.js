import Joi from "joi";

const registerSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required(),
  image: Joi.string().allow(null, ""),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  confirmPassword: Joi.ref("password"),
});

export default registerSchema;
