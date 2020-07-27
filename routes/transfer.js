const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const crypto=require('crypto');
const User=require('../services/user');
const Email=require('../services/email');
const Bank=require('../services/bank');
const Transfer=require('../services/transfer');
const Account=require('../services/account');
const {sendOTP}=require('../services/notification');
const router = new Router();

var errors=[];

router.get('/', asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    const bank= await Bank.findByAll();
    if(req.session.userId){
        if(user.staff==true){
            return res.redirect('/staff');
        }
        return res.render('transfer', { errors, bank});
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
    const bank= await Bank.findByAll();
    const user_rec= await User.findById(req.body.STK);
    const user_acc= await User.findById(req.session.userId);
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.render('transfer', { errors, bank});
    }
    errors = [];

    //check xem có user của STK đó k nếu có thì có cùng displayname and mã bank k
    if(!user_rec || !((user_rec.displayname===req.body.displayname) && (user_rec.bank===req.body.code))){
        errors = [{ msg: "User information could not be found!!!" }];
        return res.render('transfer', { errors, bank});
    }

    //đk 1 lần giao dịch dưới 50tr
    if(req.body.money>50000000){
        errors = [{ msg: "Maximum of 1 transfer is 50,000,000 VND!!!" }];
        return res.render('transfer', { errors, bank});
    }
 
    //check xem acc còn đủ tiền để giao dịch k
    const check_money_Bank= await Account.check_money_Bank(req.session.userId,req.body.STK,req.body.money);
    if(check_money_Bank==false){
        errors = [{ msg: "You do not have enough money to make this transaction!!!" }];
        return res.render('transfer', { errors, bank});
    }

    //dkien 1 ngày giao dịch < 200tr
    const addSend=await Transfer.addTransfer_sender(req.session.userId,req.body.STK,req.body.money,req.body.description);
    const check_money_date= await Transfer.findAllSTK_sender(req.session.userId,addSend.date);
    if(check_money_date==false){
        await Transfer.deleteById(addSend.id)
        errors = [{ msg: "Maximum of 1 day of transfer is 200,000,000 VND!!!" }];
        return res.render('transfer', { errors, bank});
    }

    //save tax phí lại
    await Transfer.check_Bank(addSend.id);

    //gửi OTP qua email
    await sendOTP(addSend.id);

    req.session.idTransfer=addSend.id;
    return res.redirect('/transfer_OTP');
}));

module.exports = router;