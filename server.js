const express=require("express");
const bodyParser = require('body-parser');
const app =express();
const PORT = process.env.PORT || 3000;
var server=require('http').createServer(app);
var io = require('socket.io').listen(server);
const db=require('./services/db')
const Bank=require('./services/bank');
const interest_rate=require('./services/interest_rate');
const User=require('./services/user');
const cookieSession=require('cookie-session');
//app.listen(process.env.PORT || 3000);

app.use(cookieSession({
    name:'session',
    keys:['123456'],
    maxAge:24*60*60*1000,
}));
//auth middleware
app.use(express.static('views'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('socketio', io);
app.set("view engine","ejs");
app.set("views","./views");

app.use('/',require('./routes/login'));
app.get('/:id/:OTP',require('./routes/login_OTP'));
app.get('/login_locked_account',require('./routes/login_locked_account'));

app.use(require('./middlewares/auth'));
app.use(require('./middlewares/account'));
app.use(require('./middlewares/checkdate'));
app.use(require('./middlewares/add'));

app.use('/register',require('./routes/register'));

app.use('/forgot',require('./routes/forgot'));
app.use('/forgot_OTP',require('./routes/forgot_OTP'));
app.use('/forgot_password',require('./routes/forgot_password'));

app.use('/test',require('./routes/test'));

app.use('/customer',require('./routes/customer'));
app.use('/customer_update_user',require('./routes/customer_update_user'));
app.use('/customer_update_user_OTP',require('./routes/customer_update_user_OTP'));
app.use('/customer_lock_account',require('./routes/customer_lock_account'));
app.use('/customer_lock_transaction',require('./routes/customer_lock_transaction'));

app.use('/transfer',require('./routes/transfer'));
app.use('/transfer_OTP',require('./routes/transfer_OTP'));

app.use('/USD_VND',require('./routes/USD_VND'));
app.use('/USD_VND_pass',require('./routes/USD_VND_pass'));
app.use('/VND_USD',require('./routes/VND_USD'));
app.use('/VND_USD_pass',require('./routes/VND_USD_pass'));
app.use('/withdrawal',require('./routes/withdrawal'));
app.use('/withdrawal_pass',require('./routes/withdrawal_pass'));

app.use('/loaded_views',require('./routes/loaded_views'));
app.use('/loaded',require('./routes/loaded'));
app.use('/loaded_bill',require('./routes/loaded_bill'));

app.use('/notification',require('./routes/notification'));

app.use('/staff',require('./routes/staff'));
app.use('/staff_find',require('./routes/staff_find'));
app.use('/staff_moneyloaded',require('./routes/staff_moneyloaded'));
app.use('/staff_accept_transactions',require('./routes/staff_accept_transactions'));

app.use('/accept_send',require('./routes/accept_send'));
app.use('/accept_receive',require('./routes/accept_receive'));
app.use('/accept_saving',require('./routes/accept_saving'));
app.use('/accept_password',require('./routes/accept_password'));
app.use('/accept_lock_transaction',require('./routes/accept_lock_transaction'));
app.use('/accept_lock_account',require('./routes/accept_lock_account'));
app.use('/accept_user',require('./routes/accept_user'));
app.use('/refuse_send',require('./routes/refuse_send'));
app.use('/refuse_receive',require('./routes/refuse_receive'));
app.use('/refuse_saving',require('./routes/refuse_saving'));
app.use('/refuse_password',require('./routes/refuse_password'));
app.use('/refuse_lock_transaction',require('./routes/refuse_lock_transaction'));
app.use('/refuse_lock_account',require('./routes/refuse_lock_account'));
app.use('/refuse_user',require('./routes/refuse_user'));

app.use('/update',require('./routes/staff_update'));
app.use('/authentication',require('./routes/staff_authentication'));
app.use('/works_again',require('./routes/staff_works_again'));
app.use('/locked',require('./routes/staff_locked'));
app.use('/accept',require('./routes/staff_accept'));
app.use('/refuse',require('./routes/staff_refuse'));
app.use('/information',require('./routes/staff_information'));

app.get('/logout',require('./routes/logout'));


io.on('connection', (socket) => {
    socket.on("transfer_OTP", data => {

        socket.id = data.id;
        users.push(socket.id);
        console.log(data);
    });

    socket.on("staff_moneyloaded", data => {

        socket.id = data.id;
        users.push(socket.id);
        console.log(data);
    });
});




db.sync().then(function(){
    server.listen(PORT, function(){
        console.log('server listening on port '+ PORT);
    });
}).catch(function(err){
    console.error(err);
});