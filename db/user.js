
var db = null;

// Get the dependencies for the application, the database connection is passed around between the different bits of the applications.
function setup(deps) {
	db = deps.database;
}

// Grab the info about a user by the user_id.
function findUserByID(userID, callback) {

	// Find the user with that id within the database.
	db.query(
		"select * from users where user_id = :userid", 
		{ 
			replacements: { 
				userid: userID
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(response) {
  			// Return the info on that user to the method that called it.
  			callback(response);
  		}
  	);
}

// Find a user by there username rather than user_id and get the information on them.
function findUserByUsername(userName, callback) {

	// Query the database with the username that has been passed to the method.
	db.query(
		"select * from users where username = :username", 
		{ 
			replacements: { 
				username: userName
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(response) {
  			// Pass the users info back to the method that called the database function.
  			callback(response);
  		}
  	);
}

// Make the methods we need to be public public.
exports.setup              = setup;
exports.findUserByID       = findUserByID;
exports.findUserByUsername = findUserByUsername;