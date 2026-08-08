const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate');
const { createApplicantSchema, updateApplicantSchema } = require('../validators/applicant.validator');
const authenticateToken = require('../middleware/auth');
const { AppError } = require('../utils/appError');
const { serializeApplicant, findApplicantByEmail, createApplicant, getApplicantById, updateApplicantById } = require('../services/applicantService');

const router = express.Router();

router.post('/register', validate(createApplicantSchema), asyncHandler(async (req, res) => {
  const { fullName, email, mobile } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await findApplicantByEmail(normalizedEmail);
  if (existing.data) {
    return res.status(200).json({
      success: true,
      message: 'Applicant already exists.',
      applicant: serializeApplicant(existing.data),
    });
  }

  const created = await createApplicant({ fullName, email: normalizedEmail, mobile });
  res.status(201).json({
    success: true,
    message: 'Applicant created successfully.',
    applicant: serializeApplicant(created.data),
  });
}));

router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const applicant = await getApplicantById(req.user.sub);
  if (!applicant.data) {
    throw new AppError(404, 'Applicant profile not found.');
  }

  res.json({
    success: true,
    applicant: serializeApplicant(applicant.data),
  });
}));

router.patch('/update', authenticateToken, validate(updateApplicantSchema), asyncHandler(async (req, res) => {
  const updates = {
    fullName: req.body.fullName,
    mobile: req.body.mobile,
    gender: req.body.gender,
    country: req.body.country,
    state: req.body.state,
    city: req.body.city,
    address: req.body.address,
    qualification: req.body.qualification,
    skills: req.body.skills,
    resumeUrl: req.body.resumeUrl,
  };

  const filteredUpdates = Object.fromEntries(Object.entries(updates).filter(([, value]) => value !== undefined));
  const normalizedUpdates = {
    ...(filteredUpdates.fullName ? { full_name: filteredUpdates.fullName } : {}),
    ...(filteredUpdates.mobile ? { mobile: filteredUpdates.mobile } : {}),
    ...(filteredUpdates.gender !== undefined ? { gender: filteredUpdates.gender } : {}),
    ...(filteredUpdates.country !== undefined ? { country: filteredUpdates.country } : {}),
    ...(filteredUpdates.state !== undefined ? { state: filteredUpdates.state } : {}),
    ...(filteredUpdates.city !== undefined ? { city: filteredUpdates.city } : {}),
    ...(filteredUpdates.address !== undefined ? { address: filteredUpdates.address } : {}),
    ...(filteredUpdates.qualification !== undefined ? { qualification: filteredUpdates.qualification } : {}),
    ...(filteredUpdates.skills !== undefined ? { skills: filteredUpdates.skills } : {}),
    ...(filteredUpdates.resumeUrl !== undefined ? { resume_url: filteredUpdates.resumeUrl } : {}),
    updated_at: new Date().toISOString(),
  };

  const updated = await updateApplicantById(req.user.sub, normalizedUpdates);
  if (!updated.data) {
    throw new AppError(404, 'Applicant profile not found.');
  }

  res.json({
    success: true,
    message: 'Applicant updated successfully.',
    applicant: serializeApplicant(updated.data),
  });
}));

module.exports = router;
