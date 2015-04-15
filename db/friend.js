/*
 * This class deals with friends functionality within the application.
 * It deals with interfacing with the getting the friends list for the user
 */

var db = null;

// Get the dependencies for the application, the database connection is passed around between the different bits of the applications.
function setup(deps) {
	db = deps.database;
}

// This method queries the database for all of the friends for the current user. It returns a list of the user_id's for the given user.
function listFriendsByUserID(userID, callback) {

	// Query the database for all of friends for the current user.
	db.query(
		"select * from friends where user_id = :userid", 
		{ 
			replacements: { 
				userid: userID
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(response) {
  			// Pass the rows back to the previous method, to be dealt with.
  			callback(response);
  		}
  	);
}

// This adds a new friend to a given user. It uses the user_id's todo this.
function addFriend(userID, friendID, callback) {

	// We pass the parameters to a database function via a select statement.
	db.query(
		"select add_friend(:userid, :friendid)", 
		{ 
			replacements: { 
				userid:   userID,
				friendid: friendID
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(response) {
  			// Return the status back to the previous method.
  			callback(response);
  		}
  	);
}

// Make the functions we need to be public public.
exports.setup               = setup;
exports.listFriendsByUserID = listFriendsByUserID;
exports.addFriend           = addFriend;