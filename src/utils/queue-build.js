const buildImages = require('./build-images');
const builds = require('./builds');
const prepareBuild = require('./prepare-build');

module.exports = options =>
  prepareBuild(options).then(options => {
    if (options.images.length) {
      builds[options.buildId] = options;
      const removeBuild = () => { delete builds[options.buildId]; };
      buildImages(options).then(removeBuild).catch(removeBuild);
    }

    return options;
  });
