const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const crypto=require('crypto');
const User=require('../services/user');
const Account=require('../services/account');
const Bank=require('../services/bank');
const Email=require('../services/email');

const path = require('path');
// var multer = require('multer')
// var upload = multer({ dest: path.join(__dirname, '..', 'uploads') })

const router = new Router();

var errors=[];
router.get('/', asyncHandler(async function (req,res){
    const user= await User.findById(req.session.userId);
    const bank= await Bank.findByAll();
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
        return res.redirect('/customer');
    }
    else {
        return res.render('register',{errors,bank});
    }
}));

router.post('/',[    
    body('displayname')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong Displayname!!!'),//k dc trống
    body('email')
        .notEmpty().withMessage('Khong duoc de trong Email!!!')
        .isEmail().withMessage('Email not verified!!!')//dữ liệu nhập vào có phải là email hay k
        .normalizeEmail()
        .custom(async function(email){
            const found=await User.findByEmail(email);
            if(found){
                throw Error('Email already exists!!!');
            }
            return true;
        }),
    body('password')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong Password!!!')//k dc trống
        .isLength({min:6,max:50}).withMessage('Password Ki tu 6->50!!!'),
    body('confirm_password')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong Confirm Password!!!')//k dc trống
        .custom((value, { req }) => {
            if (value != req.body.password) {
                throw new Error('Confirm password is wrong!!!');
            }
            return true;
        }),
    body('sdt')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong SDT!!!')//k dc trống
        .isLength({min:10,max:10}).withMessage('SDT Ki tu = 10!!!'),
    body('paper_type')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong Paper Type!!!'),//k dc trống
    body('paper_number')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong Paper Number!!!')//k dc trống
        .isLength({min:8,max:20}).withMessage('Paper Number Ki tu 8->20!!!'),
    body('birthday')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty().withMessage('Khong duoc de trong Date Of Issue!!!'),//k dc trống

],asyncHandler(async function (req,res){
    const bank= await Bank.findByAll();
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.render('register', {errors,bank});
    }
    errors = [];
    const user=await User.create({
        email:req.body.email,
        displayName: (req.body.displayname).toUpperCase(),
        password: User.hashPassword(req.body.password),
        bank:req.body.code,
        SDT:req.body.sdt,
        paper_type:req.body.paper_type,
        paper_number:req.body.paper_number,
        birthday:req.body.birthday,
        OTP: crypto.randomBytes(3).toString('hex').toUpperCase(),
    });

    await Account.create({
        id:user.id,
        email:user.email,
        money:0,
        money_USD:0,
        money_save:0,
    })

    await Email.send(user.email,'Mã kích hoạt tài khoản',`http://localhost:3000/${user.id}/${user.OTP}`); //khi chạy trên cmd gõ BASE_URL= http://locahost:3000 mình dùng trc start npm
    return res.render('login_not_activated');
}));
module.exports = router;