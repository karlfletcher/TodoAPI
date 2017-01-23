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
	return res.json(todoList);
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
		res.json(todoItem);
	}else{
		return res.status(400).send();
	}


})

//LISTENER
app.listen(PORT, function(){
	console.log("Server started. Listening on port "+PORT+"...");
})