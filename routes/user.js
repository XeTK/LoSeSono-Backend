
function setup(deps) {

	var server = deps.server;


	server.route(
		{
		    method: 'GET',
		    path: '/user',
		    handler: function (request, reply) {
		        reply('TODO /user');
		    }
		}
	);

	server.route(
		{
		    method: 'GET',
		    path: '/user/{user}',
		    handler: function (request, reply) {
		        reply('TODO /user/{user}');
		    }
		}
	);

}

module.exports = function(route_holder) {
    route_holder['user'] = setup;
};