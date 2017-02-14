//REQUIRES
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

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
	``
})

app.delete('/todos/:id', function(req, res){
	var todoID = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todoList, {id: todoID});

	if(!matchedTodo){
		res.status(404).json({"Error" : "No task with given id found"});
	}else{
		todoList = _.without(todoList, matchedTodo);
		res.json(matchedTodo);
	}

});

//PUT /todos/:id
app.put('/todos/:id', function(req, res){
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	var matchedTodo = _.findWhere(todoList, {id: parseInt(req.params.id, 10)});
	if(!matchedTodo){
			return res.status(404).json({"Error" : "No task with given id found"});
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	}else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;
	}else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);

});

//We only start the listener if the db connection synced correctly.
db.sequelize.sync().then(function(){
	//LISTENER
	app.listen(PORT, function(){
		console.log("Server started. Listening on port "+PORT+"...");
	});	
})

