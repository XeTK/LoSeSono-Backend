var users = {
    tom: {
        username: 'tom',
        password: 'password',   // 'secret'
        name: 'John Doe',
        id: '1'
    }
};

function setup(deps) {

	var server = deps.server;
	var db     = deps.database;

	server.register(
	    require('hapi-auth-basic'), 
	    function (err) {

	        server.auth.strategy(
	            'simple', 
	            'basic', 
	            { 
	                validateFunc: validate 
	            }
	        );
	    }
	);

	server.register(
		require('hapi-auth-cookie'), 
		function (err) {

	    	server.auth.strategy(
	    		'session', 
	    		'cookie', 
	    		{
			        password:   'secret',
			        cookie:     'losesono',
			        redirectTo: '/login',
			        isSecure:    true
	    		}
	    	);
		}
	);

	server.route(
		{
		    method: [
		    	'GET',
		    	'POST'
		    ],
		    path: '/login',
		    config: {
		    	auth: 'simple',
	            plugins: {
	                'hapi-auth-cookie': {
	                    redirectTo: false
	                }
	            }
        	},
		    handler: function (request, reply) {

				if (request.auth.isAuthenticated) {
			        var account = request.auth.credentials;
			        request.auth.session.set(account);
			    }

			    return reply.redirect('/');
		    }
		}
	);

	server.route(
		{
		    method: 'GET',
		    path: '/logout',
		    config: {
	            auth: 'session'
	        },
		    handler: function (request, reply) {
		        request.auth.session.clear();

    			return reply.redirect('/');
		    }
		}
	);

	server.getRoute = function(path, callback) {

		server.route(
			{
			    method: 'GET',
			    path:   path,
			    config: {
		            auth: 'session'
		        },
			    handler: function (request, reply) {
			    	callback(request, reply);
			    }
			}
		);
	};

	server.postRoute = function(path, callback) {
		server.route(
			{
			    method: 'POST',
			    path: path,
			    config: {
	            	auth: 'session'
	        	},
			    handler: function (request, reply) {
					callback(request, reply);
			    }
			}
		);
	}

}

var validate = function (username, password, callback) {

    var user = users[username];

    if (!user) {
        return callback(null, false);
    }

    var isValid = (user.password == password);

    callback(null, isValid, { id: user.id, name: user.name });
    
};

exports.setup = setup;
