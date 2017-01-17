const store = require('./store');

module.exports = options =>
  Promise.resolve().then(() => store && store.write(options.buildId, options));
