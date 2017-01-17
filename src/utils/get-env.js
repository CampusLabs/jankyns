const _ = require('underscore');
const {envs} = require('../config');

module.exports = id => {
  const env = envs[id];
  if (env) return env;

  throw _.extend(
    new Error(`Unknown env: ${id}`),
    {isPublic: true, status: 400}
  );
};
