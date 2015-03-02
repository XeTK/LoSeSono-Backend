var Sequelize = require('Sequelize');
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

console.log(sequelize);

var server = new Hapi.Server();
server.connection({ port: 3000 });

// Setup all of the external routes.
serverRoute.setup(server);
userRoute.setup(server);
friendRoute.setup(server);
messageRoute.setup(server);
commentsRoute.setup(server);
voteRoute.setup(server);

server.start(
	function () {
    	console.log('Server running at:', server.info.uri);
	}
);