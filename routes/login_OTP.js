const {Router}=require('express');
const User=require('../services/user');
const asyncHandler=require('express-async-handler');

const router = new Router();

router.get('/:id/:OTP',asyncHandler(async function (req,res){
    const{id,OTP}=req.params;
    const user=await User.findById(id);
    if(user && user.OTP === OTP){
        user.OTP=null;
        user.save();
        req.session.userId=user.id;
        console.log(req.session.userId);
        return res.redirect('/customer');
    }
    else{
        return res.render('/login_OTP_err');
    }    
}));

module.exports = router;