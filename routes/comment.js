
var db = require('../db/comment');

// This is the method that gets called when the module has been loaded.
function setup(deps) {

	// Get the server from the dependencies so we can use it.
	var server = deps.server;

	// Pass the list of dependencies to the database functions to setup the database connection.
	db.setup(deps);

	// Setup the route for getting comments by the message id. It should return a list of comments that are tied to the message.
	server.getRoute(
		'/comments/{message_id}',
		function (request, reply) {

			// Extract the message ID from the parameters that have been given.
			var msgID = request.params.message_id;

			// Call the database to get all the comments from the database.
		    db.getComments(
		    	msgID,
		    	function(response) {
		    		//console.log(JSON.Stringify(response));
		    		// Return the list of comments that we just got from the database.
		    		reply(response);
		    	}
		    );
		}
	);

	// This is for adding new comments to a message.
	server.postRoute(
		'/comments/add',
		function (request, reply) {

			// Get the payload with all the details that we want in.
			var payload = request.payload;

			// Get the user_id from the session as we only want to add messages as the user that is currently logged in.
			var userID  = request.auth.credentials.user_id;

			// Get the message_id of the message we want to pin the comment to along with the comment we want to add to the message.
			var msgID   = payload.message_id;
			var comment = payload.comment;

			// This calls the db and passes the information we need to add the comment to the message.
			db.addComment(
				msgID,
				userID,
				comment,
				function(response) {
					// Return that the job returned successfully.
					reply({'status':'success'});
				}
			);
		}
	);
}

// Make the method accessible to the module loader, for dynamic route loading.
module.exports = function(route_holder) {
    route_holder['comments'] = setup;
};