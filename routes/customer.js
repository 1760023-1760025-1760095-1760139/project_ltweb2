module.exports=function home_(req,res){
    res.render('customer');
}


const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const crypto=require('crypto');
const User=require('../services/user');
const Email=require('../services/email');

const router = new Router();

router.get('/customer',asyncHandler(async function (req,res){
    const user = await User.findByEmail(req.body.email);
    //k tìm thấy user hoặc mật khẩu thì hiển thị lại trang login
    if(!user || !User.verifyPassword(req.body.password,user.password)){
        return res.render('home');
    }
    req.session.userId=user.id;
    res.redirect('/customer');

    if(req.session.userId==null){
        res.render('home')
    }
    
    res.redirect('/customer');



}));