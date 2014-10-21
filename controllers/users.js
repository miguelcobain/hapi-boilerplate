var models = require('../models');

module.exports = {
	get:function (request, reply) {
    reply(models.User.findAll());
	},
	salute:function (request, reply) {
	  reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
	}
};