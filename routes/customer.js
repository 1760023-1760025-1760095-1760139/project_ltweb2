const {Router}=require('express');
const asyncHandler=require('express-async-handler');
const User=require('../services/user');
const Sequelize=require('sequelize');
const router = new Router();

router.get('/customer',asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    if(req.session.userId){
        if(user.staff==true){
            return res.redirect('/staff');
        }
        return res.render('customer');
    }
    else {
        return res.redirect('/');
    }
    
}));

module.exports = router;