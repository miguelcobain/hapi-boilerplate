'use strict';

var Hapi = require('hapi');

var path = require('path');
var settings = require('config');

var routes = require('./routes');
var plugins = require('./plugins');
var models = require('./models');

var server = new Hapi.Server();

server.connection({port:settings.port, host:settings.host});

// Export the server to be required elsewhere.
module.exports = server;

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

server.start((err)=>{
  if(err){
    throw err;
  }
  initDb(()=>{
      console.log(`Server running at: ${server.info.uri}`);
  });
  
});
