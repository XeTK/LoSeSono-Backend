var db = null;

// This sets up the connections before we use the class.
function setup(deps) {
	db = deps.database;
}

// This injects the values into the database to leave a comment on a message.
function addComment(msgID, userID, comment, callback) {
	
	// This is the direct SQL statement that is used to insert into the database.
	db.query(
		"insert into comments(message_id, user_id, content) \n\
		 values (:msgid, :userid, :content)", 
		{ 
			replacements: { 
				msgid   : msgID,
				userid  : userID,
				content : comment
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(response) {
  			// If we are successful then return the status that we did do that thing correctly.
  			callback(true);
  		}
  	);
}

// This is for getting all the comments tied to a message.
function getComments(msgID, callback) {

    // Raw SQL statement to get the information from the server that we need for comments to work in the client side.
	db.query(
		"select comment_id, \n\
		       message_id, \n\
		       user_id, \n\
		       content, \n\
		       created_date \n\
		from   comments \n\
		where  message_id = :msgid", 
		{ 
			replacements: { 
				msgid : msgID
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(response) {
  			// Return the list of JSON objects to the function that called this method.
  			callback(response);
  		}
  	);
}

// Return the method we want to be public to work with.
exports.setup       = setup;
exports.addComment  = addComment;
exports.getComments = getComments;