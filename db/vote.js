var db = null;

// Setup the dependencies when we start the class so we are ready to receive requests.
function setup(deps) {
	db = deps.database;
}

// This adds a vote to a comment, using the userid and the comment id to attach to.
function addCommentVote(commentID, userID, type, callback) {
	

	// Raw query to insert the vote for the comment, works for either positive or negative.
	db.query(
		"insert into comments_votes(comment_id, user_id, vote_type) \n\
		 values(:commentid, :userid, :type)", 
		{ 
			replacements: { 
				commentid : commentID,
				userid    : userID,
				type      : type
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(response) {
  			console.log(JSON.stringify(response));
  			// Return that we succeed with the request.
  			callback(true);
  		}
  	);
}

// This does the same as the method above just for the messages instead of comments.
function addMessageVote(msgID, userID, type, callback) {
	
	db.query(
		"insert into message_votes(message_id, user_id, vote_type) \n\
		 values(:msgid, :userid, :type)", 
		{ 
			replacements: { 
				msgid  : msgID,
				userid : userID,
				type   : type
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(response) {
  			console.log(JSON.stringify(response));
  			callback(true);
  		}
  	);
}

// This counts how many types of each vote has been placed on a comment.
function getCommentVotes(commentID, callback) {

	// Clever SQL statement that counts the number of each type of vote and groups them to do the the vote_types. 
	db.query(
		"select count(comment_vote_id), vote_type \n\
		from   comments_votes \n\
		where  comment_id = :commentid \n\
		group by vote_type", 
		{ 
			replacements: { 
				commentid : commentID
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(response) {
  			// Pass that object with the values in back to the method that called the method.
  			callback(response);
  		}
  	);
}

// Do the same again as the method above just for messages rather than comments.
function getMessageVotes(msgID, callback) {

	db.query(
		"select count(message_vote_id), vote_type \n\
		from   message_votes \n\
		where  message_id = :msgid \n\
		group by vote_type", 
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

// Make the methods public so they can be used from other modules.
exports.setup           = setup;
exports.addCommentVote  = addCommentVote;
exports.addMessageVote  = addMessageVote;
exports.getCommentVotes = getCommentVotes;
exports.getMessageVotes = getMessageVotes;