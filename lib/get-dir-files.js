const fs = require('fs');

const getDirFiles = (path, errorHandler) =>
{
  const files = [];
  const addFile = file => files.push(file);

  try
  {
    const items = fs.readdirSync(path, 'utf8');

    items.forEach(file =>
    {
      const filePath = path + '/' + file;
      const stat = fs.statSync(filePath);

      if (stat.isDirectory())
      {
        files.push(...getDirFiles(filePath, errorHandler));
      }
      else
      {
        addFile(filePath);
      }
    });
  }
  catch (err)
  {
    errorHandler(err);
  }

  return files;
};

module.exports = getDirFiles;