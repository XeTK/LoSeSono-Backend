
function setup(deps) {

	var server = deps.server;

	server.postRoute(
		'/register',
		function (request, reply) {
		    reply('TODO /register');
		}
	);

}

module.exports = function(route_holder) {
    route_holder['server'] = setup;
};