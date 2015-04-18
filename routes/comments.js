
var db = require('../db/comments');

function setup(deps) {

	var server = deps.server;

	db.setup(deps);

	server.getRoute(
		'/comments/{message_id}',
		function (request, reply) {

			var msgID = request.params.message_id;

		    db.getComments(
		    	msgID,
		    	function(response) {
		    		//console.log(JSON.Stringify(response));
		    		reply(response);
		    	}
		    );
		}
	);

	server.postRoute(
		'/comments/add',
		function (request, reply) {

			var payload = request.payload;

			var userID  = request.auth.credentials.user_id;

			var msgID   = payload.message_id;
			var comment = payload.comment;

			db.addComment(
				msgID,
				userID,
				comment,
				function(response) {
					reply({'status':'success'});
				}
			);
		}
	);
}

module.exports = function(route_holder) {
    route_holder['comments'] = setup;
};