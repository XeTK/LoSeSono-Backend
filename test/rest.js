var assert = require("assert")
var requestify = require('requestify');
var cookie = require('cookie'); 
var rek       = require('rekuire');
var Sequelize = require('sequelize');

var config = rek('../config.json');

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

var options = {
	"firstname": randomstring(5),
    "lastname": randomstring(5),
    "username": randomstring(5),
    "email": randomstring(5),
    "password": randomstring(5)
};

var userItem = {
	"user_id"     : 1,
	"first_name"  : "Tom",
	"last_name"   : "Rosier",
	"username"    : "XeTK",
	"email"       : ".",
	"facebook_id" : null
};

var usersItem = [
	{
		"user_id":1,
		"first_name":"Tom",
		"last_name":"Rosier",
		"username":"XeTK",
		"created_date":"2015-03-28T22:20:05.892Z",
		"modified_date":"2015-03-28T22:20:05.892Z",
		"created_by":"application",
		"modified_by":"application"
	}
];

var comments = [
	{
		"comment_id": 19,
		"message_id": 5,
		"user_id": 1,
		"content": "Hello World",
		"created_date": "2015-04-18T11:11:59.498Z"
	}
];

var message = {
	"message_id": 5,
	"user_id": 1,
	"private": false,
	"content": "Hello cats",
	"longitude": -5.53906,
	"latitude": 50.0842,
	"range": 1000,
	"created_date": "2015-03-29T12:46:31.220Z",
	"modified_date": "2015-03-29T12:46:31.220Z",
	"created_by": "application",
	"modified_by": "application"
};

var friendsMessages = [
{
	"message_id": 3,
	"user_id": 2,
	"private": false,
	"content": "Cats",
	"longitude": -5.53912,
	"latitude": 50.0831,
	"range": 1000,
	"created_date": "2015-03-28T22:28:54.929Z",
	"modified_date": "2015-03-28T22:28:54.929Z",
	"created_by": "application",
	"modified_by": "application"
	},
	{
	"message_id": 6,
	"user_id": 1,
	"private": false,
	"content": "Cats",
	"longitude": -5.53906,
	"latitude": 50.0842,
	"range": 1000,
	"created_date": "2015-03-29T13:09:05.466Z",
	"modified_date": "2015-03-29T13:09:05.466Z",
	"created_by": "application",
	"modified_by": "application"
	}
];

var userMessages = [
	{
	"message_id": 2,
	"user_id": 1,
	"private": false,
	"content": "Hello",
	"longitude": -5.54563,
	"latitude": 50.0896,
	"range": 1000,
	"created_date": "2015-03-28T22:21:30.449Z",
	"modified_date": "2015-03-28T22:21:30.449Z",
	"created_by": "application",
	"modified_by": "application"
	},
	{
	"message_id": 5,
	"user_id": 1,
	"private": false,
	"content": "Hello cats",
	"longitude": -5.53906,
	"latitude": 50.0842,
	"range": 1000,
	"created_date": "2015-03-29T12:46:31.220Z",
	"modified_date": "2015-03-29T12:46:31.220Z",
	"created_by": "application",
	"modified_by": "application"
	},
	{
	"message_id": 6,
	"user_id": 1,
	"private": false,
	"content": "Cats",
	"longitude": -5.53906,
	"latitude": 50.0842,
	"range": 1000,
	"created_date": "2015-03-29T13:09:05.466Z",
	"modified_date": "2015-03-29T13:09:05.466Z",
	"created_by": "application",
	"modified_by": "application"
	}
];

var notifications = [];

var messageVote = {
	"positive": 1,
	"negative": 0
};

var commentVote = {
	"positive": 1,
	"negative": 0
};

var server = "https://127.0.0.1:8080";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function randomstring(L){
    var s= '';
    var randomchar=function(){
    	var n= Math.floor(Math.random()*62);
    	if(n<10) return n; //1-10
    	if(n<36) return String.fromCharCode(n+55); //A-Z
    	return String.fromCharCode(n+61); //a-z
    }
    while(s.length< L) s+= randomchar();
    return s;
}

function login(username, password, callback)  {

	requestify.get(
		server + '/login', 
		{
		    auth: {
		        username: username,
		        password: password
		    },
		    dataType: 'json'        
		}
	)
	.then(
		function(response) {
			callback(response);
		}
	)
	.fail(
		function(response) {
			callback(response);
		}
	);
}

