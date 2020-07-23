const {Router}=require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler=require('express-async-handler');
const crypto=require('crypto');
const User=require('../services/user');
const Email=require('../services/email');

const router = new Router();

router.get('/register', function (req,res){
    res.render('register');
});

router.post('/register',[    
    body('displayname')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty(),//k dc trống
    body('email')
        .isEmail()//dữ liệu nhập vào có phải là email hay k
        .normalizeEmail()
        .custom(async function(email){
            const found=await User.findByEmail(email);
            if(found){
                throw Error('User exists');
            }
            return true;
        }),
    body('password')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty()//k dc trống
        .isLength({min:6,max:50}),
    body('confirm_password')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty()//k dc trống
        .isLength({min:6,max:50}),
    body('sdt')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty()//k dc trống
        .isLength(10),
    body('paper_type')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty(),//k dc trống
    body('paper_number')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty()//k dc trống
        .isLength({min:8,max:20}),
    body('date_of_issue')
        .trim()//khi load lại nó sẽ làm ms
        .notEmpty()//k dc trống

],asyncHandler(async function (req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()||(req.body.password!=req.body.confirm_password)) {
        return res.status(422).render( 'home', {errors: errors.array() });
    }
    const user=await User.create({
        email:req.body.email,
        displayName: req.body.displayname,
        password: User.hashPassword(req.body.password),
        SDT:req.body.sdt,
        paper_type:req.body.paper_type,
        paper_number:req.body.paper_number,
        date_of_issue:req.body.date_of_issue,
        OTP: crypto.randomBytes(3).toString('hex').toUpperCase(),
    });

    await Email.send(user.email,'Mã kích hoạt tài khoản',`http://localhost:3000/${user.id}/${user.OTP}`); //khi chạy trên cmd gõ BASE_URL= http://locahost:3000 mình dùng trc start npm
    res.render('not_activated');
}));





module.exports = router;