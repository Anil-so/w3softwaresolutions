const express = require('express');
const router = express.Router();

// Supabase Auth handles authentication directly on the frontend.
router.all('*', (req, res) => {
  res.json({
    success: true,
    message: 'Authentication is handled directly via Supabase Auth Email OTP. Please use the Supabase JS client on the frontend.',
  });
});

module.exports = router;
