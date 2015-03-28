
var db = null;

function setup(deps) {
	db = deps.database;
}

function getAllMessages(userID, callback) {

	db.query(
		"SELECT * FROM messages where user_id = :userid", 
		{ 			
			replacements: { 
				userid: userID
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(messages) {
  			callback(messages);
  		}
  	);
}

function getSpecificMessageByID(messageID, callback) {

	db.query(
		"SELECT * FROM messages where message_id = :messageid", 
		{ 			
			replacements: { 
				messageid: messageID
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(messages) {
  			callback(messages[0]);
  		}
  	);
}

function addMessage(request, callback) {

	db.query(
		"select jsoninsert('messages', :jsonstring)", 
		{ 
			replacements: { 
				jsonstring: JSON.stringify(request)
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(response) {

  			db.query(
				"select (currval('messages_message_id_seq'::regclass) -1) message_id;", 
				{ 
					type: db.QueryTypes.SELECT
				}
			)
		  	.success(
		  		function(response) {
		  			callback(response[0]);
		  		}
		  	);		
  		}
  	);
}

function addUser(messageID, friendID, callback) {

	//  group_id | message_id | friends_id | created_date | modified_date | created_by | modified_by 

	db.query(
		"insert into message_friend_group(message_id, friends_id) values (:messageid, :friendid)", 
		{ 
			replacements: { 
				messageid: messageID,
				friendid: friendID
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(response) {

  			db.query(
				"select (currval('message_friend_group_group_id_seq'::regclass)) group_id;", 
				{ 
					type: db.QueryTypes.SELECT
				}
			)
		  	.success(
		  		function(response) {
		  			callback(response[0]);
		  		}
		  	);		
  		}
  	);
}

exports.setup                  = setup;
exports.getAllMessages         = getAllMessages;
exports.getSpecificMessageByID = getSpecificMessageByID;
exports.addMessage             = addMessage;
exports.addUser                = addUser;