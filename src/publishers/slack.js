const _ = require('underscore');
const fetch = require('node-fetch');
const getBuildUrl = require('../utils/get-build-url');
const getTags = require('../utils/get-tags');

const ICONS = {
  waiting: '✋',
  building: '🛠',
  success: '✅',
  failure: '🚫'
};

module.exports = options =>
  Promise.resolve().then(() => {
    const {buildId, slackUrl} = options;
    if (!slackUrl) return;

    const icon = ICONS[options.image.status];
    const tags = getTags(options);
    const extras = _.map(tags.slice(1), tag => tag.split(':')[1]);
    const suffix = extras.length ? ` (${extras.join(', ')})` : '';
    const url = getBuildUrl(buildId);
    const text = `<${url}|${icon}> \`${tags[0]}\`${suffix}`;
    return fetch(slackUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({parse: 'none', text})
    });
  });
