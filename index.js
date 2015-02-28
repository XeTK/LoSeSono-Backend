var Sequelize = require('Sequelize');

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