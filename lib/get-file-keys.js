module.exports = (file, prefixLength) => file.substr(prefixLength)
  .replace('\\', '/')
  .replace(/([^/]+)\.[^.]+$/, '$1')
  .split('/');