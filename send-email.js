const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'peace.banking.17ck1@gmail.com',
    pass: 'Daoto990611@'
  }
});

transporter.sendMail({
  from: 'peace.banking.17ck1@gmail.com',
  to: 'daoto990611@gmail.com',
  subject: 'Hello',
  text: 'Hello world?',
}).then(console.log).catch(console.error);
