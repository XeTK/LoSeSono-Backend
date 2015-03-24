
var db = require('../db/friend');

function setup(deps) {

	var server = deps.server;

	db.setup(deps);

	server.getRoute(
		'/friends',
		function (request, reply) {
			var userID = request.auth.credentials.user_id;
		    
			db.listFriendsByUserID(
				userID,
				function(data) {
					reply(data);
				}
			)
		}
	);

	server.postRoute(
		'/friend/add',
		function (request, reply) {

			var userID   = Number(request.auth.credentials.user_id);
			var friendID = Number(request.payload.friend_id);

			db.addFriend(
				userID,
				friendID,
				function(data) {
					console.log(JSON.stringify(data));
					reply('success');
				}
			);

	    }
	);
	

	server.postRoute(
		'/friend/remove',
		function (request, reply) {
	        reply('TODO /friend/remove');
	    }
	);

}

module.exports = function(route_holder) {
    route_holder['friend'] = setup;
};