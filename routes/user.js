/*
 * This handles users within the application. And gives the rest interface to work with.
 */

// Link to the database functions within the application.
var db = require('../db/user');

// Method to setup the routes needed for the application to work.
function setup(deps) {

	// Get the server object to work on.
	var server = deps.server;

	// Pass the dependencies to the database functions we need to carry out working with users.
	db.setup(deps);

	// Returns the information for the user currently logged in.
	server.getRoute(
		'/user',
		function (request, reply) {
			// Grab the information about the current user from the database.
			db.findUserByID(
				request.auth.credentials.user_id,
				function(data) {
					// Return that record as a JSON object to be used.
					reply(data);
				}
			)
		}
	);

	// This gets the user object for a user_id that is passed via get.
	server.getRoute(
		'/user/id/{user}',
		function (request, reply) {
			// Query the database using the ID that has been passed via the url.
		    db.findUserByID(
				request.params.user,
				function(data) {
					// Return the user object.
					reply(data);
				}
			)
		}
	);

	// Get the user object via the username of a user.
	server.getRoute(
		'/user/username/{user}',
		function (request, reply) {
			// Query the database for the user object using the users username.
		   	db.findUserByUsername(
				request.params.user,
				function(data) {
					// Return the user object.
					reply(data);
				}
			)
		}
	);

}

// Make the module accessible to the route loader.
module.exports = function(route_holder) {
    route_holder['user'] = setup;
};