const getBuildUrl = require('../utils/get-build-url');
const getTags = require('../utils/get-tags');
const Octokat = require('octokat');

const STATES = {
  waiting: {
    state: 'pending',
    description: 'Image is waiting in the build queue.'
  },
  building: {
    state: 'pending',
    description: 'Image is building.'
  },
  success: {
    state: 'success',
    description: 'Image is built and pushed.'
  },
  failure: {
    state: 'failure',
    description: 'Image failed to build.'
  }
};

module.exports = options =>
  Promise.resolve().then(() => {
    const {provider: providerId, githubToken: token} = options;
    if (providerId !== 'github' || !token) return;

    const {buildId, image: {status}, owner, repo, sha} = options;
    const context = getTags(options)[0].split(':')[0];
    const {state, description} = STATES[status];
    return (new Octokat({token})).repos(owner, repo).statuses(sha).create({
      context,
      state,
      description,
      target_url: getBuildUrl(buildId)
    });
  });
