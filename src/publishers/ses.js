const _ = require('underscore');
const {markdown} = require('nodemailer-markdown');
const config = require('../config');
const getBuildUrl = require('../utils/get-build-url');
const getTags = require('../utils/get-tags');
const nodemailer = require('nodemailer');
const nodemailerSesTransport = require('nodemailer-ses-transport');

const transport = nodemailer.createTransport(nodemailerSesTransport());
transport.use('compile', markdown());

const {from, to} = config.aws.ses;

export default options =>
  Promise.resolve().then(() => {
    if (!from || !to) return;

    const {buildId, image: {error, status}} = options;
    const tags = getTags(options);
    const extras = _.map(tags.slice(1), tag => tag.split(':')[1]);
    const suffix = extras.length ? ` (${extras.join(', ')})` : '';
    const subject = `${status}: ${tags[0]}${suffix}`;
    const markdown = `[View build details](${getBuildUrl(buildId)})` +
      (status === 'failure' ? `\n\n${error}` : '');
    return transport.sendMail({from, to, subject, markdown});
  });
