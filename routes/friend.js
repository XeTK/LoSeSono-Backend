
function setup(deps) {

	var server = deps.server;

	server.getRoute(
		'/friends',
		function (request, reply) {
		    reply('TODO /friends');
		}
	);

	server.postRoute(
		'/friend/add',
		unction (request, reply) {
	        reply('TODO /friend/add');
	    }
	);
	

	server.postRoute(
		'/friend/remove',
		function (request, reply) {
	        reply('TODO /friend/remove');
	    }
	);

}

module.exports = function(route_holder) {
    route_holder['friend'] = setup;
};