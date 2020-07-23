const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const crypto=require('crypto');
const User=require('../services/user');
const Email=require('../services/email');

const router = new Router();

router.get('/OTP_forgot', function (req,res){
    res.render('OTP_forgot');
});

router.get('/update_forgot', function (req,res){
    res.render('update_forgot');
});

router.get('/OTP_forgot_err', function (req,res){
    res.render('OTP_forgot_err');
});

router.post('/forgot',asyncHandler(async function (req,res){
    const user = await User.findByEmail(req.body.email);
    if(!user){
        res.render('forgot_err')
    }
    user.forgot=crypto.randomBytes(3).toString('hex').toUpperCase(),
    user.save();

    await Email.send(user.email,'Mã OTP: ',`${user.forgot}`);
    req.session.email=user.email;
    res.redirect('OTP_forgot');
}));

router.post('/OTP_forgot',asyncHandler(async function (req,res){
    const user = await User.findByEmail(req.session.email);
    //k tìm thấy user hoặc mật khẩu thì hiển thị lại trang login
    if(user && (req.body.OTP===user.forgot)){
        user.forgot=null;
        user.save();
        return res.redirect('update_forgot');
    }
    delete req.session.email;
    res.redirect('/OTP_forgot_err');
}));

router.post('/update_forgot',asyncHandler(async function (req,res){
    const user = await User.findByEmail(req.session.email);
    user.password = User.hashPassword(req.body.password),
    user.save();

    delete req.session.email;
    res.render('home');
}));

module.exports = router;