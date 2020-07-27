const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const crypto=require('crypto');
const User=require('../services/user');
const Email=require('../services/email');
const Bank=require('../services/bank');
const Transfer=require('../services/transfer');
const { report } = require('process');
const router = new Router();

var errors=[];

router.get('/', function (req,res){
    return res.render('notification');
});

router.post('/', function (req,res){
});

module.exports = router;