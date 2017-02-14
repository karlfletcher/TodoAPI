var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': 'basic-sqlite-database.sqlite' // file name to store databse in
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

sequelize.sync({
	//force : true
}).then(function(){
	console.log("Everything is synced.");

	// Todo.create({
	// 	description: "Take dog for a walk"
	// }).then(function(todo){
	// 	return Todo.create({
	// 		description: "Give dog food"
	// 	})
	// }).then(function(){
		var todo = Todo.findById(2).then(function(todo){
			if(todo)
				console.log(todo);
			else
				console.error("Couldn't find task with specified ID.");
		});

		// return Todo.findAll({
		// 	where : {
		// 		description: {
		// 			$like: '%Wal%'
		// 		}
		// 	}
		// });
	// }).catch(function(error){
	// 	console.log(error);
	// });
});