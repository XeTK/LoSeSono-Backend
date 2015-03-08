var Sequelize = require('sequelize');
var Hapi      = require('hapi');
var fs        = require('fs');

var auth = require('./auth.js');

// Get all of the external routes ready to use.
var serverRoute   = require('./routes/server.js');
var userRoute     = require('./routes/user.js');
var friendRoute   = require('./routes/friend.js');
var messageRoute  = require('./routes/message.js');
var commentsRoute = require('./routes/comments.js');
var voteRoute     = require('./routes/vote.js');

var priKeyPath = 'private-key.pem';
var certPath   = 'public-cert.pem';

var sequelize = new Sequelize(
	'losesono', 
	'application', 
	'application', 
	{
		host:    'localhost',
		dialect: 'postgres',

		dialectOptions: {
			multipleStatements: true
		},

		pool: {
			max:  5,
			min:  0,
			idle: 10000
		}
	}
);

var fKey  = fs.existsSync(priKeyPath) ? fs.readFileSync(priKeyPath) : null;
var fCert = fs.existsSync(certPath)   ? fs.readFileSync(certPath)   : null;

if (!fKey || !fCert) {
	console.error('TLS Cert or Private Key missing!'.red);
	process.exit(1);
}

var options = {
	port: 3000,
	tls: {
		key:  fKey,
		cert: fCert
	}
};

var server = new Hapi.Server();
server.connection(options);

var deps = {
	"server":   server,
	"database": sequelize
}

// Setup the authentication.
auth.setup(deps);

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