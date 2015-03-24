
var db = null;

function setup(deps) {
	db = deps.database;
}

function listFriendsByUserID(userID, callback) {

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
  			callback(response);
  		}
  	);
}

function addFriend(userID, friendID, callback) {
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
  			callback(response);
  		}
  	);
}

exports.setup               = setup;
exports.listFriendsByUserID = listFriendsByUserID;
exports.addFriend           = addFriend;