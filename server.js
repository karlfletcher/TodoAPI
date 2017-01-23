var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todoList =[{
	id			: 1,
	description	: "Finish node course.",
	complete	: false
},{
	id			: 2,
	description	: "Grab lunch",
	complete	: false
},{
	id			: 3,
	description	: 'Get coffee',
	complete	: true
}]

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

app.listen(PORT, function(){
	console.log("Server started. Listening on port "+PORT+"...");
})