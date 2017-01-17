const {publicUrl} = require('../config');

module.exports = buildId => `${publicUrl}/builds/${buildId}`;
