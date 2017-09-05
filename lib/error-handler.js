module.exports = err =>
{
  console.error(err.message);
  process.exit(1);
};