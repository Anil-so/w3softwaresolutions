const Joi = require('joi');

const createApplicantSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().email().required(),
  mobile: Joi.string().trim().min(7).max(20).required(),
});

const updateApplicantSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).optional(),
  email: Joi.string().trim().email().optional(),
  mobile: Joi.string().trim().min(7).max(20).optional(),
  gender: Joi.string().allow('').max(20).optional(),
  country: Joi.string().allow('').max(80).optional(),
  state: Joi.string().allow('').max(80).optional(),
  city: Joi.string().allow('').max(80).optional(),
  address: Joi.string().allow('').max(300).optional(),
  qualification: Joi.string().allow('').max(120).optional(),
  skills: Joi.string().allow('').max(500).optional(),
  resumeUrl: Joi.string().uri().allow('').optional(),
});

module.exports = { createApplicantSchema, updateApplicantSchema };
