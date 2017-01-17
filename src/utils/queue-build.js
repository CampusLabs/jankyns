const buildImages = require('./build-images');
const builds = require('./builds');
const prepareBuild = require('./prepare-build');

module.exports = options =>
  prepareBuild(options).then(options => {
    if (options.images.length) {
      builds[options.buildId] = options;
      buildImages(options);
    }

    return options;
  });
