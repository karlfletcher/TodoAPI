var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite' // file name to store databse in
});


var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	completed: {	
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var User = sequelize.define('user', {
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	// force : true
}).then(function(){
	console.log("Everything is synced.");

	// User.create({
	// 	email: "fletch254@live.co.uk"
	// }).then(function(){
	// 	return Todo.create({
	// 		description: "Tidy house"
	// 	});
	// }).then(function(todo){
	// 	return User.findById(1).then(function(user){
	// 		user.addTodo(todo);
	// 	});
	// });

	var where = {};
	where.completed = true;

	User.findById(1).then(function(user){
		user.getTodos({where: where}).then(function(todos){
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			})
		})
	})
});