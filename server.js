//REQUIRES
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcryptjs');

//APP SETUP
var app = express();
var PORT = process.env.PORT || 3000;

var todoNextID = 1;
var todoList =[]

app.use(bodyParser.json());


//ROUTER
app.get('/', function(req, res){
	res.send('TODO API ROOT');
});

//GET todos
app.get('/todos', function(req, res){
	
	var query = req.query;
	var where = {};

	if(query.completed)
		if(query.completed === true)
			where.completed = true;
		else
			where.completed = false;

		if(query.q && query.q.length > 0)
			where.description = {
				$like: "%"+query.q+"%"
			}

			db.todo.findAll({where: where}).then(function(todos){
				res.json(todos);
			}).catch(function(error){
				res.status(500).send(error);
			});

		});

//GET todos/:id
app.get('/todos/:id', function(req, res){
	var id = parseInt(req.params.id, 10);

	db.todo.findById(id).then(function(todo){
		if(todo)
			res.json(todo);
		else
			res.status(404).send();
	}).catch(function(error){
		res.status(500);
	});
})

//POST todos
app.post('/todos', function(req, res){

	var body = _.pick(req.body, "description", "completed");
	
	db.todo.create(body).then(function(todo){
		res.status(200).send(todo);
	}).catch(function(e){
		res.status(400).json(e);
	});
})

app.delete('/todos/:id', function(req, res){
	var todoID = parseInt(req.params.id, 10);

	db.todo.destroy({
		where :{
			id: todoID
		}
	}).then(function(count){
		if(count)
			res.status(204).send();
		else
			res.status(404).send("No todo with that ID");
	}).catch(function(error){
		res.status(500).send(error);
	});

});

//PUT /todos/:id
app.put('/todos/:id', function(req, res){
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if(body.description)
		attributes.description = body.description;

	if(body.hasOwnProperty("completed"))
		attributes.completed = body.completed;

	db.todo.findById(req.params.id).then(function(todo){

		if(todo)
			todo.update(attributes).then(function(todo){

				res.json(todo);

			}, function(error){

				res.status(400).json(error);

			})
		else
			res.status(404).send();

	}, function(error){

		res.status(500).send(error);

	})

});

app.post('/users', function(req, res){

	var body = _.pick(req.body, "email", "password");
	
	db.user.create(body).then(function(user){
		res.status(200).send(user.toPublicJSON());
	}).catch(function(e){
		res.status(400).json(e);
	});

});

app.post('/users/login', function(req, res){

	var body = _.pick(req.body, 'email', 'password');

	db.user.authenticate(body).then(function(user){
		res.json(user.toPublicJSON());
	}, function(){
		res.status(401).send();
	})

});

//We only start the listener if the db connection synced correctly.
db.sequelize.sync({force:true}).then(function(){
	//LISTENER
	app.listen(PORT, function(){
		console.log("Server started. Listening on port "+PORT+"...");
	});	
})

