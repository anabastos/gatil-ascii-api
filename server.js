'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 3001
});

server.app.db = mongojs('ascii-gatil-api', ['cats']);

server.register([
  require('./routes/cats')
], (err) => {

  if (err) throw err

  server.start((err) => {
    console.log('Server running at:', server.info.uri)
  })
})
