const _ = require('underscore');
const bodyParser = require('body-parser');
const express = require('express');

const NOT_FOUND = _.extend(new Error(), {status: 404});

express()
  .enable('case sensitive routing')
  .enable('strict routing')
  .disable('x-powered-by')
  .use(bodyParser.json())
  .get('/health-check', require('../handlers/health-check'))
  .get('/builds/:buildId', require('../handlers/read-build'))
  .post('/builds', require('../handlers/create-build'))
  .post('/webhook/:envId', require('../handlers/webhook'))
  .use((req, res, next) => next(NOT_FOUND))
  .use(require('../handlers/error'))
  .listen(80);
