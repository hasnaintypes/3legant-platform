import Joi from "joi";

export const updateProfileSchema = Joi.object({
  avatar: Joi.string().uri().optional(),
  address: Joi.string().optional(),
  postalCode: Joi.string().optional(),
  city: Joi.string().optional(),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});
