
function setup(deps) {

	var server = deps.server;

	server.route(
		{
		    method: 'GET',
		    path: '/login',
		    handler: function (request, reply) {
		        reply('TODO /login');
		    }
		}
	);

	server.route(
		{
		    method: 'GET',
		    path: '/logout',
		    handler: function (request, reply) {
		        reply('TODO /logout');
		    }
		}
	);

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