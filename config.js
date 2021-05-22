'use strict';

var fs = require('fs');

module.exports.SSL_PORT = process.env.PORT || 443;
module.exports.SSL_KEY = fs.readFileSync('sslcerts/server.key', 'utf8');
module.exports.SSL_CERT = fs.readFileSync('sslcerts/server.crt', 'utf8');
module.exports.SSH_HOST = process.env.SSH_HOST || '172.17.0.1';
module.exports.SSH_PORT = Number(process.env.SSH_PORT) || 22;