
function setup(deps) {

	var server = deps.server;

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

module.exports = function(route_holder) {
    route_holder['comments'] = setup;
};