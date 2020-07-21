const nodemailer=require('nodemailer');

async function send(to,subject,content){
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            // user: 'daoto990611@gmail.com', // here use your real email
            // pass: 'Daoto990611@' // put your .password correctly (not in this question please)
            user: process.env.EMAIL_USERNAME, //khi chạy trên cmd gõ EMAIL_USERNAME= user mình dùng trc start npm
            pass: process.env.EMAIL_PASSWORD, //khi chạy trên cmd gõ EMAIL_PASSWORD= mk mình dùng trc start npm
         
        }
    });

    return transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to,
        subject,
        text: content,
    });
}

module.exports={send};