const fs = require('fs');
const addErrorHandler = require('./add-error-handler');

module.exports = (output, onComplete) =>
  () =>
  {
    fs.readFile(output, 'utf8', addErrorHandler(
      data => fs.writeFile(output, data.substring(0, data.length - 1) + '\n}', 'utf8', addErrorHandler(onComplete))
    ));
  };