const {Router}=require('express');
const asyncHandler=require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User=require('../services/user');
const Bank=require('../services/bank');
const Account=require('../services/account');
const Transfer=require('../services/transfer');
const Notification=require('../services/notification');
const Email=require('../services/email');
const {transfer_notification_bank}=require('../services/notification');
const router = new Router();

var errors=[];
var i=1;
router.get('/',asyncHandler(async function (req,res){
    i=1;
    var staff=false;
    const user= await User.findById(req.session.userId)
    const arr= await User.findByAll_STK_Bank(user.bank,staff)
    const bank_acc=await Bank.findByCode(user.bank)
    const bank= await Bank.findByAll();
    if(req.session.userId){
        if(user.staff==true){
            return res.render('staff_moneyloaded',{errors,arr,i,bank,bank_acc});
        }
        return res.redirect('/customer');
    }
    else {
        return res.redirect('/');
    }
}));

router.post('/',[
    body('displayname')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Không được để trống Displayname!!!'),//k dc trống
    body('STK')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Không được để trống STK!!!'),
    body('money')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Không được để trống money!!!')//k dc trống
],asyncHandler(async function (req,res){
    i=1;
    var staff=false;
    const user= await User.findById(req.session.userId)
    const arr= await User.findByAll_STK_Bank(user.bank,staff)
    const bank_acc=await Bank.findByCode(user.bank)
    const bank= await Bank.findByAll();
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.render('staff_moneyloaded', { errors, arr, i, bank,bank_acc});
    }
    errors = [];
    i=1;
    const user_rec=await User.findById(req.body.STK);
    if(!user_rec|| (user_rec.displayName!=(req.body.displayname).toUpperCase()) || (user_rec.bank!=req.body.code) || (user_rec.staff!=false)){
        errors = [{ msg: "User information could not be found!!!" }];
        return res.render('staff_moneyloaded', { errors, arr, i, bank,bank_acc});
    }

    //them thong tin
    const transfer= await Transfer.addTransfer_bank(req.body.STK,req.body.money,req.body.code)

    //truy vấn ng nhận
    const user_acc= await User.findById(transfer.STK_acc);
    const acc= await Account.findById(transfer.STK_acc);

    //truy vấn tên của ngân hàng gửi
    const user_bank= await Bank.findByCode(transfer.bank);
    
    //khoản tiền gửi sẽ được cộng vào tk ng nhận
    acc.money=acc.money+transfer.money;
    acc.save();

    //gửi email báo số dư cho ng nhận
    Email.send(user_acc.email,'Thay đổi số dư tài khoản',`Số dư tài khoản vừa tăng ${transfer.money} VND vào ${transfer.createdAt}. \n
        Số dư hiện tại: ${acc.money} VND. \n
        Mô tả: \n
        Nhận từ ngân hàng: ${user_bank.Name}. \n
        Số tiền: ${transfer.money}.`);

    var string=`Số dư tài khoản vừa tăng ${transfer.money} VND vào ${transfer.createdAt}. \n
        Số dư hiện tại: ${acc.money} VND. \n
        Mô tả: \n
        Nhận từ ngân hàng: ${user_bank.Name}. \n
        Số tiền: ${transfer.money}.`;
    const notification=await Notification.addNotification(user_acc.id,string);
    return res.redirect('/staff');
}));

module.exports = router;