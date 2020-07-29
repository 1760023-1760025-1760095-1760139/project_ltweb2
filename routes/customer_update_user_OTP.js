const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const User=require('../services/user');
const Bank = require('../services/bank');

const router = new Router();

var errors=[];
router.get('/',asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    const bank=await Bank.findByCode(user.bank);
    if(req.session.userId){
        if(user.staff==true){
            return res.redirect('/staff');
        }
        if(user.update_OTP==null){
            return res.redirect('customer');
        }
        if(user.authentication!=null){
            req.session.id=req.session.userId;
            delete req.session.userId;
            return res.redirect('/login_authentication');
        }
        return res.render('customer_update_user_OTP',{errors,bank});
    }
    else {
        return res.redirect('login');
    }
}));

router.post('/',[    
    body('OTP')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong OTP!!!'),//k dc trống
    body('paper_type')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong Paper type!!!'),//k dc trống
],asyncHandler(async function (req,res){
    errors = validationResult(req);
    const user = await User.findById(req.session.userId);
    const bank=await Bank.findByCode(user.bank);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.render('customer_update_user_OTP', {errors,bank});
    }
    errors = [];
    

    if(user.authentication!=null){
        req.session.id=req.session.userId;
        delete req.session.userId;
        return res.redirect('/login_authentication');
    }
    if(user.lock==true){
        delete req.session.userId;
        return res.redirect('login_locked_account');
    }
    if(req.body.OTP!=user.update_OTP){
        errors = [{ msg: "Invalided OTP code !!!" }];
        return res.render('customer_update_user_OTP',{errors,bank});
    }
    if(req.body.paper_type!=user.paper_type){
        errors = [{ msg: "The paper type does not match!!!" }];
        return res.render('customer_update_user_OTP',{errors,bank});
    }
    user.update_OTP=null;
    user.save();
    return res.redirect('/customer');
}));

module.exports = router;