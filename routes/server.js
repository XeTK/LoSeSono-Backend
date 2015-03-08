
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

exports.setup = setup;