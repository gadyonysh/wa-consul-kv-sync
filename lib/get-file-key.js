module.exports = (file, rootLength) => file.substr(rootLength + 1)
  .split(/[/\\]/)
  .join('/')
  .replace(/([^/]+)\.[^.]+$/, '$1');