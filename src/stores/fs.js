const fs = require('fs');
const {fs: {dir}} = require('../config');

exports.read = id =>
  new Promise(resolve =>
    fs.readFile(`${dir}/${id}.json`, (er, data) =>
      resolve(er || JSON.parse(data.toString()))
    )
  );

exports.write = (id, data) =>
  new Promise((resolve, reject) =>
    fs.writeFile(`${dir}/${id}.json`, JSON.stringify(data), er =>
      er ? reject(er) : resolve()
    )
  );
