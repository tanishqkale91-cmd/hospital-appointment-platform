const { HttpError } = require('./errorHandler');

/** Allow only the listed roles. Must run after `protect`. */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return next(new HttpError(401, 'Not authenticated'));
  if (!roles.includes(req.user.role)) {
    return next(new HttpError(403, `Role '${req.user.role}' is not allowed to access this resource`));
  }
  next();
};

module.exports = { authorize };
