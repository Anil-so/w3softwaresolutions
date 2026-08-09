const { supabase } = require('../config/supabase');
const { AppError } = require('../utils/appError');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return next(new AppError(401, 'Authentication token missing.'));
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next(new AppError(401, 'Invalid or expired Supabase authentication session.'));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError(401, err.message || 'Authentication failed.'));
  }
}

module.exports = authenticateToken;

