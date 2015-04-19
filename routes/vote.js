
var db = require('../db/vote');

/* This transposes the information that is taken in from the database.
 * 
 *	This:
 *  [{"type": "positive", "count": "1"}, {"type": "negative", "count": "1"}]
 *
 *  To:
 *  {"positive": 1, "negative": 1}
 *
 * This makes it easier to work with inside the android application.
 */
function trans(response) {

	// Setup a empty object we can use to add things to.
	var trans = {}

	// If the response is empty then we don't do any conversion.
	if (response.length > 0) {
		// Get the first JSON object in the array to work with.
		var obj1 = response[0];

		// Convert the count from a string to a number.
		var count = Number(obj1.count)

		// If the type is positive then we need to get the right keys.
		if (obj1.vote_type == 'positive') {
			// So we add a key for positive.
			trans['positive'] = count;
		} else {
			trans['negative'] = count;
		}

		// If there is two JSON objects then we process the second one.
		if (response.length > 1) {
			// Get the JSON object from the array to make it easier to work on.
			var obj2 = response[1];

			// Do the same again and convert the count to a number so that its easier to work with.
			count = Number(obj2.count)

			// We check the types so we get the correct keys. For the objects.
			if (obj2.vote_type == 'positive') {
				trans['positive'] = count;
			} else {
				trans['negative'] = count;
			}
		}
	}

	// If the object is missing a property that we need then we add it on.
	if (!trans.hasOwnProperty('positive')) {
		trans['positive'] = 0;
	}

	// Same again for the other one.
	if (!trans.hasOwnProperty('negative')) {
		trans['negative'] = 0;
	}

	// Return the transposed object.
	return trans;
}

// The method that is run when the module is loaded.
function setup(deps) {

	// Get the server module so we can add more routes.
	var server = deps.server;

	// Pass the dependencies to the database so we can setup the database ready to use.
	db.setup(deps);

	// This is the route for getting votes for a either a message or a comment.
	server.getRoute(
		'/vote/{type}/{id}',
		function (request, reply) {

			// Get the parameters we need to proceed.
			var voteType = request.params.type;
			var id       = Number(request.params.id);

			// Workout if we are dealing with a message or a comment, so we can work with the right db methods.
		    if (voteType == 'comment') {

		    	// Call the database to get the votes related to comments.
		    	db.getCommentVotes(
					id,
					function(response) {
						// Return the transposed data.
						reply(trans(response));
					}
				);

			} else if (voteType == 'message') {
				// Do the same for messages.
				db.getMessageVotes(
					id,
					function(response) {
						reply(trans(response));
					}
				);
			}
		}
	);

	// This is adding a vote to either a message or comment.
	server.postRoute(
		'/vote/{type}/add',
		function (request, reply) {

			// Get the user id for the currently logged in from the session so we can use it in adding the vote.
			var userID = Number(request.auth.credentials.user_id);
		    
		   	// Get the vote type so either comment or message.
			var voteType = request.params.type;

			// Get the post parameter for the important information.
			var payload = request.payload;

			// Get the type of feedback either positive or negative.
			var type = payload.type;
			var id   = Number(payload.id);

			// This is the type of vote we are dealing with either a message or a comment vote.
			if (voteType == 'comment') {

				// Add a vote for comments.
				db.addCommentVote(
					id,
					userID,
					type,
					function(response) {
						// Return that we have proceed successfully.
						reply({"status":"successful"});
					}
				);

			// This is if we are dealing with messages.
			} else if (voteType == 'message') {

				// Add a vote for messages.
				db.addMessageVote(
					id,
					userID,
					type,
					function(response) {
						reply({"status":"successful"});
					}
				);
			}
		}
	);
}

// This makes the class accessible to the dynamic route loader. So it can be loaded on load of the application.
module.exports = function(route_holder) {
    route_holder['vote'] = setup;
};
