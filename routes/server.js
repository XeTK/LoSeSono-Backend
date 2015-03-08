
function setup(deps) {

	var server = deps.server;


	server.route(
		{
		    method: 'GET',
		    path: '/register',
		    handler: function (request, reply) {
		        reply('TODO /register');
		    }
		}
	);

}

module.exports = function(route_holder) {
    route_holder['server'] = setup;
};