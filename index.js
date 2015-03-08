var Sequelize = require('sequelize');
var Hapi      = require('hapi');
var fs        = require('fs');

var auth   = require('./auth.js');
var routes = require('./routeloader.js');

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

var routes = routes.route_holder;

var deps = {
	"server":   server,
	"database": sequelize,
	"routes":   routes
}

// Setup the authentication.
auth.setup(deps);

// Setup all of the external routes.
for(var route in routes) 
	routes[route](deps);

server.start(
	function () {
    	console.log('Server running at:', server.info.uri);
	}
);