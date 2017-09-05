const appendFile = require('fs').appendFile;
const addErrorHandler = require('./add-error-handler');

module.exports = (output, key, callback) => addErrorHandler(
  data => appendFile(output, '\n  "' + key + '": ' + JSON.stringify(data) + ',', callback)
);