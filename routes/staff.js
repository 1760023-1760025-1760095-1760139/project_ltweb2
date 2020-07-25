const {Router}=require('express');
const asyncHandler=require('express-async-handler');
const User=require('../services/user');
const router = new Router();

router.get('/staff',asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId)
    if(req.session.userId){
        if(user.staff==true){
            return res.render('staff');
        }
        return res.redirect('/customer');
    }
    else {
        return res.redirect('/');
    }
}));

module.exports = router;