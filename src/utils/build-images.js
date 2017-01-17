const _ = require('underscore');
const buildImage = require('./build-image');

module.exports = options =>
  Promise.all(_.map(options.images, image =>
    buildImage(_.extend({}, options, {image}))
  ));
