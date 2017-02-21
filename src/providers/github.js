const _ = require('underscore');
const createTarStrip = require('../utils/create-tar-strip');
const fetch = require('node-fetch');
const Octokat = require('octokat');
const zlib = require('zlib');

exports.getOptionsFromWebhook = ({
  req: {
    headers: {'x-github-event': event},
    body: {
      after: sha,
      deleted,
      ref = '',
      repository: {full_name: fullName = ''} = {}
    }
  }
}) =>
  Promise.resolve().then(() => {
    if (event !== 'push' || deleted) return;

    const [owner, repo] = fullName.split('/');
    ref = ref.split('/')[2];
    if (owner && repo && ref) return {owner, repo, ref, sha};
  });

const NO_OWNER_ERROR = _.extend(
  new Error('`owner` was not specified'),
  {isPublic: true, status: 400}
);

const NO_REPO_ERROR = _.extend(
  new Error('`repo` was not specified'),
  {isPublic: true, status: 400}
);

const NO_REF_ERROR = _.extend(
  new Error('`ref` was not specified'),
  {isPublic: true, status: 400}
);

exports.getSha = ({owner, githubToken: token, ref, repo}) =>
  Promise.resolve().then(() => {
    if (!owner) throw NO_OWNER_ERROR;

    if (!repo) throw NO_REPO_ERROR;

    if (!ref) throw NO_REF_ERROR;

    return (new Octokat({token})).repos(owner, repo).commits(ref).fetch()
      .then(({sha}) => sha);
  });

exports.getFile = ({owner, githubToken: token, ref, repo, file}) =>
  (new Octokat({token})).repos(owner, repo).contents(file).fetch({ref})
    .then(({content}) => Buffer.from(content, 'base64').toString())
    .catch(er => { if (er.status !== 404) throw er; });

exports.getTarStream = ({
  owner,
  githubToken,
  repo,
  sha,
  image: {buildContext}
}) =>
  fetch(
    `https://api.github.com/repos/${owner}/${repo}/tarball/${sha}` +
      `?access_token=${githubToken}`
  ).then(res => {
    if (res.status >= 400) throw _.extend(new Error(), {status: res.status});

    return res.body
      .pipe(zlib.createGunzip())
      .pipe(createTarStrip({strip: 1, base: buildContext}));
  });