function getRequest(url, authCookie, callback) {

	var uri = server + url;

	var cookieStr = authCookie['losesono'];

	requestify.get(
		uri, 
		{
		    cookies: {
		        'losesono': cookieStr
		    },
		    dataType: 'json'        
		}
	)
	.then(
		function(response) {
			callback(response);
			//console.log("Response: " + JSON.stringify(response));
		}
	).fail(
		function(response) {
            callback(response);
            //console.log("Response: " + JSON.stringify(response));
            //console.log('STATUS: ' + response.statuscode);
        }
    );
}

function postRequest(url, data, authCookie, callback) {

	var uri = server + url;

	var cookieStr = authCookie['losesono'];

	requestify.post(
		uri, 
		data,
		{
		    cookies: {
		        'losesono': cookieStr
		    },
		    dataType: 'json'        
		}
	)
	.then(
		function(response) {
			callback(response);
			//console.log("Response: " + JSON.stringify(response));
		}
	).fail(
		function(response) {
            callback(response);
            //console.log("Response: " + JSON.stringify(response));
            //console.log('STATUS: ' + response.statuscode);
        }
    );
}

function authenticatedRequest(fun, def) {

	var de = def;

	login(
		de ? options.username : 'XeTK',
		de ? options.password : 'password',
		function(response) {

			var cookieSTR = response.headers['set-cookie'][0];

			var cookies = cookie.parse(cookieSTR);

			fun(cookies);
		}
	);	
}


