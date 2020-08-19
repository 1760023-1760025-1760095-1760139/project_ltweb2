const {Router}=require('express');
const asyncHandler=require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User=require('../services/user');
const Bank = require('../services/bank');
const Accept_user = require('../services/accept_user');
const router = new Router();

var errors=[];
var i=1; 
var count=0; 
router.get('/',asyncHandler(async function (req,res){
    i=1; 
    var staff=false;
    delete req.session.id;
    var notification=0;
    if(req.session.notification){
        notification=req.session.notification;
        delete req.session.notification;
    }
    const user= await User.findById(req.session.userId)
    const arr= await User.findByAll_STK_Bank(user.bank,staff)
    const bank_acc=await Bank.findByCode(user.bank)
    if(req.session.userId){
        if(user.staff==true){
            count= await Accept_user.Count(user.id,user.bank);
            return res.render('staff',{errors,arr,i,bank_acc,notification,count});
        }
        return res.redirect('/customer');
    }
    else {
        return res.redirect('/');
    }
}));

router.post('/',asyncHandler(async function (req,res){
    i=1;
    var staff=false;
    var notification=0;
    const user= await User.findById(req.session.userId)
    var arr= await User.findByAll_STK_Bank(user.bank,staff)
    const bank_acc=await Bank.findByCode(user.bank)
    count= await Accept_user.Count(user.id,user.bank);
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.render('staff', { errors, arr, i,bank_acc,notification,count});
    }
    errors = [];
    i=1;
    const user_rec=await User.findById(req.body.STK);
    if(!user_rec|| (user_rec.bank!=user.bank) || (user_rec.staff!=false)){
        errors = [{ msg: "User information could not be found!!!" }];
        return res.render('staff', { errors, arr, i,bank_acc,notification,count});
    }
    req.session.id=user_rec.id;
    
    return res.redirect('/staff_find');
}));

module.exports = router;