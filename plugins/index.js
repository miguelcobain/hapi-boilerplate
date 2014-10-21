var plugins = [
  require('good'),
  require('hapi-as-promised')
  //require additional plugins
];


module.exports = function (server) {
  server.pack.register(plugins, function (err) {
    if (err) {
      throw err; // something bad happened loading the plugin
    }
  });
};