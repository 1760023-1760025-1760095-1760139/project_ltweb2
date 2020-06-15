const Todo=require('./services/todo');

console.log(Todo.findAll());
console.log(Todo.add('Đi chợ'));
console.log(Todo.add('Làm dealine'));
console.log(Todo.findAll());

const todo2=Todo.findById();
Todo.markAsDone(todo2);

console.log(Todo.findAll());