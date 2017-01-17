const _ = require('underscore');
const providers = require('../providers');

module.exports = id => {
  const provider = providers[id];
  if (provider) return provider;

  throw _.extend(
    new Error(`Unknown provider: ${id}`),
    {isPublic: true, status: 400}
  );
};
