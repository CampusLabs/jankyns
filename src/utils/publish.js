const _ = require('underscore');
const publishers = require('../publishers');
const saveBuild = require('./save-build');

module.exports = options =>
  saveBuild(options).then(() =>
    Promise.all(_.map(publishers, publisher =>
      publisher(options).catch(console.error.bind(console)))
    )
  );
