/*
 * This module handles rest requests for messages.
 */

var db = require('../db/message');

// Setup the routes needed to service the REST interfaces.
function setup(deps) {

	// Get the server object to manipulate.
	var server = deps.server;

	// Pass the dependencies to the database ready to use.
	db.setup(deps);

	// Setup the route to get the messages for the current user.
	server.getRoute(
		'/messages/user',
		function (request, reply) {

			// Get the user_id for the current user from the session.
			var userID = Number(request.auth.credentials.user_id);

	    	db.getAllMessagesCurUser(
	    		userID,
				function(messages) {

					console.log('Messages User response: ' + JSON.stringify(messages));
					// Return a JSON object with all of the message objects for the current user.
	    			reply(messages);
				}
			);
	    }
	);

	// Method to return all the messages for the current user left by there friends.
	server.getRoute(
		'/messages/friends',
		function (request, reply) {

			// Get the user_id for the current user from the session.
			var userID = Number(request.auth.credentials.user_id);

			// Get the messages from the database, pass the user_id to the database.
	    	db.getAllMessagesFriends(
	    		userID,
				function(messages) {

					console.log('Messages Friends response: ' + JSON.stringify(messages));
					
					// Return a JSON object with all the messages for that given user.
	    			reply(messages);
				}
			);
	    }
	);

	// Get all the valid notifications for the current user.
	server.getRoute(
		'/messages/notifications',
		function (request, reply) {

			// Get the user_id for the current user from the session.
			var userID = Number(request.auth.credentials.user_id);

			// Get all the valid messages from the database.
	    	db.getAllMessagesNotifications(
	    		userID,
				function(messages) {

					console.log('Messages Friends response: ' + JSON.stringify(messages));
					
					// Return a JSON object with all the messages relevant to the current user.
	    			reply(messages);
				}
			);
	    }
	);

	// This returns a specific message from a given message_id.
	server.getRoute(
		'/message/{id}',
		function (request, reply) {

			// This gets a message from a ID that is passed via the URL.
			var msgID = request.params.id;

			// Get the specific message object from the database, via passing the message_id to the database.
		    db.getSpecificMessageByID(
		    	msgID,
		    	function(message) {
		    		console.log('Message: ' + JSON.stringify(message));
		    		// Return the specific message as a JSON object that can be used.
		    		reply(message);
		    	}
		    );
		}
	);

	// Gives the ability to add users to specific messages giving viability only to them.
	server.postRoute(
		'/message/add/user',
		function (request, reply) {

			// Get all of the items passed as payload parameters.
			var payload = request.payload;

			console.log(JSON.stringify(payload));

			// Call the database function to add the user to the message.
	    	db.addUser(
	    		payload.message_id,
	    		payload.friend_id,
	    		function(response) {
	    			console.log('Response: ' + JSON.stringify(response));
	    			// Return the status of that action via a JSON object.
	    			reply(response);
	    		}
	    	);
	    }
	);

	// This adds a new message to the database.
	server.postRoute(
		'/message/add/message',
		function (request, reply) {

			// Gets the parameters that was passed via POST.
			var payload = request.payload;

			// Add on the user_id for the current user from the session to the list of parameters.
			payload['user_id'] = request.auth.credentials.user_id;

			console.log(JSON.stringify(payload));

			// Add the message into the database. Pass the payload, so we can insert it via JSON inserter.
	    	db.addMessage(
	    		payload,
	    		function(response) {
	    			console.log('Response: ' + JSON.stringify(response));
	    			// Send the status back via JSON to the user.
	    			reply(response);
	    		}
	    	);
	    }
	);

	// This route allows tracking of read messages. So they don't show up after they have been read.
	server.postRoute(
		'/message/read',
		function (request, reply) {

			// Get the read message_id from the POST payload.
			var messageID = request.payload.message_id;

			// Get the user_id from the users session.
			var userID = request.auth.credentials.user_id;

			// Pass those details to the database to be added into the table.
	    	db.addReadMessage(
	    		messageID,
	    		userID,
	    		function(response) {
	    			console.log('Response: ' + JSON.stringify(response));
	    			// Return the status.
	    			reply(response);
	    		}
	    	);
	    }
	);
}

// Make the module loadable from the routeloader.
module.exports = function(route_holder) {
    route_holder['message'] = setup;
};