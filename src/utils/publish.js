const _ = require('underscore');
const publishers = require('../publishers');
const saveBuild = require('./save-build');

const logError = console.error.bind(console);

module.exports = options =>
  saveBuild(options).catch(logError).then(() =>
    Promise.all(_.map(publishers, publisher =>
      publisher(options).catch(logError)
    ))
  );
