const db=require('./db');
const Sequelize=require('sequelize');
const crypto=require('crypto');
const User=require('../services/user');
const Bank=require('../services/bank');
const Account=require('../services/account');
const Transfer=require('../services/transfer');
const Email=require('../services/email');


//hàm này gửi mã OTP cho người gửi
async function sendOTP(id_transfer){
    const transfer= await Transfer.findByid(id_transfer);
    const user= await User.findById(transfer.STK_acc);

    Email.send(user.email,'Mã OTP',`${transfer.OTP}.`);
}

//hàm này sẽ thanh toán tài khoản và gửi thông báo dựa vào id
async function transfer_notification(id){
    const transfer = await Transfer.findByid(id);

    //truy vấn thông tn ng gửi
    const acc= await Account.findById(transfer.STK_acc);
    const user_acc= await User.findById(transfer.STK_acc);
    const bank_acc= await Bank.findByCode(user_acc.bank);

    //truy vấn thông tn ng nhận
    const acc_rec= await Account.findById(transfer.STK);
    const user_rec= await User.findById(transfer.STK);
    const bank_rec= await Bank.findByCode(user_rec.bank);
    
    //khoản tiền gửi sẽ bị trừ vào tk ng gửi
    acc.money=acc.money-transfer.money-transfer.tax;
    acc.save();

    //gửi email báo số dư cho ng gửi
    Email.send(user_acc.email,'Thay đổi số dư tài khoản',`Số dư tài khoản vừa giảm ${transfer.money} VND vào ${transfer.createdAt}. \n
        Số dư hiện tại: ${acc.money} VND. \n
        Mô tả: ${transfer.description}. \n
        Gửi cho số tài hoản ${transfer.STK} của ngân hàng ${bank_rec.Name}. \n
        Tên người nhận ${user_rec.displayName}.\n
        Số tiền: ${transfer.money} VND phí ${transfer.tax} VND.`);

    //khoản tiền gửi sẽ được cộng vào tk ng nhận
    acc_rec.money=acc_rec.money+transfer.money;
    acc_rec.save();

    //gửi email báo số dư cho ng nhận
    Email.send(user_rec.email,'Thay đổi số dư tài khoản',`Số dư tài khoản vừa tăng ${transfer.money} VND vào ${transfer.createdAt}. \n
        Số dư hiện tại: ${acc_rec.money} VND. \n
        Mô tả: ${transfer.description}. \n
        Nhận từ số tài hoản ${transfer.STK_acc} của ngân hàng ${bank_acc.Name}. \n
        Tên người gửi ${user_acc.displayName}.\n
        Số tiền: ${transfer.money}.`);
}

//hàm này sẽ tăng số tiền của bạn khi gửi ngân hàng
async function transfer_notification_bank(id){
    //truy vấn id của ngân hàng gửi
    const transfer = await Transfer.findByid(id);

    //truy vấn ng nhận
    const user_acc= await User.findById(transfer.STK_acc);
    const acc= await Account.findById(transfer.STK_acc);

    //truy vấn tên của ngân hàng gửi
    const bank= await Bank.findByCode(transfer.bank);
    
    //khoản tiền gửi sẽ được cộng vào tk ng nhận
    acc.money=acc.money-transfer.money;
    acc.save();

    //gửi email báo số dư cho ng nhận
    Email.send(user_acc.email,'Thay đổi số dư tài khoản',`Số dư tài khoản vừa tăng ${transfer.money} VND vào ${transfer.createdAt}. \n
        Số dư hiện tại: ${acc.money} VND. \n
        Mô tả: \n
        Nhận từ ngân hàng: ${bank.Name}. \n
        Số tiền: ${transfer.money}.`);
}

