const http = require('http');

module.exports = (er, req, res, next) => {
  if (!er.status) er.status = 500;
  const publicMessage = (er.isPublic && er.message) ||
    http.STATUS_CODES[er.status] || 'Unknown';
  if (!er.message) er.message = publicMessage;
  console.log(er);
  res.status(er.status).send({error: publicMessage});
};
