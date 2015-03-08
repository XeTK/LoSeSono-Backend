
var db = require('../db/message');

function setup(deps) {

	var server = deps.server;

	db.setup(deps);

	server.getRoute(
		'/messages',
		function (request, reply) {
	    	db.getAllMessages(
				function(messages) {
					console.log('getAllMessages response: ' +JSON.stringify(messages));

	    			reply(messages);
				}
			);
	    }
	);

	server.getRoute(
		'/message/{id}',
		function (request, reply) {
		    reply('TODO /message/{id}');
		}
	);

	server.postRoute(
		'/message/add',
		function (request, reply) {
	    	db.addMessage(
	    		request.payload,
	    		function(response) {
	    			reply({"status":"successful"});
	    		}
	    	);
	    }
	);

}

module.exports = function(route_holder) {
    route_holder['message'] = setup;
};