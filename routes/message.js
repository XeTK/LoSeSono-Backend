
function setup(server) {

	server.route(
		{
		    method: 'GET',
		    path: '/messages',
		    handler: function (request, reply) {
		        reply('TODO /messages');
		    }
		}
	);

	server.route(
		{
		    method: 'GET',
		    path: '/message/{id}',
		    handler: function (request, reply) {
		        reply('TODO /message/{id}');
		    }
		}
	);

	server.route(
		{
		    method: 'POST',
		    path: '/message/add',
		    handler: function (request, reply) {
		        reply('TODO /message/add');
		    }
		}
	);
}

exports.setup = setup;