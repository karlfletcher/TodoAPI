var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': './data/dev-todo-api.sqlite' // file name to store databse in
});

var db = {};

db.todo = sequelize.import('models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;