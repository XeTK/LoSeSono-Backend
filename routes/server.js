
var db = require('../db/server');

function setup(deps) {

	var server = deps.server;

	db.setup(deps);

	server.postRoute(
		'/register',
		function (request, reply) {
			var params = request.payload;
		   	
		   	var firstName = params.firstname;
		   	var lastName  = params.lastname;
		   	var userName  = params.username;
		   	var email     = params.email;
		   	var password  = params.password;

		   	if (!firstName || !lastName || !userName || !email || !password) {
		   		reply({"status":"failed"});
		   	} else {

		   		var user = {
		   			"firstname" : firstName,
		   			"lastname"  : lastName,
		   			"username"  : userName,
		   			"email"     : email,
		   			"password"  : password
		   		};

		   		db.registerUser(
		   			user, 
		   			function(response) {

		   				reply(response);

/*'New user created!';

'Email already in use';

'Username Taken';
*/
		   			}
		   		);

		   	}
		}
	);

}

module.exports = function(route_holder) {
    route_holder['server'] = setup;
};