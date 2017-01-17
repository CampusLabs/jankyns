const {store} = require('../config');
const stores = require('../stores');

module.exports = stores[store];
