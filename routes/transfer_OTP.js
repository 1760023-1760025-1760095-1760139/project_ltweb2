const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const User=require('../services/user');
const Transfer=require('../services/transfer');
const {transfer_notification}=require('../services/notification');
const router = new Router();

var errors=[];
router.get('/',asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    if(req.session.userId){
        if(user.staff==true){
            return res.redirect('/staff');
        }
        if(req.session.idTransfer){
            return res.render('transfer_OTP',{errors});
        }
        return res.redirect('/transfer');
    }
    else {
        return res.redirect('/login');
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
        return res.render('transfer_OTP', {errors});
    }
    errors = [];

    const transfer = await Transfer.findById(req.session.idTransfer);
    if(transfer && (req.body.OTP===transfer.OTP)){
        transfer.OTP=null;//xét = null thì ms xuất qua staff
        transfer.save();

        transfer_notification(req.session.idTransfer);

        delete req.session.idTransfer;
        return res.redirect('/customer');
    }

    errors = [{ msg: "Wrong OTP!!!" }];
    return res.render('transfer_OTP',{errors});
}));

module.exports = router;