'use strict';

var Hapi = require('hapi');

var path = require('path');
var settings = require('config');

var routes = require('./routes');
var plugins = require('./plugins');
var models = require('./models');

const internals = {
  templatePath: '.'
};

const server = new Hapi.Server({
  host:settings.host,
  port: settings.port
});

// server.connection({port:settings.port, host:settings.host});

// Export the server to be required elsewhere.

var initDb = function(cb){
  var sequelize = models.sequelize;

  //Test if we're in a sqlite memory database. we may need to run migrations.
  if(sequelize.getDialect()==='sqlite' &&
      (!sequelize.options.storage || sequelize.options.storage === ':memory:')){
    sequelize.getMigrator({
      path: process.cwd() + '/migrations',
    }).migrate().success(function(){
      // The migrations have been executed!
      cb();
    });
  } else {
    cb();
  }
};

server.route(routes);


internals.main = async () => {
  await server.start();
  initDb(()=>{
    console.log('Server is running at ' + server.info.uri);
  });
 
}

internals.main();

module.exports = server;
