const express=require("express");
const bodyParser = require('body-parser');
const app =express();
const cookieSession=require('cookie-session');
app.set("view engine","ejs");
app.set("views","./views");
const db=require('./services/db')
app.listen(process.env.PORT || 3000);
app.use(express.static(__dirname + '/views'));
app.use(cookieSession({
    name:'session',
    keys:['123456'],
    maxAge:24*60*60*1000,
}));
//auth middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({extended: true}));


app.get('/',require('./routes/login'));
app.get('/home',require('./routes/login'));
app.get('/login',require('./routes/login'));
app.post('/login',require('./routes/login'));
app.get('/:id/:OTP',require('./routes/login'));

app.use(require('./middlewares/auth'));

app.post('/register',require('./routes/register'));
app.get('/register',require('./routes/register'));

app.get('/OTP_forgot',require('./routes/forgot'));
app.get('/update_forgot',require('./routes/forgot'));
app.get('/OTP_forgot_err',require('./routes/forgot'));
app.post('/forgot',require('./routes/forgot'));
app.post('/OTP_forgot',require('./routes/forgot'));
app.post('/update_forgot',require('./routes/forgot'));

app.get('/customer',require('./routes/customer'));


app.get('/logout',require('./routes/logout'));

app.get('/not_activated',require('./routes/test'));



db.sync().then(function(){
}).catch(function(err){
    console.error(err);
});