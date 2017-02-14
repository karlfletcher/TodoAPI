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
	
	var queryParams = req.query;
	var filteredTodos = todoList;

	if(queryParams.completed){
		if(queryParams.completed == "true")
			filteredTodos = _.where(todoList, {completed: true})
		else
			filteredTodos = _.where(todoList, {completed: false})
	}

	if(queryParams.q && queryParams.q.length > 0){
		filteredTodos = _.filter(filteredTodos, function(todo){
				return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		})
	}

	return res.json(filteredTodos);
});

//GET todos/:id
app.get('/todos/:id', function(req, res){
	var id = parseInt(req.params.id, 10);
	var todoID = _.findWhere(todoList, {id: id})

	if(todoID)
		res.json(todoID);
	else
		res.status(404).send();
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

