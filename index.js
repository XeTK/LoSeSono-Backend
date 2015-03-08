// Some nice functions to have.
var rek       = require('rekuire');
var fs        = require('fs');
var colors    = require('colors');

// Main libraries are being used.
var Sequelize = require('sequelize');
var Hapi      = require('hapi');

// Load my own classes.
var auth   = rek('auth.js');
var routes = rek('routeloader.js');

// Configuration file!
var config = rek('config.json');

// Setup database connection.
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

// Get the path's for the TLS/SSL certificates.
var priKeyPath = config.server.tls.key;
var certPath   = config.server.tls.cert;

// Check the TLS files exist.
var fKey  = fs.existsSync(priKeyPath) ? fs.readFileSync(priKeyPath) : null;
var fCert = fs.existsSync(certPath)   ? fs.readFileSync(certPath)   : null;

// If they don't then we exit from the program.
if (!fKey || !fCert) {
	console.error('TLS Cert or Private Key missing!'.red);
	process.exit(1);
}

// Lets setup the HAPI server.
var server = new Hapi.Server();

// Configure the connection ready for war.
server.connection(
	{
		port: config.server.port,
		tls: {
			key:  fKey,
			cert: fCert
		}
	}
);

// Dynamically grab all the routes for the application.
var routes = routes.route_holder;

// Build a nice little object to easily access all the key parts off the application.
var deps = {
	"server":   server,
	"database": sequelize,
	"routes":   routes
}

// Setup the authentication. Before we start messing around with the real routes.
auth.setup(deps);

// Setup all of the external routes. Pass the dependency object that we made earlier to all the routes.
for(var route in routes) 
	routes[route](deps);

// Finally set HAPI up and running.
server.start(
	function () {
    	console.log('Server running at:', server.info.uri.yellow);
	}
);