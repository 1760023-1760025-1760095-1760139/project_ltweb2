const {Router}=require('express');
const User=require('../services/user');
const asyncHandler=require('express-async-handler');

const router = new Router();

router.get('/', function (req,res){
    res.render('home');
});

router.get('/home', function (req,res){
    res.render('home');
});

router.get('/login', function (req,res){
    res.render('login');
});

router.post('/login',asyncHandler(async function (req,res){
    const user = await User.findByEmail(req.body.email);
    //k tìm thấy user hoặc mật khẩu thì hiển thị lại trang login
    if(!user || !User.verifyPassword(req.body.password,user.password)){
        return res.render('home');
    }
    req.session.userId=user.id;
    res.redirect('/customer');
}));

router.get('/:id/:OTP',asyncHandler(async function (req,res){
    const{id,OTP}=req.params;
    const user=await User.findById(id);
    if(user && user.OTP === OTP){
        user.OTP=null;
        user.save();
        req.session.userId=user.id;
    }
    res.redirect('/customer');
}));

module.exports = router;