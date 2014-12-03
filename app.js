var Hapi = require('hapi');

var path = require('path');
var settings = require('config');

var routes = require('./routes');
var plugins = require('./plugins');
var models = require('./models');

var server = new Hapi.Server({
  connections:{
    routes:{
      cors:settings.cors
    }
  }
});
server.connection({port:settings.port, host:settings.host});

//While good isn't updated for Hapi 8
server.log = console.log;

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

var setup = function(done){
  // Bootstrap Hapi Server Plugins, passes the server object to the plugins
  plugins(server);

  // Add the server routes
  server.route(routes);

  initDb(function(){
    done();
  });
};

var start = function(){
  server.start(function(){
    server.log('info', 'Server running at: ' + server.info.uri);
  });
};

// If someone runs: "node app.js" then automatically start the server
if (path.basename(process.argv[1],'.js') == path.basename(__filename,'.js')) {
  setup(function(){
    start();
  });
}
