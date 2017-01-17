const _ = require('underscore');
const publishers = require('../publishers');

module.exports = options =>
  Promise.all(_.map(publishers, publisher =>
    publisher(options).catch(console.error.bind(console)))
  );
