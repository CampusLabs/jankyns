const _ = require('underscore');
const {maxConcurrentBuilds} = require('../config');
const docker = require('./docker');
const getProvider = require('./get-provider');
const getTags = require('./get-tags');
const promisify = require('./promisify');
const publish = require('./publish');

const call = (obj, key, ...args) => promisify(obj[key].bind(obj))(...args);

const getAuthConfig = ({registryConfig = {}, image: {repo}}) => {
  let host = repo.split('/').slice(-3, -2)[0];
  if (!host) host = 'https://index.docker.io/v1/';
  return registryConfig[host];
};

const handleStream = ({ignoreError = false, onProgress} = {}) =>
  stream =>
    new Promise((resolve, reject) =>
      docker.modem.followProgress(
        stream,
        er => !ignoreError && er ? reject(er) : resolve(),
        onProgress
      )
    );

const pull = options =>
  call(docker, 'pull', getTags(options)[0], {
    authconfig: getAuthConfig(options)
  }).then(handleStream({ignoreError: true}));

const build = options => {
  const {image, image: {buildArgs, dockerfile}, registryConfig} = options;
  image.buildOutput = [];
  return getProvider(options.provider).getTarStream(options).then(tar =>
    call(docker, 'buildImage', tar, {
      registryconfig: registryConfig,
      buildargs: buildArgs,
      t: getTags(options)[0],
      dockerfile
    })
  ).then(handleStream({onProgress: event => image.buildOutput.push(event)}));
};

const tagExtras = options => {
  const tags = getTags(options);
  const image = docker.getImage(tags[0]);
  return Promise.all(_.map(tags.slice(1), fullTag => {
    const [repo, tag] = fullTag.split(':');
    return call(image, 'tag', {repo, tag});
  }));
};

const push = options =>
  Promise.all(_.map(getTags(options), tag =>
    call(docker.getImage(tag), 'push', {
      authconfig: getAuthConfig(options)
    }).then(handleStream())
  ));

const nextBuild = () => {
  if (getBuilding().length >= maxConcurrentBuilds) return;

  const options = queue.shift();
  if (!options) return;

  options.image.status = 'building';
  return publish(options).then(() => run(options));
};

const run = options =>
  pull(options)
    .then(() => build(options))
    .then(() => tagExtras(options))
    .then(() => push(options))
    .then(() => {
      options.image.status = 'success';
      return publish(options);
    })
    .catch(er => {
      options.image.error = er;
      options.image.status = 'failure';
      return publish(options);
    })
    .then(() => queue.splice(queue.indexOf(options), 1))
    .then(nextBuild)
    .catch(console.error.bind(console));

const getBuilding = () =>
  _.filter(queue, ({image: {status}}) => status === 'building');

const queue = [];
module.exports = options => {
  queue.push(options);

  if (getBuilding().length >= maxConcurrentBuilds) return publish(options);

  nextBuild();
};
