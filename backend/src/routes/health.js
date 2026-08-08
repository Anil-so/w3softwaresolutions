const express = require('express');
const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'w3-solution-craft-backend',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
