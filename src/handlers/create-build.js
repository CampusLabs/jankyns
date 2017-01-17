const queueBuild = require('../utils/queue-build');

module.exports = ({body}, res, next) =>
  queueBuild(body).then(res.send.bind(res)).catch(next);
