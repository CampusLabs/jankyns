const _ = require('underscore');

const DEFAULTS = {
  buildArgs: {},
  buildContext: '.',
  dockerfile: 'Dockerfile',
  tagPrefix: '',
  tagSuffix: ''
};

module.exports = image => {
  if (!image) return;

  if (typeof image === 'string') image = {repo: image};

  if (!image.repo) return;

  return _.extend({}, DEFAULTS, image, {status: 'waiting'});
};
