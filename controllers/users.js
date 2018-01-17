var models = require('../models');

module.exports = {
	get:function (request, reply) {
    return models.User.findAll();
	},
	salute:function (request, reply) {
	  return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
	}
};