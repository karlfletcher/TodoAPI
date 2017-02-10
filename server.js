//REQUIRES
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
	}else{
		return res.json(todoList);
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
	
	if(_.isString(body.description) && body.description.trim() != "" && _.isBoolean(body.completed)){
		body.id = todoNextID++;

		body.description = body.description.trim();

		todoList.push(body);
		res.json(body);
	}else{
		return res.status(400).send();
	}
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

//LISTENER
app.listen(PORT, function(){
	console.log("Server started. Listening on port "+PORT+"...");
});