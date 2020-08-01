const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const crypto=require('crypto');
const User=require('../services/user');
const Email=require('../services/email');
const Bank=require('../services/bank');
const Transfer=require('../services/transfer');
var schedule = require('node-schedule');
const router = new Router();

var errors=[];

router.get('/', function (req,res){
    var today = new Date();
    var date= today.toISOString();
    var date_name=date.substring(0,10)
    var year=Number(date.substring(0,4));
    var month=Number(date.substring(5,7));
    var day=Number(date.substring(8,10));
    var today_=new Date(year,month,day,12,00,00);
    var date_1= today_.toISOString();
    var date_name_1=date_1.substring(0,10)
    var year_1=Number(date_1.substring(0,4));
    var month_1=Number(date_1.substring(5,7));
    var day_1=Number(date_1.substring(8,10));
    var a=today_.getFullYear
    var b=today_.getDay(date_name_1);
    var c=today_.getUTCDate();
    var d=today_.getUTCDay(date_name_1)

    var today_2=new Date(date_name_1);
    var date_2= today_2.toISOString();
    console.log(date_2);


    console.log(a);
    console.log(b);
    console.log(c);
    console.log(d);

    console.log(date_name_1);
    console.log(year_1);
    console.log(month_1);
    console.log(day_1);

    let startTime = new Date(2018, 9, 11, 12, 0, 0);
    let endTime = new Date(2018, 11, 23, 12, 1, 0);
    console.log(startTime)
    console.log(endTime)
    var j = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' });
    console.log(j);
    

    // function check_date(date1,month_){
    //     var year=Number(date1.substring(0,4));
    //     var month=Number(date1.substring(5,7))+Number(month_)+1;
    //     var day=date.substring(8,10);
    //     var temp=month/12;
    //     month=month%12;
    //     year+=temp*12;
    //     return year+'-'+month+'-'+day;
    // }
    

    console.log(6%5);
    console.log((6/5)-((6/5)%1));



    // var temp3=check_date(date_name);
    // console.log(temp3);



    return res.render('test');
});

router.post('/',asyncHandler(async function (req,res){

    console.log(req.body.money);
    console.log(req.body.money);
    console.log(req.body.money);
    console.log(req.body.money);
    console.log(req.body.money);
    console.log(req.body.money);
    console.log(req.body.money);
    return res.render('test');
}));

module.exports = router;