
function setup(deps) {

	var server = deps.server;

	server.getRoute(
		'/vote/{type}/{id}',
		function (request, reply) {
		    reply('TODO /vote/{type}/{id}');
		}
	);

	server.postRoute(
		'/vote/{type}/add',
		 function (request, reply) {
		    reply('TODO /vote/{type}/add');
		}
	);
}

module.exports = function(route_holder) {
    route_holder['vote'] = setup;
};
