const _ = require('underscore');
const crypto = require('crypto');
const getEnv = require('../utils/get-env');
const getImages = require('./get-images');
const getProvider = require('./get-provider');

module.exports = options => {
  const env = getEnv((options || {}).envId);
  options = _.extend({}, env, options);
  const provider = getProvider(options.provider);
  options.buildId = crypto.randomBytes(32).toString('hex');
  return provider.getSha(options)
    .then(sha => options.sha = sha)
    .then(() =>
      Promise.all(_.map(['.json', '.js'], ext =>
        provider.getFile(_.extend({}, options, {file: `jankyns${ext}`}))
      ))
    )
    .then(files => _.extend(options, {jankynsFile: _.compact(files)[0]}))
    .then(() => getImages(options))
    .then(images => _.extend(options, {images}));
};
