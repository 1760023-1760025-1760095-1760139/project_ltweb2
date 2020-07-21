const Sequelize = require('sequelize');

const connectionString = process.env.DATABASE_URL ||'postgres://postgres:1111@localhost:5432/todo';
const db =new Sequelize(connectionString)

module.exports=db;
