const Joi = require('joi');

const submitApplicationSchema = Joi.object({
  jobTitle: Joi.string().min(2).max(120).required(),
  fullName: Joi.string().allow('').max(100),
  email: Joi.string().email().allow('').optional(),
  phone: Joi.string().allow('').max(20),
  message: Joi.string().allow('').max(2000),
  resumeUrl: Joi.string().uri().allow('').optional(),
});

module.exports = { submitApplicationSchema };
