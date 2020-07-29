const {Router}=require('express');
const asyncHandler=require('express-async-handler');
const User=require('../services/user');
const Notification=require('../services/notification');
const Email=require('../services/email');
const router = new Router();


router.get('/',asyncHandler(async function (req,res){
    const user= await User.findById(req.session.id);
    user.lock=false;
    user.authentication=null;
    user.authentication_check=false;
    user.save();
    await Email.send(user.email,'Account của bạn đã hoạt động trở lại!!!',`Thành công`);
    var temp='Account của bạn đã hoạt động trở lại!!!';
    const notification= await Notification.addNotification(user.id,temp);
    delete req.session.id;
    return res.redirect('/staff');
}));

module.exports = router;