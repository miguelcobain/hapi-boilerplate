var controllers = require('./controllers');

module.exports = function(){
  return [
    {
      method: 'GET',
      path: '/users',
      handler: controllers.users.get
    },
    {
      method: 'GET',
      path: '/salute/{name}',
      handler: controllers.users.salute
    }
  ];
};