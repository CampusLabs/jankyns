const _ = require('underscore');
const getEnv = require('../utils/get-env');
const getProvider = require('../utils/get-provider');
const queueBuild = require('../utils/queue-build');

module.exports = (req, res, next) =>
  Promise.resolve().then(() => {
    const {params: {envId}, query} = req;
    const options = _.extend({envId}, getEnv(envId), query);
    return getProvider(options.provider).getOptionsFromWebhook({req})
      .then(extra =>
        extra ? queueBuild(_.extend(options, extra)) : {status: 'noop'}
      )
      .then(res.send.bind(res));
  }).catch(next);
