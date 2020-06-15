const Sequelize = require('sequelize');

const connectionString = process.env.DATABASE_URL ||'postgres://postgres:1111@localhost:5432/todo';
const db =new Sequelize(connectionString)

module.exports=db;
//postgres://redyonngzwdqxg:54165edcdc84fc0032fbe0391c3bdfadf04a734aab3b56337e42f6c35e94c4e8@ec2-34-193-117-204.compute-1.amazonaws.com:5432/d4lpa1rnsbidu9