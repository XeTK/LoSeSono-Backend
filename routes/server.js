
var users = {
    john: {
        id: 'john',
        password: 'password',
        name: 'John Doe'
    }
};

function setup(deps) {

	var server = deps.server;

	server.route(
		{
		    method: 'POST',
		    path: '/login',
		    config: {
	            auth: {
	                mode: 'try',
	                strategy: 'session'
	            },
	            plugins: {
	                'hapi-auth-cookie': {
	                    redirectTo: false
	                }
	            }
        	},
		    handler: function (request, reply) {
		    	console.log('we got a request.' + JSON.stringify(request.payload));

				if (request.auth.isAuthenticated) {
			        return reply.redirect('/');
			    }

			    var message = '';
			    var account = null;


		        if (!request.payload.username || !request.payload.password) {

		            message = 'Missing username or password';
		        } else {

		            account = users[request.payload.username];

		            if (!account || account.password !== request.payload.password) {

		                message = 'Invalid username or password';
		            }
		        }
			    

			    request.auth.session.set(account);

			    reply(true);

			    //return reply.redirect('/');
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

	server.route(
		{
		    method: 'GET',
		    path: '/register',
		    handler: function (request, reply) {
		        reply('TODO /register');
		    }
		}
	);

}

exports.setup = setup;