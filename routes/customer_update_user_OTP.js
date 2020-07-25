const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const User_Update=require('../services/user_update');
const User=require('../services/user');

const router = new Router();

var errors=[];
router.get('/',asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    const update= await User_Update.findById(req.session.userId);
    if(req.session.userId){
        if(user.staff==true){
            return res.redirect('/staff');
        }
        if(update.OTP==null){
            return res.redirect('customer');
        }
        return res.render('customer_update_user_OTP',{errors});
    }
    else {
        return res.redirect('login');
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
        return res.render('customer_update_user_OTP', {errors});
    }
    errors = [];
    const user = await User_Update.findById(req.session.userId);

    if(user && (req.body.OTP===user.OTP)){
        user.OTP=null;//xét = null thì ms xuất qua staff
        user.save();
        return res.redirect('customer');
    }

    errors = [{ msg: "Wrong OTP!!!" }];
    return res.render('customer_update_user_OTP',{errors});
}));

module.exports = router;