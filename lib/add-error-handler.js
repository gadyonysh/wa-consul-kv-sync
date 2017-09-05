const errorHandler = require('./error-handler');

module.exports = callback =>
  (err, ...args) =>
  {
    if (err) { return errorHandler(err); }

    callback(...args);
  };