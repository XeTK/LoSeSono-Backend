
var db = require('../db/message');

function setup(deps) {

	var server = deps.server;

	db.setup(deps);

	server.getRoute(
		'/messages/user',
		function (request, reply) {

			var userID = Number(request.auth.credentials.user_id);

	    	db.getAllMessagesCurUser(
	    		userID,
				function(messages) {

					console.log('Messages User response: ' + JSON.stringify(messages));
					
	    			reply(messages);
				}
			);
	    }
	);

	server.getRoute(
		'/messages/friends',
		function (request, reply) {

			var userID = Number(request.auth.credentials.user_id);

	    	db.getAllMessagesFriends(
	    		userID,
				function(messages) {

					console.log('Messages Friends response: ' + JSON.stringify(messages));
					
	    			reply(messages);
				}
			);
	    }
	);

	server.getRoute(
		'/messages/notifications',
		function (request, reply) {

			var userID = Number(request.auth.credentials.user_id);

	    	db.getAllMessagesNotifications(
	    		userID,
				function(messages) {

					console.log('Messages Friends response: ' + JSON.stringify(messages));
					
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
		'/message/add/user',
		function (request, reply) {

			var payload = request.payload;

			console.log(JSON.stringify(payload));

	    	db.addUser(
	    		payload.message_id,
	    		payload.friend_id,
	    		function(response) {
	    			console.log('Response: ' + JSON.stringify(response));
	    			reply(response);
	    		}
	    	);
	    }
	);

	server.postRoute(
		'/message/add/message',
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

	server.postRoute(
		'/message/read',
		function (request, reply) {

			var messageID = request.payload.message_id;

			var userID = request.auth.credentials.user_id;

	    	db.addReadMessage(
	    		messageID,
	    		userID,
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