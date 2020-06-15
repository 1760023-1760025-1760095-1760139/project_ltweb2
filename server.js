const express=require("express");
const bodyParser = require('body-parser');
const app =express();
const cookieSession=require('cookie-session');
const db=require('./services/db');
app.set("view engine","ejs");
app.set("views","./views");
app.listen(process.env.PORT || 3000);

//Session
app.use(cookieSession({
    name: 'session',
    keys:['123456'],
    maxAge: 24*60*60*1000,//24 hours
}));

app.use(bodyParser.urlencoded({extended: false}));

//auth middleware
app.use(require('./middlewares/auth'));

//route
app.get('/',require('./routes/index'));
app.use('/login',require('./routes/login'));
app.use('/register',require('./routes/register'));
app.get('/logout',require('./routes/logout'));
app.use('/profile',require('./routes/profile'));
app.use('/todos',require('./routes/todos'));

app.use(express.static('public'));

db.sync().then(function(){
   // app.listen(port);
   // console.log(`server is listening on port ${port}`);
}).catch(function (err){
    console.error(err);
});