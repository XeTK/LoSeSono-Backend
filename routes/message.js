
var db = require('../db/message');

function setup(deps) {

	var server = deps.server;

	db.setup(deps);

	server.route(
		{
		    method: 'GET',
		    path: '/messages',
		    handler: function (request, reply) {
		    	db.getAllMessages(
					function(messages) {
						console.log('getAllMessages response: ' +JSON.stringify(messages));

		    			reply(messages);
					}
				);
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
		    	db.addMessage(
		    		request.payload,
		    		function(response) {
		    			reply({"status":"successful"});
		    		}
		    	);
		    }
		}
	);
}

exports.setup = setup;