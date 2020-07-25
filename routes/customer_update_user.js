const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const crypto=require('crypto');
const User=require('../services/user');
const Email=require('../services/email');

const User_Update=require('../services/user_update');

const router = new Router();

var errors=[];
router.get('/',asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    if(req.session.userId){
        if(user.staff==true){
            return res.redirect('/staff');
        }
        return res.render('customer_update_user',{errors});
    }
    else {
        return res.redirect('login');
    }
}));

router.post('/',[    
    body('displayname')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong Displayname!!!'),//k dc trống
    body('sdt')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong SDT!!!')//k dc trống
        .isLength({min:10,max:10}).withMessage('Ki tu SDT = 10!!!'),
    body('paper_type')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong Paper Type!!!'),//k dc trống
    body('paper_number')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong Paper Number!!!')//k dc trống
        .isLength({min:8,max:20}).withMessage('Ki tu Paper Number 8->20!!!'),
    body('date_of_issue')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong Date Of Issue!!!'),//k dc trống
],asyncHandler(async function (req,res){
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.render('customer_update_user', {errors});
    }
    errors = [];
    const user = await User.findById(req.session.userId);
    await User_Update.deleteById(req.session.userId)
    const update =await User_Update.create({
        id:user.id,
        email:user.email,
        displayName: (req.body.displayname).toUpperCase(),
        SDT:req.body.sdt,
        paper_type:req.body.paper_type,
        paper_number:req.body.paper_number,
        date_of_issue:req.body.date_of_issue,
        OTP: crypto.randomBytes(3).toString('hex').toUpperCase(),
    });

    await Email.send(update.email,'Mã OTP: ',`${update.OTP}`);
    return res.redirect('customer_update_user_OTP')
}));

module.exports = router;