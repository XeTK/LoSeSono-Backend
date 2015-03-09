
var db = null;

function setup(deps) {

	var server = deps.server;
	
	db = deps.database;

	server.register(
		require('hapi-auth-basic'), 
		function (err) {

			server.auth.strategy(
				'simple', 
				'basic', 
				{ 
					validateFunc: validate 
				}
			);
		}
	);

	server.register(
		require('hapi-auth-cookie'), 
		function (err) {

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

				if (request.auth.isAuthenticated) {
					var account = request.auth.credentials;
					request.auth.session.set(account);
				}

				return reply.redirect('/');
			}
		}
	);

	server.route(
		{
			method: 'GET',
			path: '/logout',
			config: {
				auth: 'session'
			},
			handler: function (request, reply) {
				request.auth.session.clear();

				return reply.redirect('/');
			}
		}
	);

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

var validate = function (username, password, callback) {

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
			var isValid = response[0].valid_password;

			console.log(isValid);

			if (isValid) {

				db.query(
					"select u.user_id, \
							u.first_name, \
							u.last_name, \
							u.username, \
							up.email, \
							up.facebook_id \
					 from  users u, \
						   users_private up \
					 where u.user_id = up.user_id \
					 and   u.username = :username \
					", 
					{ 
						replacements: { 
							username:  username,
						},
						type: db.QueryTypes.SELECT
					}
				)
				.success(
					function(response) {

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
