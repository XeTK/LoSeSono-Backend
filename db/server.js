/* 
 * This class is class contains all global functions thats are important to server usage.
 */

var db = null;

// Get the dependencies for the application, the database connection is passed around between the different bits of the applications.
function setup(deps) {
	db = deps.database;
}

// This function adds new users into the database.
function registerUser(userDetails, callback) {

	// select insert_user('Tom','Rosier','XeTK','tom.rosier93@gmail.com1','password');

	// Pass the parameters needed to create a user within the application.
	db.query(
		"select insert_user(:firstname, :lastname, :username, :email, :password)", 
		{ 
			replacements: { 
				firstname: userDetails.firstname,
				lastname:  userDetails.lastname,
				username:  userDetails.username,
				email:     userDetails.email,
				password:  userDetails.password
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(response) {
  			// Pass back the status to the application.
  			callback(response);
  		}
  	);
}

// Export functions that need to be public.
exports.setup        = setup;
exports.registerUser = registerUser;