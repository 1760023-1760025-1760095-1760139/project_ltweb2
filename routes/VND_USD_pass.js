const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const User=require('../services/user');
const Bank=require('../services/bank');
const Transfer=require('../services/transfer');
const Account=require('../services/account');
const Interest_rate = require('../services/interest_rate');
const Notification = require('../services/notification');
const Account_saving = require('../services/account_saving');
const Email=require('../services/email');
const router = new Router();

var errors=[];
var time_day=0;

router.get('/', asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    const bank=await Bank.findByCode(user.bank);
    const account_saving=await Account_saving.findBySTK(req.session.userId);

    if(req.session.userId){
        if(user.staff==true){
            return res.redirect('/staff');
        }
        if(user.authentication!=null){
            req.session.id=req.session.userId;
            delete req.session.userId;
            return res.redirect('/login_authentication');
        }
        if(user.lock==true){
            delete req.session.userId;
            return res.redirect('login_locked_account');
        }
        if(account_saving){
            time_day=await Interest_rate.sum_day(account_saving);
        }
        return res.render('VND_USD_pass', { errors, bank,time_day,account_saving});
    }
    else {
        return res.redirect('/');
    }
}));

router.post('/',asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId);
    const bank=await Bank.findByCode(user.bank);
    const account_saving=await Account_saving.findBySTK(req.session.userId);
    if(user.authentication!=null){
        req.session.id=req.session.userId;
        delete req.session.userId;
        return res.redirect('/login_authentication');
    }
    if(user.lock==true){
        delete req.session.userId;
        return res.redirect('login_locked_account');
    }

    if(!User.verifyPassword(req.body.password,user.password)){
        errors = [{ msg: "Wrong password!!!" }];
        return res.render('VND_USD_pass', { errors, bank,time_day,account_saving});
    }
    errors = [];
 
    const acc = await Account.findById(user.id);
    const x=Number(req.session.money_VND);
    var money=x/23000;
    money=money.toFixed(2);
    
    acc.money=acc.money-x;
    acc.money_USD=Number(acc.money_USD) + Number(money);
    acc.save();

    var today = new Date();
    var date= today.toISOString();
    var date_name=date.substring(0,10)

    //gửi OTP qua email
    Email.send(user.email,'Đổi tiền tệ!!!',`Số dư tài khoản vừa giảm ${x} VND và tăng ${money} USD vào lúc ${date}.\n
            Số dư hiện tại: ${acc.money} VND và ${acc.money_USD} USD.\n
            Mô tả: đổi tiền tệ từ VND -> USD.`);

    var string=`Số dư tài khoản vừa giảm ${x} VND và tăng ${money} USD vào lúc ${date}.\n
            Số dư hiện tại: ${acc.money} VND và ${acc.money_USD} USD.\n
            Mô tả: đổi tiền tệ từ VND -> USD.`
    
    await Notification.addNotification(user.id,string,date_name);

    delete req.session.money_VND;
    req.session.notification=1;
    return res.redirect('/customer');
}));

module.exports = router;