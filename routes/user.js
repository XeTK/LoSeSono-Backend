
function setup(server) {

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

exports.setup = setup;