describe(
	'User Operations', 
	function(){
		describe(
			'Login', 
			function(){
				it(
					'Test 1. Check the login via get', 
					function(done){

						login(
							'XeTK',
							'password',
							function(response) {
								var body = JSON.parse(response.body);

								assert.deepEqual(body, userItem);
								done();
							}
						);						
					}
				)

				it(
					'Test 2. Check the login via post', 
					function(done){

						requestify.post(
							server + '/login', 
							{
							    auth: {
							        username: 'XeTK',
							        password: 'password'
							    },
							    dataType: 'json'        
							}
						).then(
							function(response) {
								var body = JSON.parse(response.body);
								//console.log("BoDY: " + JSON.stringify(body));
								assert.deepEqual(body, userItem);
								done();
							}
						)
						.fail(
							function(response) {
								//console.log("failed" + JSON.stringify(response));
								assert.fail();
								done();
							}
						);				
					}
				)

				it(
					'Test 3. Check registering user.', 
					function(done){

						authenticatedRequest(
							function(cookies) {


								postRequest(
									'/register',
									options,
									cookies,
									function(response) {

										//console.log(JSON.stringify(response));

										getRequest(
											'/user/username/' + options.username,
											cookies,
											function(response) {
												var body = JSON.parse(response.body);
												//console.log(JSON.stringify(response));

												assert.equal(body[0].username, options.username);
												done();
											}
										);	
									}
								);
							}
						);				
					}
				)

				it(
					'Test 4. Check if user is logged out.', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								getRequest(
									'/logout',
									cookies,
									function(response) {
										var body = JSON.parse(response.body);
										assert.deepEqual(body, {});
										done();
									}
								);	
							}
						);				
					}
				)
			}
		)

		describe(
			'User Objects', 
			function(){
				it(
					'Test 5. Get object for current user.', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								getRequest(
									'/user',
									cookies,
									function(response) {
										var body = JSON.parse(response.body);

										assert.deepEqual(body, usersItem);
										done();
									}
								);	
							}
						);				
					}
				)

				it(
					'Test 6. Get object for user by user_id.', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								getRequest(
									'/user/id/1',
									cookies,
									function(response) {
										var body = JSON.parse(response.body);

										assert.deepEqual(body, usersItem);
										done();
									}
								);	
							}
						);				
					}
				)

				it(
					'Test 7. Get object for user by username.', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								getRequest(
									'/user/username/XeTK',
									cookies,
									function(response) {
										var body = JSON.parse(response.body);

										assert.deepEqual(body, usersItem);
										done();
									}
								);	
							}
						);				
					}
				)
			}
		)

		describe(
			'Friends Objects', 
			function(){
					it(
					'Test 8. Get friends list for current user.', 
					function(done){

						authenticatedRequest(
							function(cookies) {

								getRequest(
									'/user/username/' + options.username,
									cookies,
									function(response) {
										var body = JSON.parse(response.body);

										var parms = {
											"friend_id": (Number(body[0].user_id) - 1)
										};

										postRequest(
											'/friend/add',
											parms,
											cookies,
											function(response) {
												getRequest(
													'/friends',
													cookies,
													function(response) {
														var body = JSON.parse(response.body);

														//console.log(JSON.stringify(response));
														assert.deepEqual(body[body.length -1].friend_user_id, parms.friend_id);
														done();
													}
												);	
											}
										);
									}
								);	
							},
							true
						);				
					}
				)
				it(
					'Test 9. Add friend to the current user.', 
					function(done){

						authenticatedRequest(
							function(cookies) {

								getRequest(
									'/user/username/' + options.username,
									cookies,
									function(response) {
										var body = JSON.parse(response.body);

										var parms = {
											"friend_id": (Number(body[0].user_id) - 1)
										};

										postRequest(
											'/friend/add',
											parms,
											cookies,
											function(response) {
												it(
													'Test 8. Get friends list for current user.', 
													function(done){
														getRequest(
															'/friends',
															cookies,
															function(response) {
																var body = JSON.parse(response.body);

																//console.log(JSON.stringify(response));
																assert.deepEqual(body[body.length -1].friend_user_id, parms.friend_id);
																done();
															}
														);	
													}
												)
												done();
											}
										);
									}
								);	
							},
							true
						);				
					}
				)
				it(
					'Test 10. Removing friend.', 
					function(done){
						assert.fail();
					}
				)

			}
		)

		describe(
			'Comments Objects', 
			function(){
				it(
					'Test 11. Get comments for message.', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								getRequest(
									'/comments/5',
									cookies,
									function(response) {
										var body = JSON.parse(response.body);

										assert.deepEqual(body, comments);
										done();
									}
								);	
							}
						);				
					}
				)

				it(
					'Test 12. Adding comment to message', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								var params = {
									"message_id": 2,
									"comment": randomstring(99)
								};

								postRequest(
									'/comments/add',
									params,
									cookies,
									function(response) {

										getRequest(
											'/comments/2',
											cookies,
											function(response) {
												var body = JSON.parse(response.body);

												var msg = body[body.length - 1];

												assert.equal(msg.content, params.comment);
												done();
											}
										);	
									}
								);

							},
							true
						);				
					}
				)
			}
		)

		describe(
			'Message Objects', 
			function(){
				it(
					'Test 13. Get a message by id.', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								getRequest(
									'/message/5',
									cookies,
									function(response) {
										var body = JSON.parse(response.body);

										assert.deepEqual(body, message);
										done();
									}
								);	
							}
						);				
					}
				)

				it(
					'Test 14. Get messages from friends to user.', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								getRequest(
									'/messages/friends',
									cookies,
									function(response) {
										var body = JSON.parse(response.body);

										assert.deepEqual(body, friendsMessages);
										done();
									}
								);	
							}
						);				
					}
				)

				it(
					'Test 15. Get list of messages that should notify the user.', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								getRequest(
									'/messages/notifications',
									cookies,
									function(response) {
										var body = JSON.parse(response.body);

										assert.deepEqual(body, notifications);
										done();
									}
								);	
							}
						);				
					}
				)
	
				it(
					'Test 16. Get list of messages for the user.', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								getRequest(
									'/messages/user',
									cookies,
									function(response) {
										var body = JSON.parse(response.body);

										assert.deepEqual(body, userMessages);
										done();
									}
								);	
							}
						);				
					}
				)

				it(
					'Test 17. Marking as read', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								var params = {
									"private": false,
							        "content": randomstring(32),
							        "longitude": 0,
							        "latitude": 0,
							        "range": 1000
								};

								postRequest(
									'/message/add/message',
									params,
									cookies,
									function(response) {
										getRequest(
											'/messages/user',
											cookies,
											function(response) {
												var body = JSON.parse(response.body);

												var msg = body[0];

												var msgID = msg.message_id;

												postRequest(
													'/message/read',
													{
														"message_id": msg.message_id
													},
													cookies,
													function(response) {

														sequelize.query(
															"select * from read_messages where user_id = :userid and message_id = :msgid", 
															{ 
																replacements: { 
																	userid: msg.user_id,
																	msgid:  msg.message_id
																},
																type: sequelize.QueryTypes.SELECT
															}
														)
													  	.success(
													  		function(response) {

													  			var read = response[0];

													  			//console.log(JSON.stringify(read));

													  			assert.equal(msg.user_id,    read.user_id);
																assert.equal(msg.message_id, read.message_id);
																done();
													  		}
													  	);
													}
												);
											}
										);	
									}
								);
							},
							true
						);				
					}
				)

				it(
					'Test 18. Add a new message.', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								var params = {
									"private": false,
							        "content": randomstring(32),
							        "longitude": 0,
							        "latitude": 0,
							        "range": 1000
								};

								postRequest(
									'/message/add/message',
									params,
									cookies,
									function(response) {
										getRequest(
											'/messages/user',
											cookies,
											function(response) {
												var body = JSON.parse(response.body);

												var msg = body[body.length - 1];

												assert.equal(msg.private,   params.private);
												assert.equal(msg.content,   params.content);
												assert.equal(msg.longitude, params.longitude);
												assert.equal(msg.latitude,  params.latitude);
												assert.equal(msg.range,     params.range);

												done();
											}
										);	
									}
								);
							},
							true
						);				
					}
				)

				it(
					'Test 19. Make message visable', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								var params = {
									"private": false,
							        "content": randomstring(32),
							        "longitude": 0,
							        "latitude": 0,
							        "range": 1000
								};

								postRequest(
									'/message/add/message',
									params,
									cookies,
									function(response) {
										getRequest(
											'/messages/user',
											cookies,
											function(response) {
												var body = JSON.parse(response.body);

												var msg = body[0];

												var params = {
													"friend_id": 2,
											        "message_id": msg.message_id
												};

												postRequest(
													'/message/add/user',
													params,
													cookies,
													function(response) {
														
														sequelize.query(
															"select * from message_friend_group where friends_id = :friendid and message_id = :msgid", 
															{ 
																replacements: { 
																	friendid: 2,
																	msgid:  msg.message_id
																},
																type: sequelize.QueryTypes.SELECT
															}
														)
													  	.success(
													  		function(response) {

													  			var read = response[0];

													  			assert.equal(read.friends_id, 2);
																assert.equal(read.message_id, msg.message_id);
																done();
													  		}
													  	);
													}
												);				
											}
										);	
									}
								);
							},
							true
						);				
					}
				)
			}
		)

		describe(
			'Vote Objects', 
			function(){

				it(
					'Test 20. Adding vote', 
					function(done){

						sequelize.query(
							"select last_value from messages_message_id_seq", 
							{ 
								type: sequelize.QueryTypes.SELECT
							}
						)
					  	.success(
					  		function(response) {

					  			var lastVal = response[0].last_value;

					  			var params = {
									"id": lastVal,
									"type": "positive"
					  			};

								authenticatedRequest(
									function(cookies) {
										postRequest(
											'/vote/message/add',
											params,
											cookies,
											function(response) {
												sequelize.query(
													"select * from message_votes where message_id = :messageid and user_id = :userid", 
													{ 																
														replacements: { 
															userid: 1,
															messageid: Number(params.id)
														},
														type: sequelize.QueryTypes.SELECT
													}
												)
											  	.success(
											  		function(response) {
											  			var obj = response[0];

											  			assert.equal(obj.message_id, params.id);
											  			assert.equal(obj.user_id, 1);
											  			assert.equal(obj.vote_type, 'positive');
											  			done();
											  		}
											  	);
											}
										);
									}
								);
					  		}
					  	);


					}
				)

				it(
					'Test 21. Get votes for message and comments', 
					function(done){

						authenticatedRequest(
							function(cookies) {
								getRequest(
									'/vote/message/5',
									cookies,
									function(response) {
										var body = JSON.parse(response.body);

										assert.deepEqual(body, messageVote);

										getRequest(
											'/vote/comment/19',
											cookies,
											function(response) {
												var body = JSON.parse(response.body);

												assert.deepEqual(body, commentVote);
												done();
											}
										);	
										//done();
									}
								);	
							}
						);				
					}
				)


			}
		)
	}
)	
