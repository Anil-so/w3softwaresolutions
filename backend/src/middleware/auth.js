const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/appError');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next(new AppError(401, 'Authentication token missing.'));
  }

  const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-jwt-secret-change-me');
  if (!jwtSecret) {
    return next(new AppError(500, 'JWT secret is not configured.'));
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError(403, 'Invalid or expired token.'));
  }
}

module.exports = authenticateToken;
