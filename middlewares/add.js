const Bank=require('../services/bank');
const interest_rate=require('../services/interest_rate');
const User=require('../services/user');
const asyncHandler=require('express-async-handler');

module.exports= asyncHandler(async function auth(req,res,next){
    User.create({
        email:'hoangdai@gmail.com',
        displayName: ('hoang nguyen dai').toUpperCase(),
        password: User.hashPassword('123123123'),
        bank:'ACB',
        staff:true,
    });
    
    interest_rate.bulkCreate([
        {month:1, rate:3.7,},
        {month:3, rate:3.75,},
        {month:6, rate:5.7,},
        {month:12, rate:5.9,},
        {month:18, rate:6,}
    ]);
    
    Bank.bulkCreate([
        {Name:'VPBank - Ngan hang TMCP VN Thinh Vuong', code:'VPBank', same_bank:0, other_banks:2000,},
        {Name:'ABBank - Ngan hang TMCP An Binh', code:'ABBank', same_bank:1000, other_banks:2000,},
        {Name:'ACB - Ngan hang TMCP A Chau', code:'ACB', same_bank:1000, other_banks:3000,},
        {Name:'Agribank- Ngan hang NN va Phat trien NT VN', code:'Agribank', same_bank:2000, other_banks:3000,},
        {Name:'Dong A Bank - Ngan hang TMCP Dong A', code:'Dong A Bank', same_bank:1500, other_banks:4000,},
        {Name:'HDBank - Ngan hang TMCP Phat trien nha TPHCM', code:'HDBank', same_bank:1000, other_banks:2000,},
        {Name:'OCB - Ngan hang TMCP Phuong Dong', code:'OCB', same_bank:1000, other_banks:3000,},
        {Name:'BIDV - Ngan hang Dau tu va Phat trien VN', code:'BIDV', same_bank:1000, other_banks:2000,},
        {Name:'Nam A Bank - Ngan hang TMCP Nam A', code:'Nam A Bank', same_bank:1000, other_banks:4000,},
        {Name:'Sacombank - Ngan hang TMCP SG Thuong Tin', code:'Sacombank', same_bank:0, other_banks:3000,},
        {Name:'Saigonbank - Ngan hang TMCP SG Cong Thuong', code:'Saigonbank', same_bank:1000, other_banks:3000,}
    ]);
    next();
});