//hàm này sẽ xuất ra tất cả các giao dịch của mình
const allTransactions = async (email)=>{
    var arr=[];//khởi tạo mảng chữa các thông báo

    await Transfer.findByEmail(email).then(all => all.forEach(async temp => {
        if(temp.type==1){ //thông báo khi chuyển
            const acc= await Account.findById(temp.STK_acc);
            
            const user_rec= await User.findById(temp.STK);
            const bank_rec= await Bank.findByCode(user_rec.bank);

            arr_temp=[`Số dư tài khoản vừa giảm ${temp.money} VND vào ${temp.createdAt}. \n
            Số dư hiện tại: ${acc.money} VND. \n
            Mô tả: ${temp.description}. \n
            Gửi cho số tài hoản ${temp.STK} của ngân hàng ${bank_rec.Name}. \n
            Tên người nhận ${user_rec.displayName}.\n
            Số tiền: ${temp.money} VND phí ${temp.tax} VND.`,`${temp.date}`];
            arr.push(arr_temp);
        }
        else if(temp.type==2){ //thông báo khi nhận từ tk khác
            const acc= await Account.findById(temp.STK_acc);
            
            const user_rec= await User.findById(temp.STK);
            const bank_rec= await Bank.findByCode(user_rec.bank);

            arr_temp=[`Số dư tài khoản vừa tăng ${temp.money} VND vào ${temp.createdAt}. \n
            Số dư hiện tại: ${acc.money} VND. \n
            Mô tả: ${temp.description}. \n
            Nhận từ số tài hoản ${temp.STK} của ngân hàng ${bank_rec.Name}. \n
            Tên người gửi ${user_rec.displayName}.\n
            Số tiền: ${temp.money}.`,`${temp.date}`];
            arr.push(arr_temp);
        }
        else{ //thông báo khi nhận từ ngân hàng
            const acc= await Account.findById(temp.STK_acc);
            
            const bank= await Bank.findByCode(temp.bank);

            arr_temp=[`Số dư tài khoản vừa tăng ${temp.money} VND vào ${temp.createdAt}. \n
            Số dư hiện tại: ${acc.money} VND. \n
            Mô tả: \n
            Nhận từ ngân hàng: ${bank.Name}. \n
            Số tiền: ${temp.money}.`,`${temp.date}`];
            arr.push(arr_temp);
        }
        return arr;
    }));
}

//hàm này sẽ xuất ra tất cả các giao dịch của mình theo date
const allTransactions_date = async (email,date)=>{
    var arr=[];//khởi tạo mảng chữa các thông báo

    await Transfer.findByEmail_date(email,date).then(all => all.forEach(async temp => {
        if(temp.type==1){ //thông báo khi chuyển
            const acc= await Account.findById(temp.STK_acc);
            
            const user_rec= await User.findById(temp.STK);
            const bank_rec= await Bank.findByCode(user_rec.bank);

            arr.push(`Số dư tài khoản vừa giảm ${temp.money} VND vào ${temp.createdAt}. \n
                Số dư hiện tại: ${acc.money} VND. \n
                Mô tả: ${temp.description}. \n
                Gửi cho số tài hoản ${temp.STK} của ngân hàng ${bank_rec.Name}. \n
                Tên người nhận ${user_rec.displayName}.\n
                Số tiền: ${temp.money} VND phí ${temp.tax} VND.`)
        }
        else if(temp.type==2){ //thông báo khi nhận từ tk khác
            const acc= await Account.findById(temp.STK_acc);
            
            const user_rec= await User.findById(temp.STK);
            const bank_rec= await Bank.findByCode(user_rec.bank);

            arr.push(`Số dư tài khoản vừa tăng ${temp.money} VND vào ${temp.createdAt}. \n
                Số dư hiện tại: ${acc.money} VND. \n
                Mô tả: ${temp.description}. \n
                Nhận từ số tài hoản ${temp.STK} của ngân hàng ${bank_rec.Name}. \n
                Tên người gửi ${user_rec.displayName}.\n
                Số tiền: ${temp.money}.`)
        }
        else{ //thông báo khi nhận từ ngân hàng
            const acc= await Account.findById(temp.STK_acc);
            
            const bank= await Bank.findByCode(temp.bank);

            arr.push(`Số dư tài khoản vừa tăng ${temp.money} VND vào ${temp.createdAt}. \n
                Số dư hiện tại: ${acc.money} VND. \n
                Mô tả: \n
                Nhận từ ngân hàng: ${bank.Name}. \n
                Số tiền: ${temp.money}.`)
        }
        return arr;
    }));
}

module.exports= {sendOTP, transfer_notification, transfer_notification_bank, allTransactions, allTransactions_date};