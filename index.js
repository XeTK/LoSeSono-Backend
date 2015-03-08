var rek       = require('rekuire');
var fs        = require('fs');
var colors    = require('colors');

var Sequelize = require('sequelize');
var Hapi      = require('hapi');

var auth   = rek('auth.js');
var routes = rek('routeloader.js');

var config = rek('config.json');


var sequelize = new Sequelize(
	config.database.name, 
	config.database.username, 
	config.database.password, 
	{
		host:    config.database.host,
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

var priKeyPath = config.server.tls.key;
var certPath   = config.server.tls.cert;

var fKey  = fs.existsSync(priKeyPath) ? fs.readFileSync(priKeyPath) : null;
var fCert = fs.existsSync(certPath)   ? fs.readFileSync(certPath)   : null;

if (!fKey || !fCert) {
	console.error('TLS Cert or Private Key missing!'.red);
	process.exit(1);
}

var server = new Hapi.Server();

server.connection(
	{
		port: config.server.port,
		tls: {
			key:  fKey,
			cert: fCert
		}
	}
);

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
    	console.log('Server running at:', server.info.uri.yellow);
	}
);