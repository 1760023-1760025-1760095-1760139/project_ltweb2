const {Router}=require('express');
const asyncHandler=require('express-async-handler');
const User=require('../services/user');
const Interest_rate = require('../services/interest_rate');
const Account_saving = require('../services/account_saving');
const Notification = require('../services/notification');
const Bank = require('../services/bank');
const Email=require('../services/email');
const router = new Router();

const io = require('socket.io-client');
process.env.BASE_URL = "http://localhost:3000";
let socket;
socket = io(process.env.BASE_URL);

var time_day;
router.get('/customer',asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    const bank=await Bank.findByCode(user.bank);
    const account_saving=await Account_saving.findBySTK(req.session.userId);
    await Account_saving.send_email();
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
        
        return res.render('customer',{bank,time_day,account_saving});
    }
    else {
        return res.redirect('/');
    }
    
}));

module.exports = router;