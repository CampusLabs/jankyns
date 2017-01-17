const {docker} = require('../config');
const Docker = require('dockerode');

module.exports = new Docker(docker);
