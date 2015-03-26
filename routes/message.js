
var db = require('../db/message');

function setup(deps) {

	var server = deps.server;

	db.setup(deps);

	server.getRoute(
		'/messages',
		function (request, reply) {

			var userID = Number(request.auth.credentials.user_id);

	    	db.getAllMessages(
	    		userID,
				function(messages) {

					console.log('getAllMessages response: ' + JSON.stringify(messages));
					
	    			reply(messages);
				}
			);
	    }
	);

	server.getRoute(
		'/message/{id}',
		function (request, reply) {

			var msgID = request.params.id;

		    db.getSpecificMessageByID(
		    	msgID,
		    	function(message) {
		    		console.log('Message: ' + JSON.stringify(message));
		    		reply(message);
		    	}
		    );
		}
	);

	server.postRoute(
		'/message/add',
		function (request, reply) {

			var payload = request.payload;

			payload['user_id'] = request.auth.credentials.user_id;

			console.log(JSON.stringify(payload));

	    	db.addMessage(
	    		payload,
	    		function(response) {
	    			console.log('Response: ' + JSON.stringify(response));
	    			reply(response);
	    		}
	    	);
	    }
	);

}

module.exports = function(route_holder) {
    route_holder['message'] = setup;
};