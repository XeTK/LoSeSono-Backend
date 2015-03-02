
function setup(server) {

	server.route(
		{
		    method: 'GET',
		    path: '/comments/{message_id}',
		    handler: function (request, reply) {
		        reply('TODO /comments/{message_id}');
		    }
		}
	);

	server.route(
		{
		    method: 'POST',
		    path: '/comments/add',
		    handler: function (request, reply) {
		        reply('TODO /comments/add');
		    }
		}
	);
}

exports.setup = setup;