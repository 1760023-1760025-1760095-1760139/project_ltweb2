const Bank=require('../services/bank');
const asyncHandler=require('express-async-handler');

module.exports= asyncHandler(async function auth(req,res,next){
    const userId=req.session.userId;
    res.locals.currentBank=null;
    if(!userId){
        return next();
    }
    const bank= await Bank.findById(userId);
    if(!bank){
        return next();
    }
    req.currentBank=bank;
    res.locals.currentBank=bank;
    next();
});