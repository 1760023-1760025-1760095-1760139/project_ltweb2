const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const crypto=require('crypto');
const User=require('../services/user');
const Email=require('../services/email');

const router = new Router();

var errors=[];

router.get('/', asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    if(req.session.userId){
        if(user.staff==true){
            return res.redirect('/staff');
        }
        return res.redirect('/customer');
    }
    else {
        if(!req.session.email){
            return res.redirect('/forgot');
        }
        else if(user.forgot!=null){
            return res.render('forgot_OTP', { errors });
        }
        else{
            return res.redirect('/forgot_password');
        }
    }
}));

router.post('/',[    
    body('OTP')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong OTP!!!'),//k dc trống
],asyncHandler(async function (req,res){
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.render('forgot_OTP', {errors});
    }
    const user = await User.findByEmail(req.session.email);
    if(user && (req.body.OTP===user.forgot)){        
        user.forgot=null;
        user.save();
        return res.redirect('forgot_password');
    }
    errors = [{ msg: "Invalided OTP code !!!" }];
    return res.render('forgot_OTP', { errors });
}));

module.exports = router;