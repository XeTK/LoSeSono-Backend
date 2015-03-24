
var db = require('../db/user');

function setup(deps) {

	var server = deps.server;

	db.setup(deps);

	server.getRoute(
		'/user',
		function (request, reply) {
			db.findUserByID(
				request.auth.credentials.user_id,
				function(data) {
					reply(data);
				}
			)
		}
	);

	server.getRoute(
		'/user/id/{user}',
		function (request, reply) {
		    db.findUserByID(
				request.params.user,
				function(data) {
					reply(data);
				}
			)
		}
	);

	server.getRoute(
		'/user/username/{user}',
		function (request, reply) {
		   	db.findUserByUsername(
				request.params.user,
				function(data) {
					reply(data);
				}
			)
		}
	);

}

module.exports = function(route_holder) {
    route_holder['user'] = setup;
};