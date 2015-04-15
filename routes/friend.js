/*
 * This class handles the rest interface for friends. It links the end points to the database.
 */

// Require the use of the database, so we call the module dedicated to handing friends database transactions.
var db = require('../db/friend');

function setup(deps) {

	// Grab the dependencies for the application,
	var server = deps.server;

	// Pass the dependencies to the database module we are using.
	db.setup(deps);

	// Setup one of the routes for getting the list of friends for the user.
	server.getRoute(
		'/friends',
		function (request, reply) {

			// Get the users id from the stored credentials that were used to login the user and keep a session.
			var userID = request.auth.credentials.user_id;
		    
		    // Get all of the users friends from the database.
			db.listFriendsByUserID(
				userID,
				function(data) {
					// Return the JSON object via the rest interface.
					reply(data);
				}
			)
		}
	);

	// This is the route for adding friends via post.
	server.postRoute(
		'/friend/add',
		function (request, reply) {

			// Get the userID from the stored session for the user, and get the friendsID from the payload added to the request.
			var userID   = Number(request.auth.credentials.user_id);
			var friendID = Number(request.payload.friend_id);

			// Pass the information to the database to add the friend link in place.
			db.addFriend(
				userID,
				friendID,
				function(data) {
					console.log(JSON.stringify(data));
					// Confirm that the request has carried out successfully.
					reply('success');
				}
			);

	    }
	);
	

	server.postRoute(
		'/friend/remove',
		function (request, reply) {
	        reply('TODO /friend/remove');
	    }
	);

}

// Make the function class usable and have the ability to be dynamically loaded.
module.exports = function(route_holder) {
    route_holder['friend'] = setup;
};