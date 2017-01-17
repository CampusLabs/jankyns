const _ = require('underscore');
const providers = require('../providers');

module.exports = options =>
  Promise.resolve().then(() => {
    const provider = providers[options.provider];
    if (!provider) {
      throw _.extend(new Error(`Unknown provider: '${options.provider}'`), {
        isPublic: true,
        status: 400
      });
    }

    options.provider = provider;

    return options;
  });
