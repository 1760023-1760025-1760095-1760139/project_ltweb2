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
    const user= await User.findById(req.session.userId)
    const x= await User.findById(req.session.id)
    const bank_acc=await Bank.findByCode(user.bank)
    const arr= await Accept_user.findByAll_STK(user.bank)
    if(req.session.userId){
        if(user.staff==true){
            arr.forEach(x=>{count=count+1;});
            return res.render('staff_find',{errors,x,i,bank_acc,count});
        }
        return res.redirect('/customer');
    }
    else {
        return res.redirect('/');
    }
})); 

router.post('/',asyncHandler(async function (req,res){
    i=1;
    req.session.id=req.body.STK_find;
    const user= await User.findById(req.session.userId)
    const x= await User.findById(req.session.id)
    const arr= await Accept_user.findByAll_STK(user.bank)
    const bank_acc=await Bank.findByCode(user.bank)
    arr.forEach(x=>{count=count+1;});
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.redirect('/staff');
    }
    errors = [];
    i=1;
    if(!x|| (x.bank!=user.bank) || (x.staff!=false)){
        errors = [{ msg: "User information could not be found!!!" }];
        return res.redirect('/staff');
    }
    
    return res.render('staff_find', { errors, x, i,bank_acc,count});
}));

module.exports = router;