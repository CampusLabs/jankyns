const _ = require('underscore');
const getBuild = require('../utils/get-build');

module.exports = ({params: {buildId}}, res, next) =>
  getBuild(buildId).then(build => {
    if (!build) return next(_.extend(new Error(), {status: 404}));

    res.send(`<pre>${_.escape(JSON.stringify(build.images, null, 2))}</pre>`);
  }).catch(next);
