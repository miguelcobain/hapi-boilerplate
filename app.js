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

	//Register all plugins
	server.register(plugins, function (err) {
		if (err) {
			throw err; // something bad happened loading a plugin
		}
	});

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
