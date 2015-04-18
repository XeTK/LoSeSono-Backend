
var db = require('../db/vote');

function trans(response) {

	var trans = {}

	if (response.length > 0) {
		var obj1 = response[0];

		var count = Number(obj1.count)

		if (obj1.vote_type == 'positive') {
			trans['positive'] = count;
		} else {
			trans['negative'] = count;
		}

		if (response.length > 1) {
			var obj2 = response[1];

			count = Number(obj2.count)

			if (obj2.vote_type == 'positive') {
				trans['positive'] = count;
			} else {
				trans['negative'] = count;
			}
		}
	}

	if (!trans.hasOwnProperty('positive')) {
		trans['positive'] = 0;
	}

	if (!trans.hasOwnProperty('negative')) {
		trans['negative'] = 0;
	}

	return trans;
}

function setup(deps) {

	var server = deps.server;

	db.setup(deps);

	server.getRoute(
		'/vote/{type}/{id}',
		function (request, reply) {

			var voteType = request.params.type;
			var id       = Number(request.params.id);

		    if (voteType == 'comment') {

		    	db.getCommentVotes(
					id,
					function(response) {
						reply(trans(response));
					}
				);

			} else if (voteType == 'message') {
				db.getMessageVotes(
					id,
					function(response) {
						reply(trans(response));
					}
				);
			}
		}
	);

	server.postRoute(
		'/vote/{type}/add',
		function (request, reply) {

			var userID = Number(request.auth.credentials.user_id);
		    
			var voteType = request.params.type;

			var payload = request.payload;

			var type = payload.type;
			var id   = Number(payload.id);

			if (voteType == 'comment') {

				db.addCommentVote(
					id,
					userID,
					type,
					function(response) {
						reply({"status":"successful"});
					}
				);

			} else if (voteType == 'message') {

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

module.exports = function(route_holder) {
    route_holder['vote'] = setup;
};
