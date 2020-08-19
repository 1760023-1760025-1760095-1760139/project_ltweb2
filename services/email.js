const nodemailer=require('nodemailer');
process.env.ADMIN_EMAIL = 'peace.banking.17ck1@gmail.com';
process.env.ADMIN_PASSWORD = 'Daoto990611@';
process.env.BASE_URL = 'http://localhost:3000';

async function send(to_,subject_,content){
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {            
            user: process.env.ADMIN_EMAIL, 
            pass: process.env.ADMIN_PASSWORD, 
         
        }
    });

    return transporter.sendMail({
        from: `"Internetbanking "<${process.env.ADMIN_EMAIL}>`,
        to: to_,
        subject: subject_,
        text: content,
    });
};

module.exports={send};