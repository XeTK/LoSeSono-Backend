
var db = null;

// Get the dependencies for the application, the database connection is passed around between the different bits of the applications.
function setup(deps) {
	db = deps.database;
}

function registerUser(userDetails, callback) {

	// select insert_user('Tom','Rosier','XeTK','tom.rosier93@gmail.com1','password');

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
  			callback(response);
  		}
  	);
}

exports.setup        = setup;
exports.registerUser = registerUser;