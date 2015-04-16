/*
 * This deals with the authentication of the user to use the application.
 * Along with registering the security modules that are needed for the application to work.
 */

var db = null;

// This sets up the module ready to use.
function setup(deps) {

	// Get the server module ready to use.
	var server = deps.server;
	
	// Get the database module ready to interface.
	db = deps.database;

	// This registers the module needed for basic authentication.
	server.register(
		require('hapi-auth-basic'), 
		function (err) {

			// This registers the function needed to authenticate.
			server.auth.strategy(
				'simple', 
				'basic', 
				{ 
					validateFunc: validate 
				}
			);
		}
	);

	// This registers the module needed todo cookie sessions with the application.
	server.register(
		require('hapi-auth-cookie'), 
		function (err) {

			// This is the details of the cookie that will be stored.
			server.auth.strategy(
				'session', 
				'cookie', 
				{
					password:   'secret',
					cookie:     'losesono',
					redirectTo: '/login',
					isSecure:    true
				}
			);
		}
	);

	// This is the route that deals with logins for users.
	server.route(
		{
			method: [
				'GET',
				'POST'
			],
			path: '/login',
			config: {
				auth: 'simple',
				plugins: {
					'hapi-auth-cookie': {
						redirectTo: false
					}
				}
			},
			handler: function (request, reply) {

				// Check if the user is authenticated.
				if (request.auth.isAuthenticated) {
					// Get the credentials and save it.
					var account = request.auth.credentials;
					request.auth.session.set(account);
					reply(account);
				} else {
					reply('Error');
				}

			}
		}
	);

	// This clears the session if the user logs out.
	server.route(
		{
			method: 'GET',
			path: '/logout',
			config: {
				auth: 'session'
			},
			handler: function (request, reply) {
				// Clear the session.
				request.auth.session.clear();

				return reply.redirect('/');
			}
		}
	);

	// This forces security on the various routes.

	// This overwrites the get routes function.
	server.getRoute = function(path, callback) {

		server.route(
			{
				method: 'GET',
				path:   path,
				config: {
					auth: 'session'
				},
				handler: function (request, reply) {
					callback(request, reply);
				}
			}
		);
	};

	// This overwrites the post routes function.
	server.postRoute = function(path, callback) {
		server.route(
			{
				method: 'POST',
				path: path,
				config: {
					auth: 'session'
				},
				handler: function (request, reply) {
					callback(request, reply);
				}
			}
		);
	}

}

// This function validates the user and checks if they are in the database.
var validate = function (username, password, callback) {

	// Pass the details to the database.
	db.query(
		"select valid_password(:username, :password)", 
		{ 
			replacements: { 
				username: username,
				password: password
			},
			type: db.QueryTypes.SELECT
		}
	)
	.success(
		function(response) {

			// Get the value of the request to login.
			var isValid = response[0].valid_password;

			console.log(isValid);

			// If it was a valid login.
			if (isValid) {

				// Get the users details for the session from the database.
				db.query(
					"select u.user_id, \n\
							u.first_name, \n\
							u.last_name, \n\
							u.username, \n\
							up.email, \n\
							up.facebook_id \n\
					 from  users u, \n\
						   users_private up \n\
					 where u.user_id = up.user_id \n\
					 and   u.username = :username", 
					{ 
						replacements: { 
							username:  username,
						},
						type: db.QueryTypes.SELECT
					}
				)
				.success(
					function(response) {

						// Pass the valid user details back to the method that called authentication which will then store it in session.

						var user = response[0];

						console.log(JSON.stringify(user));

						callback(null, isValid, user);
					}
				);
			} else {
				callback(null, false, null);
			}
		}
	);
};

exports.setup = setup;
