/* 
 * This class handles the server related functions over rest.
 */

var db = require('../db/server');

// Setup this class ready to be used.
function setup(deps) {

	// Get the server ready to be interacted with.
	var server = deps.server;

	// Setup the database ready to be used by this module.
	db.setup(deps);

	// Setup the route that allows new users to be registered.
	server.route(
		{
			method: 'POST',
			path: '/register',
			handler: function (request, reply) {

				// Get the parameters that have been attached to the request.
				var params = request.payload;
			   	
			   	// Get the values from the parameters. And make them easy to access.
			   	var firstName = params.firstname;
			   	var lastName  = params.lastname;
			   	var userName  = params.username;
			   	var email     = params.email;
			   	var password  = params.password;

			   	// Check that all of the fields contain something and arn't null.
			   	if (!firstName || !lastName || !userName || !email || !password) {
			   		reply({"status":"failed"});
			   	} else {

			   		// Create a JSON object with the user info contained within it.
			   		var user = {
			   			"firstname" : firstName,
			   			"lastname"  : lastName,
			   			"username"  : userName,
			   			"email"     : email,
			   			"password"  : password
			   		};

			   		// Pass the JSON object to the database handler to be put into the database.
			   		db.registerUser(
			   			user, 
			   			function(response) {
			   				// Return the status of registering the user.
			   				reply(response);

							/*'New user created!';

							'Email already in use';

							'Username Taken';
							*/
			   			}
			   		);
			   	}
			}
		}
	);

}

// Make this route accessible to the dynamic loader.
module.exports = function(route_holder) {
    route_holder['server'] = setup;
};