// var person = {
// 	name:"Karl",
// 	age: 222
// };

// function updatePerson(person){
// 	person.age = 24;
// }

// updatePerson(person);
// console.log(person);

var grades = [15, 17];

function updateGrades(grades){
	grades.push(20);
	debugger;
}

function updateGrades2(grades){
	grades = [20];
}

updateGrades(grades);
console.log(grades);