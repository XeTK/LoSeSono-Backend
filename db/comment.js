var db = null;

function setup(deps) {
	db = deps.database;
}

function addComment(msgID, userID, comment, callback) {
	
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
  			callback(true);
  		}
  	);
}

function getComments(msgID, callback) {

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
  			callback(response);
  		}
  	);
}

exports.setup       = setup;
exports.addComment  = addComment;
exports.getComments = getComments;