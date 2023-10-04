'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const env = require('env-var');
exports.default = Object.freeze({
  client: 'pg',
  connection: env.get('DATABASE_CONNECTION_STRING').required(true).asString(),
});
