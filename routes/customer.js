const {Router}=require('express');
const asyncHandler=require('express-async-handler');
const User=require('../services/user');
const Sequelize=require('sequelize');
const Bank = require('../services/bank');
const router = new Router();

router.get('/customer',asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    const bank=await Bank.findByCode(user.bank);
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
        return res.render('customer',{bank});
    }
    else {
        return res.redirect('/');
    }
    
}));

module.exports = router;