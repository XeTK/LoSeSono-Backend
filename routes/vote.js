
function setup(deps) {
	
	var server = deps.server;

	server.route(
		{
		    method: 'GET',
		    path: '/vote/{type}/{id}',
		    handler: function (request, reply) {
		        reply('TODO /vote/{type}/{id}');
		    }
		}
	);

	server.route(
		{
		    method: 'POST',
		    path: '/vote/{type}/add',
		    handler: function (request, reply) {
		        reply('TODO /vote/{type}/add');
		    }
		}
	);
}

exports.setup = setup;