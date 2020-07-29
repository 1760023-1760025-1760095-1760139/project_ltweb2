const {Router}=require('express');
const asyncHandler=require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User=require('../services/user');
const Bank = require('../services/bank');
const Notification=require('../services/notification');
const Email=require('../services/email');
const router = new Router();

var errors=[];
router.get('/',asyncHandler(async function (req,res){
    var i=1;
    const user= await User.findById(req.session.id);
    const bank=await Bank.findByCode(user.bank);
    const arr= await Notification.findByIdAll(user.id);
    const user_staff= await User.findById(req.session.userId);
    if(req.session.userId){
        if(user_staff.staff==true){
            return res.render('staff_information',{errors,bank,arr,i});
        }
        return res.redirect('/customer');
    }
    else {
        return res.redirect('/');
    }
}));

router.post('/',[     
    body('date')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Không được để trống Date!!!'),//k dc trống
],asyncHandler(async function (req,res){
    const user= await User.findById(req.session.id);
    const bank=await Bank.findByCode(user.bank)
    const arr= await Notification.findByIdAll(user.id);
    var i=1;
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.render('staff_information', {errors,bank,arr,i});
    }
    errors=[];
    if(req.body.email!=null){
        const found=await User.findByEmail(req.body.email);
        if(found){
            errors = [{ msg: "Email already exists!!!" }];
            return res.render('staff_information', { errors,bank ,arr,i});
        }
        user.email=req.body.email;
    }
    errors = [];

    i=1;
    const temp= await Notification.addDate(req.body.date);
    arr=await Notification.findById_DateAll(user.id,temp.date)
    await Notification.deleteById(temp.id)
    return res.render('notification', { errors, arr, i,bank});
}));

module.exports = router;