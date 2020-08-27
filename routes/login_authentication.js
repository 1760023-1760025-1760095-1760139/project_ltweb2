const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const crypto=require('crypto');
const User=require('../services/user');
const Email=require('../services/email');

const router = new Router();

var errors = [{ msg: "" }];

router.get('/', asyncHandler(async function (req,res){
    const user= await User.findById(req.session.id)
    if(user){
        return res.render('login_authentication', { errors });
    }
    else {
        return res.redirect('/');
    }
}));

router.post('/',asyncHandler(async function (req,res){
    const user = await User.findById(req.session.id);
    if(req.body.OTP!=user.authentication){
        errors = [{ msg: "Invalided OTP code !!!" }];
        return res.render('login_authentication', { errors });
    }
    if(req.body.paper_type!=user.paper_type){
        errors = [{ msg: "The paper type does not match!!!" }];
        return res.render('login_authentication', { errors });
    }
    user.authentication=null;
    user.authentication_check=true;
    user.save();
    delete req.session.id;
    return res.redirect('/');     
}));

module.exports = router;