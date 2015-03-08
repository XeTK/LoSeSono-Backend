
function setup(deps) {

	var server = deps.server;

	server.getRoute(
		'/comments/{message_id}',
		function (request, reply) {
		    reply('TODO /comments/{message_id}');
		}
	);

	server.postRoute(
		'/comments/add',
		function (request, reply) {
		    reply('TODO /comments/add');
		}
	);
}

module.exports = function(route_holder) {
    route_holder['comments'] = setup;
};