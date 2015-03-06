var Sequelize = require('sequelize');
var Hapi      = require('hapi');

// Get all of the external routes ready to use.
var serverRoute   = require('./routes/server.js');
var userRoute     = require('./routes/user.js');
var friendRoute   = require('./routes/friend.js');
var messageRoute  = require('./routes/message.js');
var commentsRoute = require('./routes/comments.js');
var voteRoute     = require('./routes/vote.js');

var sequelize = new Sequelize(
	'losesono', 
	'application', 
	'application', 
	{
		host: 'localhost',
		dialect: 'postgres',
		dialectOptions: {
			multipleStatements: true
		},

		pool: {
			max: 5,
			min: 0,
			idle: 10000
		}
	}
);

var server = new Hapi.Server();
server.connection({ port: 3000 });

var deps = {
	"server": server,
	"database": sequelize
}

// Setup all of the external routes.
serverRoute.setup(deps);
userRoute.setup(deps);
friendRoute.setup(deps);
messageRoute.setup(deps);
commentsRoute.setup(deps);
voteRoute.setup(deps);

server.start(
	function () {
    	console.log('Server running at:', server.info.uri);
	}
);