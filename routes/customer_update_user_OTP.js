const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const User=require('../services/user');
const Interest_rate = require('../services/interest_rate');
const Account_saving = require('../services/account_saving');
const Notification = require('../services/notification');
const Bank = require('../services/bank');
const Email=require('../services/email');

const router = new Router();

var errors=[];
var account_saving;
var time_day;
router.get('/',asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    const bank=await Bank.findByCode(user.bank);

    account_saving=await Account_saving.findBySTK(req.session.userId);

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
        return res.render('customer_update_user_OTP',{errors,bank,time_day,account_saving});
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
    account_saving=await Account_saving.findBySTK(req.session.userId);
    time_day=await Interest_rate.sum_day(req.session.userId);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.render('customer_update_user_OTP', {errors,bank,time_day,account_saving});
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
        return res.render('customer_update_user_OTP',{errors,bank,time_day,account_saving});
    }
    if(req.body.paper_type!=user.paper_type){
        errors = [{ msg: "The paper type does not match!!!" }];
        return res.render('customer_update_user_OTP',{errors,bank,time_day,account_saving});
    }
    user.update_OTP=null;
    user.save();
    return res.redirect('/customer');
}));

module.exports = router;