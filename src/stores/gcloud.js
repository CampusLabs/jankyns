const {gcloud: {bucket, clientEmail, privateKey}} = require('../config');
const GCS = require('@google-cloud/storage');

const gcs = GCS({
  credentials: {client_email: clientEmail, private_key: privateKey}
});

exports.read = id =>
  gcs.bucket(bucket).file(`${id}.json`).download()
    .then(([data]) => JSON.parse(data.toString()))
    .catch(er => { if (er.code !== 404) throw er; });

exports.write = (id, data) =>
  gcs.bucket(bucket).file(`${id}.json`).save(JSON.stringify(data));
