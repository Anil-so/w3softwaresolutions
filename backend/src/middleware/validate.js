const { AppError } = require('../utils/appError');

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return next(new AppError(400, 'Validation failed', details));
    }

    req.body = value;
    next();
  };
}

module.exports = { validate };
