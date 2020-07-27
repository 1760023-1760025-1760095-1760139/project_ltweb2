const express=require("express");
const bodyParser = require('body-parser');
const app =express();
const cookieSession=require('cookie-session');
app.set("view engine","ejs");
app.set("views","./views");
const db=require('./services/db')
const Bank=require('./services/bank');
const User=require('./services/user');
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

User.create({
    email:'daoto@gmail.com',
    displayName: ('hoang nguyen dai').toUpperCase(),
    password: User.hashPassword('123123123'),
    bank:'ACB',
    staff:true,
});

Bank.bulkCreate([
    {Name:'VPBank - Ngan hang TMCP VN Thinh Vuong', code:'VPBank', same_bank:0, other_banks:2000,},
    {Name:'ABBank - Ngan hang TMCP An Binh', code:'ABBank', same_bank:1000, other_banks:2000,},
    {Name:'ACB - Ngan hang TMCP A Chau', code:'ACB', same_bank:1000, other_banks:3000,},
    {Name:'Agribank- Ngan hang NN va Phat trien NT VN', code:'Agribank', same_bank:2000, other_banks:3000,},
    {Name:'Dong A Bank - Ngan hang TMCP Dong A', code:'Dong A Bank', same_bank:1500, other_banks:4000,},
    {Name:'HDBank - Ngan hang TMCP Phat trien nha TPHCM', code:'HDBank', same_bank:1000, other_banks:2000,},
    {Name:'OCB - Ngan hang TMCP Phuong Dong', code:'OCB', same_bank:1000, other_banks:3000,},
    {Name:'BIDV - Ngan hang Dau tu va Phat trien VN', code:'BIDV', same_bank:1000, other_banks:2000,},
    {Name:'Nam A Bank - Ngan hang TMCP Nam A', code:'Nam A Bank', same_bank:1000, other_banks:4000,},
    {Name:'Sacombank - Ngan hang TMCP SG Thuong Tin', code:'Sacombank', same_bank:0, other_banks:3000,},
    {Name:'Saigonbank - Ngan hang TMCP SG Cong Thuong', code:'Saigonbank', same_bank:1000, other_banks:3000,}
]);

app.use('/',require('./routes/login'));
app.get('/:id/:OTP',require('./routes/login_OTP'));

app.use(require('./middlewares/auth'));
app.use(require('./middlewares/account'));
app.use(require('./middlewares/bank'));

app.use('/register',require('./routes/register'));

app.use('/forgot',require('./routes/forgot'));
app.use('/forgot_OTP',require('./routes/forgot_OTP'));
app.use('/forgot_password',require('./routes/forgot_password'));

app.use('/test',require('./routes/test'));

app.get('/customer',require('./routes/customer'));
app.use('/customer_update_user',require('./routes/customer_update_user'));
app.use('/customer_update_user_OTP',require('./routes/customer_update_user_OTP'));

app.use('/transfer',require('./routes/transfer'));
app.use('/transfer_OTP',require('./routes/transfer_OTP'));

//app.get('/staff',require('./routes/staff'));

app.get('/logout',require('./routes/logout'));


db.sync().then(function(){
}).catch(function(err){
    console.error(err);
});