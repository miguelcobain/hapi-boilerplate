var Hapi = require('hapi');

var path = require('path');
var settings = require('config');

var routes = require('./routes');
var plugins = require('./plugins');

var server = new Hapi.Server(settings.host,settings.port,settings.hapi.options);

// Export the server to be required elsewhere.
module.exports = server;

var start = function (done) {

  // Bootstrap Hapi Server Plugins, passes the server object to the plugins
  plugins(server);

  // Require the routes and pass the server object.
  var routeTable = routes();

  // Add the server routes
  server.route(routeTable);

  // Start server
  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });

};

// If someone runs: "node app.js" then automatically start the server
if (path.basename(process.argv[1],'.js') == path.basename(__filename,'.js')) {
  start();
}