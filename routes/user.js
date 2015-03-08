
function setup(deps) {

	var server = deps.server;


	server.getRoute(
		'/user',
		function (request, reply) {
		    reply('TODO /user');
		}
	);

	server.getRoute(
		'/user/{user}',
		function (request, reply) {
		    reply('TODO /user/{user}');
		}
	);

}

module.exports = function(route_holder) {
    route_holder['user'] = setup;
};