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
			        password: 'secret',
			        cookie: 'sid-example',
			        redirectTo: '/login',
			        isSecure: true
	    		}
	    	);
		}
	);

	server.route(
		{
		    method: ['GET','POST'],
		    path: '/login',
		    config: {
		    	auth: 'simple',
	            /*auth: {
	                mode: 'try',
	                strategy: 'session'
	            },*/
	            plugins: {
	                'hapi-auth-cookie': {
	                    redirectTo: false
	                }
	            }
        	},
		    handler: function (request, reply) {
		    	console.log('we got a request.' + JSON.stringify(request.payload));

		    	console.log(JSON.stringify(request.auth));

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
}

var validate = function (username, password, callback) {
	console.log('Valudating user: ' + username);

    var user = users[username];

    if (!user) {
        return callback(null, false);
    }

    console.log('password: ' + password);
    var isValid = (user.password == password);

    console.log('isValid: ' + isValid);

    callback(null, isValid, { id: user.id, name: user.name });
    
};

exports.setup = setup;
