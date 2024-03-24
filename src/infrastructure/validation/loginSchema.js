import Joi from "joi";

const loginSchema = Joi.object({
  emailOrUserName: Joi.string().required(),
  password: Joi.string().required(),
});

export default loginSchema;
