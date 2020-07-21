const express=require("express");
const bodyParser = require('body-parser');
const app =express();
const cookieSession=require('cookie-session');
app.set("view engine","ejs");
app.set("views","./views");
const db=require('./services/db')
const port=process.env.PORT || 3000;
app.use(express.static(__dirname + '/views'));
app.use(cookieSession({
    name:'session',
    keys:['123456'],
    maxAge:24*60*60*1000,
}));
//auth middleware
app.use(require('./middlewares/auth'));
app.use(bodyParser.urlencoded({extended: false}));
app.get('/',require('./routes/register'));
app.get('/home',require('./routes/home'));
app.post('/Signup',require('./routes/register'));





db.sync().then(function(){
    app.listen(port);
    console.log(`server is listening on port ${port}`);
}).catch(function(err){
    console.error(err);
});