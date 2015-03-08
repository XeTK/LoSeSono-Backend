
function setup(deps) {

	var server = deps.server;

	server.route(
		{
		    method: 'GET',
		    path: '/friends',
		    handler: function (request, reply) {
		        reply('TODO /friends');
		    }
		}
	);

	server.route(
		{
		    method: 'POST',
		    path: '/friend/add',
		    handler: function (request, reply) {
		        reply('TODO /friend/add');
		    }
		}
	);
	

	server.route(
		{
		    method: 'POST',
		    path: '/friend/remove',
		    handler: function (request, reply) {
		        reply('TODO /friend/remove');
		    }
		}
	);

}

module.exports = function(route_holder) {
    route_holder['friend'] = setup;
};