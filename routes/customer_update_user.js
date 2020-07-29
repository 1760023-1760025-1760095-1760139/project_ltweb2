const {Router}=require('express');
const bcrypt=require('bcrypt');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const crypto=require('crypto');
const User=require('../services/user');
const Bank = require('../services/bank');
const Email=require('../services/email');

const router = new Router();

var errors=[];
router.get('/',asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    const bank=await Bank.findByCode(user.bank);
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
        return res.render('customer_update_user',{errors,bank});
    }
    else {
        return res.redirect('login');
    }
}));

router.post('/',[    
    body('current_password')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Không được để trống Displayname!!!'),//k dc trống
    body('password')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Không được để trống Password!!!')//k dc trống
        .isLength({min:6,max:50}).withMessage('Password Ki tu 6->50!!!')
        .custom((value, { req }) => {
            if (value == req.body.current_password) {
                throw new Error('Không được giống với current password!!!');
            }
            return true;
        }),
    body('confirm_password')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Không được để trống Confirm Password!!!')//k dc trống
        .custom((value, { req }) => {
            if (value != req.body.password) {
                throw new Error('Confirm password is wrong!!!');
            }
            return true;
        }),
],asyncHandler(async function (req,res){
    errors = validationResult(req);
    const user= await User.findById(req.session.userId)
    const bank=await Bank.findByCode(user.bank);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.render('customer_update_user', {errors,bank});
    }
    if(user.password==bcrypt.hashSync(req.body.password,10)){
        errors = [{ msg: "Wrong password!!!" }];
        return res.render('customer_update_user', {errors,bank});
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
    user.update_password=User.hashPassword(req.body.password);
    user.update_OTP = crypto.randomBytes(3).toString('hex').toUpperCase();
    user.save()

    await Email.send(user.email,'Mã OTP: ',`${user.update_OTP}`);
    return res.redirect('customer_update_user_OTP')
}));

module.exports = router;