const _ = require('underscore');
const getBuildUrl = require('../utils/get-build-url');
const getTags = require('../utils/get-tags');

module.exports = options =>
  Promise.resolve().then(() => {
    const {buildId, image: {error, status}} = options;
    const isFailure = status === 'failure';
    const method = isFailure ? 'error' : 'log';
    const tags = getTags(options);
    const extras = _.map(tags.slice(1), tag => tag.split(':')[1]);
    const suffix = extras.length ? ` (${extras.join(', ')})` : '';
    if (isFailure) console.error(error);
    console[method](`${options.image.status}: ${tags[0]}${suffix}`);
    console[method](getBuildUrl(buildId));
  });
