
var db = null;

function setup(deps) {
	db = deps.database;
}

function getAllMessages(callback) {

	db.query(
		"SELECT * FROM messages", 
		{ 
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
  			callback(response);
  		}
  	);
}

exports.setup          = setup;
exports.getAllMessages = getAllMessages;
exports.addMessage     = addMessage;