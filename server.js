var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;

var todoNextID = 1;
var todoList =[]

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('TODO API ROOT');
});

//GET todos
app.get('/todos', function(req, res){
	return res.json(todoList);
});

//GET todos/:id
app.get('/todos/:id', function(req, res){
	var todoID = todoList.filter(function(todo){
		return req.params.id == todo.id;
	})

	if(todoID.length > 0)
		res.send(todoID);
	else
		res.status(404).send();
})

//POST todos
app.post('/todos', function(req, res){
	var body = req.body;
	
	var todoItem = {
		"id"			: todoNextID++,
		"description"	: (body.description ? body.description : "empty"),
		"completed"		: (body.completed ? body.completed : false)
	}
	todoList.push(todoItem);

	res.json(todoItem);
})

app.listen(PORT, function(){
	console.log("Server started. Listening on port "+PORT+"...");
})