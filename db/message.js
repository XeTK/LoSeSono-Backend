/*
 * This class handles all the interaction between messages in the database and applications.
 */

var db = null;

// Get the dependencies for the application, the database connection is passed around between the different bits of the applications.
function setup(deps) {
	db = deps.database;
}

// Get all the messages created by the current user. 
function getAllMessagesCurUser(userID, callback) {

	// Select all the records tied to the current user.
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
  			// Return JSON object with all the messages back to the user.
  			callback(messages);
  		}
  	);
}

// Get all the messages from the friends of the current user.
function getAllMessagesFriends(userID, callback) {

	// Select all the relevant information tied to the user. And the messages that have been left for them.
	db.query(
		"select msg.* \n\
		from   messages             msg, \n\
		       message_friend_group mfg, \n\
		       friends              fri \n\
		where  msg.message_id     = mfg.message_id \n\
		and    mfg.friends_id     = fri.friends_id \n\
		and    fri.friend_user_id = :userid", 
		{ 			
			replacements: { 
				userid: userID
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(messages) {
  			// Return all of the messages to the method that called the function that calls the database.
  			callback(messages);
  		}
  	);
}

// This returns all of the messages that have not already been read, this is important for notifications.
function getAllMessagesNotifications(userID, callback) {

	// Costly query that returns the notifications for all of the messages that have not been read for the user.
	db.query(
		"select msg.* \n\
		from    messages             msg, \n\
				message_friend_group mfg, \n\
				friends              fri \n\
		where  msg.message_id     = mfg.message_id \n\
		and    mfg.friends_id     = fri.friends_id \n\
		and    not exists ( \n\
		           select * \n\
		           from   read_messages rm \n\
		           where  rm.message_id = mfg.message_id \n\
		           and    rm.user_id    = fri.friends_id \n\
		    )  \n\
		and    fri.friend_user_id = :userid", 
		{ 			
			replacements: { 
				userid: userID
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(messages) {
  			// Give all the notifications back to the method that called it.
  			callback(messages);
  		}
  	);
}

// Get message by message_id.
function getSpecificMessageByID(messageID, callback) {

	// Retrieve the message using its ID.
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
  			// Return only the current message to the application.
  			callback(messages[0]);
  		}
  	);
}

// This adds a new message into the database.
function addMessage(request, callback) {

	// It directly converts the JSON request into a record in the database.
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

  			// Find the ID of the record we just inserted into into the database.
  			db.query(
				"select (currval('messages_message_id_seq'::regclass) -1) message_id;", 
				{ 
					type: db.QueryTypes.SELECT
				}
			)
		  	.success(
		  		function(response) {
		  			// Return that back to the function that called it.
		  			callback(response[0]);
		  		}
		  	);		
  		}
  	);
}

// This adds users to messages so they can view them.
function addUser(messageID, friendID, callback) {

	//  group_id | message_id | friends_id | created_date | modified_date | created_by | modified_by 

	// This adds the user to the message that we just created.
	db.query(
		"insert into message_friend_group(message_id, friends_user_id) values (:messageid, :friendid)", 
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

  			// Get the group id for the link we just created.
  			db.query(
				"select (currval('message_friend_group_group_id_seq'::regclass)) group_id;", 
				{ 
					type: db.QueryTypes.SELECT
				}
			)
		  	.success(
		  		function(response) {
		  			// Return it to the method that called it.
		  			callback(response[0]);
		  		}
		  	);		
  		}
  	);
}

// This function marks a messages as read.
function addReadMessage(messageID, userID, callback) {

	// This inserts a flag into the database to say the message has been read.
	db.query(
		"insert into read_messages(message_id, user_id) values (:messageid, :userid)", 
		{ 
			replacements: { 
				messageid: messageID,
				userid: userID
			},
			type: db.QueryTypes.SELECT
		}
	)
  	.success(
  		function(response) {

  			// Get the id of the message that has been read.
  			db.query(
				"select (currval('read_messages_read_id_seq'::regclass)) group_id;", 
				{ 
					type: db.QueryTypes.SELECT
				}
			)
		  	.success(
		  		function(response) {
		  			// Return it back to the method that called the database function.
		  			callback(response[0]);
		  		}
		  	);		
  		}
  	);
}

// Make the methods public that need to be public.
exports.setup                       = setup;
exports.getAllMessagesCurUser       = getAllMessagesCurUser;
exports.getAllMessagesFriends       = getAllMessagesFriends;
exports.getAllMessagesNotifications = getAllMessagesNotifications;
exports.getSpecificMessageByID      = getSpecificMessageByID;
exports.addMessage                  = addMessage;
exports.addUser                     = addUser;
exports.addReadMessage              = addReadMessage;