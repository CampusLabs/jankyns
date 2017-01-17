const _ = require('underscore');
const builds = require('../utils/builds');

module.exports = ({params: {buildId}}, res, next) => {
  const build = builds[buildId];
  if (!build) return next(_.extend(new Error(), {status: 404}));

  res.send(`<pre>${_.escape(JSON.stringify(build.images, null, 2))}</pre>`);
};
