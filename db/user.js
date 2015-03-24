
var db = null;

function setup(deps) {
	db = deps.database;
}

function findUserByID(userID, callback) {

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
  			callback(response);
  		}
  	);
}

function findUserByUsername(userName, callback) {

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
  			callback(response);
  		}
  	);
}

exports.setup              = setup;
exports.findUserByID       = findUserByID;
exports.findUserByUsername = findUserByUsername;