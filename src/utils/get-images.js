const _ = require('underscore');
const http = require('http');
const https = require('https');
const normalizeImage = require('./normalize-image');
const vm = require('vm');

// Don't let a script run for more too long.
const timeout = 10000;

module.exports = options =>
  Promise.resolve().then(() => {
    const {jankynsFile} = options;
    if (!jankynsFile) return;

    let images;
    try {
      images = JSON.parse(jankynsFile);
    } catch (er) {
      try {
        images = vm.runInNewContext(jankynsFile, {http, https}, {timeout});
      } catch (er) {}
    }
    if (!images) return;

    if (typeof images !== 'function') return images;

    return images(options);
  }).then(images => {
    if (!Array.isArray(images)) images = [images];

    return _.compact(_.map(images, normalizeImage));
  });
