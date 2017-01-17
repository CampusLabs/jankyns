const _ = require('underscore');

module.exports = ({image: {repo, tagPrefix, tagSuffix}, sha, ref}) =>
  _.unique([
    `${repo}:${tagPrefix}${sha}${tagSuffix}`,
    `${repo}:${tagPrefix}${ref}${tagSuffix}`
  ]);
