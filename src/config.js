const fs = require('fs');
const os = require('os');

const {env} = process;

const maybeRead = (key, keyPath) => key || keyPath && fs.readFileSync(keyPath);

module.exports = {
  envs: JSON.parse(env.ENVS || '{}'),
  docker: {
    host: env.DOCKER_HOST,
    port: env.DOCKER_PORT,
    protocol: env.DOCKER_PROTOCOL && parseInt(env.DOCKER_PROTOCOL),
    socketPath: env.DOCKER_SOCKET_PATH,
    ca: maybeRead(env.DOCKER_CA, env.DOCKER_CA_PATH),
    cert: maybeRead(env.DOCKER_CERT, env.DOCKER_CERT_PATH),
    key: maybeRead(env.DOCKER_KEY, env.DOCKER_KEY_PATH)
  },
  maxConcurrentBuilds: parseInt(env.MAX_CONCURRENT_BUILDS) || os.cpus().length,
  publicUrl: env.PUBLIC_URL
};
