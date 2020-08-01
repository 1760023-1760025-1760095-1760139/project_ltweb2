const {Router}=require('express');
const User=require('../services/user');
const asyncHandler=require('express-async-handler');
const { body, validationResult } = require('express-validator');

const router = new Router();

var errors = [];
router.get('/', asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId);
    if(req.session.userId){
        if(user.staff==true){
            return res.redirect('/staff');
        }
        return res.redirect('/customer');
    }
    else {
        return res.render('login',{errors});
    }
}));

router.post('/',[
    body('email')
        .notEmpty().withMessage('Khong duoc de trong Email!!!')
        .isEmail().withMessage('Email not verified!!!')//dữ liệu nhập vào có phải là email hay k
        .normalizeEmail()
        .custom(async function(email){
            const found=await User.findByEmail(email);
            if(!found){
                throw Error('Wrong Email!!!"');
            }
            return true;
        }),
    body('password')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong Password!!!')//k dc trống
        .isLength({min:6,max:50}).withMessage('Ki tu Password 6->50!!!'),
],asyncHandler(async function (req,res){
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.render('login', {errors});
    }
    errors = [];
    const user = await User.findByEmail(req.body.email);

    if(!User.verifyPassword(req.body.password,user.password)){
        errors = [{ msg: "Wrong Password!!!" }];
        return res.render('login', { errors });
    }
    if(user.lock==true){
        return res.render('login_locked_account');
    }
    if(user.OTP!=null){
        return res.render('login_not_activated');
    }
    if(user.authentication!=null){
        req.session.id=user.id;
        return res.redirect('/login_authentication');
    }
    if(user.authentication_check==true){
        return res.redirect('/');
    }
    req.session.userId=user.id;
    if(user.staff==true){
        return res.redirect('/staff');
    }
    return res.redirect('/customer');
}));

module.exports = router;