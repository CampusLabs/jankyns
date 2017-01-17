const builds = require('./builds');
const store = require('./store');

module.exports = id =>
  Promise.resolve().then(() => builds[id] || store && store.read(id));
