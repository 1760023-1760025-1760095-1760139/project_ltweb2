const express=require("express");
const bodyParser = require('body-parser');
const app =express();
const cookieSession=require('cookie-session');
app.set("view engine","ejs");
app.set("views","./views");
app.listen(process.env.PORT || 3000);
app.listen(3000);
app.use(express.static(__dirname + '/views'));

//auth middleware
app.use(require('./middlewares/auth'));
app.get('/',require('./routes/home'));