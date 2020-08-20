const nodemailer=require('nodemailer');

async function send(to_,subject_,content){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {            
            user: "peace.banking.17ck1@gmail.com", 
            pass: "Daoto990611@", 
         
        }
    });

    return transporter.sendMail({
        from: '"Internetbanking"<peace.banking.17ck1@gmail.com>',
        to: to_,
        subject: subject_,
        text: content,
    });
};

module.exports={send};