const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const crypto=require('crypto');
const User=require('../services/user');
const Email=require('../services/email');

const router = new Router();

router.get('/', function (req,res){
    res.render('home');
});

router.post('/Signup',[    
    body('displayname_sign')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty(),//k dc trống
    body('email_sign')
        .isEmail()//dữ liệu nhập vào có phải là email hay k
        .normalizeEmail()
        .custom(async function(email){
            const found=await User.findByEmail(email);
            if(found){
                throw Error('User exists');
            }
            return true;
        }),
    body('password_sign')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty()//k dc trống
        .isLength({min:6,max:50}),
    body('confirm_password_sign')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty()//k dc trống
        .isLength({min:6,max:50}),
    body('sdt')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty()//k dc trống
        .isLength(10),
    body('paper_type_sign')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty(),//k dc trống
    body('paper_number_sign')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty()//k dc trống
        .isLength({min:8,max:20}),
    body('date_of_issue_sign')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty()//k dc trống

],asyncHandler(async function (req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()||(req.body.password_sign!=req.body.confirm_password_sign)) {
        return res.status(422).render( 'home', {errors: errors.array() });
    }
    const user=await User.create({
        email:req.body.email_sign,
        displayName: req.body.displayname_sign,
        password: User.hashPassword(req.body.password_sign),
        SDT:req.body.sdt,
        paper_type:req.body.paper_type_sign,
        paper_number:req.body.paper_number_sign,
        date_of_issue:req.body.date_of_issue_sign,
        OTP: crypto.randomBytes(3).toString('hex').toUpperCase(),
    });

    //await Email.send(user.email,'Mã kích hoạt tài khoản',`${process.env.BASE_URL}/${user.id}/${user.token}`); //khi chạy trên cmd gõ BASE_URL= http://locahost:3000 mình dùng trc start npm
    res.redirect('/home');
}));

module.exports = router;