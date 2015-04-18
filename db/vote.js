var db = null;

function setup(deps) {
	db = deps.database;
}

function addCommentVote(commentID, userID, type, callback) {
	


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
  			callback(true);
  		}
  	);
}

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

function getCommentVotes(commentID, callback) {

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
  			callback(response);
  		}
  	);
}


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


exports.setup           = setup;
exports.addCommentVote  = addCommentVote;
exports.addMessageVote  = addMessageVote;
exports.getCommentVotes = getCommentVotes;
exports.getMessageVotes = getMessageVotes;