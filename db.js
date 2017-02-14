var Sequelize = require('sequelize');

var env = process.env.NODE_ENV || 'development';

if(env === 'development'){
	var sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': './data/dev-todo-api.sqlite' // file name to store databse in
	});
}
else{
	var sequelize = new Sequelize(process.env.DATABSE_URL, {
		'dialect': 'postgres'
	});
}

var db = {};

db.todo = sequelize.import('models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;