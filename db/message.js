
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

exports.setup          = setup;
exports.getAllMessages = getAllMessages;
exports.addMessage     = addMessage;