const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const User=require('../services/user');
const Bank=require('../services/bank');
const Transfer=require('../services/transfer');
const Account=require('../services/account');
const Interest_rate = require('../services/interest_rate');
const Notification = require('../services/notification');
const Account_saving = require('../services/account_saving');
const Email=require('../services/email');
const router = new Router();

var errors=[];
var time_day;

router.get('/', asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    const bank= await Bank.findByAll();
    const bank_user=await Bank.findByCode(user.bank);
    const account_saving=await Account_saving.findBySTK(req.session.userId);

    if(req.session.userId){
        if(user.staff==true){
            return res.redirect('/staff');
        }
        if(user.authentication!=null){
            req.session.id=req.session.userId;
            delete req.session.userId;
            return res.redirect('/login_authentication');
        }
        if(account_saving){
            var today = new Date();
            var date= today.toISOString();
            var sent_date=date.substring(0,10);
            if(account_saving.date_received==sent_date || account_saving.check==false){
                await Email.send(user.email,'Thông báo!!!',`Tài khoản tiết kiệm đã đến hẹn vui lòng rút tiền vào tài khoản gốc. \n
                        Trân trọng và cảm ơn!!!.\n
                        Người gửi: Ngân hàng ${bank.Name}.`);

                var string=`Tài khoản tiết kiệm đã đến hẹn vui lòng rút tiền vào tài khoản gốc. \n
                        Trân trọng và cảm ơn!!!.\n
                        Người gửi: Ngân hàng ${bank.Name}.`;
                            
                await Notification.addNotification(user.id,string,sent_date);
                account_saving.check=true;
                account_saving.save();
            }
            time_day=await Interest_rate.sum_day(req.session.userId);
        }
        return res.render('transfer', { errors, bank,bank_user,time_day,account_saving});
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
    const user_acc= await User.findById(req.session.userId);
    const user_rec= await User.findById(req.body.STK);
    const bank_user=await Bank.findByCode(user_acc.bank);
    const account_saving=await Account_saving.findBySTK(req.session.userId);
    time_day=await Interest_rate.sum_day(req.session.userId);
    if(user_acc.authentication!=null){
        req.session.id=req.session.userId;
        delete req.session.userId;
        return res.redirect('/login_authentication');
    }
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.render('transfer', { errors, bank,bank_user,time_day,account_saving});
    }
    errors = [];

    //check xem có user của STK đó k nếu có thì có cùng displayname and mã bank k
    if(!user_rec|| (user_rec.displayName!=(req.body.displayname).toUpperCase()) || (user_rec.bank!=req.body.code) || (user_rec.staff!=false)){
        errors = [{ msg: "User information could not be found!!!" }];
        return res.render('transfer', { errors, bank,bank_user,time_day,account_saving});
    }

    //đk 1 lần giao dịch dưới 50tr
    if(req.body.money>50000000){
        errors = [{ msg: "Maximum of 1 transfer is 50,000,000 VND!!!" }];
        return res.render('transfer', { errors, bank,bank_user,time_day,account_saving});
    }
 
    //check xem acc còn đủ tiền để giao dịch k
    const acc = await Account.findById(user_acc.id);
    var temp=0;
    if(user_acc.bank==user_rec.bank){
        temp=bank_user.same_bank;
    }
    else{
        temp=bank_user.other_banks;
    }
    const x=Number(req.body.money);
    if((acc.money-(x+temp))<0){
        errors = [{ msg: "You do not have enough money to make this transaction!!!" }];
        return res.render('transfer', { errors, bank,bank_user,time_day,account_saving});
    }

    //dkien 1 ngày giao dịch < 200tr
    const addSend=await Transfer.addTransfer_sender(req.session.userId,req.body.STK,req.body.money,req.body.description);
    const check_money_date= await Transfer.findAllSTK_sender(req.session.userId,addSend.date);
    if(check_money_date>200000000){
        await Transfer.deleteById(addSend.id)
        errors = [{ msg: "Maximum of 1 day of transfer is 200,000,000 VND!!!" }];
        return res.render('transfer', { errors, bank,bank_user,time_day,account_saving});
    }

    //save tax phí lại
    addSend.tax=temp;
    addSend.save();
    

    //gửi OTP qua email
    const user= await User.findById(addSend.STK_acc);
    Email.send(user.email,'Mã OTP',`${addSend.OTP}.`);

    req.session.idTransfer=addSend.id;
    return res.redirect('/transfer_OTP');
}));

module.exports = router;