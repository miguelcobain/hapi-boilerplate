var plugins = [
  //require additional plugins
];


module.exports = function (server) {
  server.register(plugins, function (err) {
    if (err) {
      throw err; // something bad happened loading the plugin
    }
  });
};
