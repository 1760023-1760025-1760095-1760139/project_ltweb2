const db=require('./db');
const Sequelize=require('sequelize');
const crypto=require('crypto');
const User=require('../services/user');
const Bank=require('../services/bank');
const Model=Sequelize.Model;

//type 1: thông báo chuyển tiền
//type 2: thông báo nhận tiền từ khách hàng chuyển
//type 3: thông báo nhận tiền từ nhân viên chuyển
class Transfer extends Model {
    //hàm này tìm theo id 
    static async findById(id){
        return Transfer.findByPk(id);
    }

    //hàm này tìm tất cả email của STK đó
    static async findByEmail(email){
        Transfer.findAll({
            where: {
                email,
            }
        }).then(arr => arr.forEach(temp =>{
            if(temp.OTP!=null){
                Transfer.destroy({
                    where:{
                        id: temp.id,
                    }
                });
            }
        }));
        return Transfer.findAll({
            where: {
                email,
            }
        });
    }

    //hàm này tìm tất cả email của STK đó theo date
    static async findByEmail_date(email,date){
        Transfer.findAll({
            where: {
                email,
            }
        }).then(arr => arr.forEach(temp =>{
            if(temp.OTP!=null){
                Transfer.destroy({
                    where:{
                        id: temp.id,
                    }
                });
            }
        }));
        return Transfer.findAll({
            where: {
                email,
                date,
            }
        });
    }

    //hàm này thêm thông tin người gửi
    static async addTransfer_sender(STK_acc,STK,money,description){
        return this.create({
            STK_acc,
            STK,
            type:1,
            money,
            description,
            OTP:crypto.randomBytes(3).toString('hex').toUpperCase(),
        }).then(temp => temp);
    }

    //hàm này thêm thông tin người nhận
    static async addTransfer_receiver(STK_acc,STK,money,description){
        return this.create({
            STK_acc,
            STK,
            type:2,
            money,
            description,
        }).then(temp => temp);
    }

    //hàm này thêm thông tin bank
    static async addTransfer_bank(STK_acc,money,bank){
        return this.create({
            STK_acc,
            type:3,
            money,
            bank,
        }).then(temp => temp);
    }

    //hàm này lọc ra tất cả hnay người đó gửi có quá mức quy định hay không(200tr)
    static async findAllSTK_sender(STK_acc,date){
        var sum=0;
        Transfer.findAll({
            where: {
                STK_acc,
                date,
                type:1,
            }}).then(arr => arr.forEach(temp =>{
                if(temp.OTP==null){
                    sum+=temp.money
                }
                else{
                    Transfer.destroy({
                        where:{
                            id: temp.id,
                        }
                    })
                }
            }));
        if(sum<200000000){
            return true;
        }
        else{
            return false;
        }
    }

    //hàm này xóa id khi ng gửi đó đã gửi quá hạn số tiền trong 1 ngày gửi
    static async deleteById(id){
        return Transfer.destroy({
            where:{
                id,
            }
        });
    }

    //hàm này kiểm tra 2 acc cùng ngân hàng k và lưu tax của bank đó lại
    static async check_Bank(id){
        const transfer = await Transfer.findOne({
            where: {
                id,
            }
        });
        const user_acc = await User.findById(transfer.STK_acc);
        const user_rec = await User.findById(transfer.SKT);
        
        const bank_acc = await Bank.findByCode(transfer.bank);

        if(user_acc.bank===user_rec.bank){
            transfer.tax=bank_acc.same_bank;
            return transfer.save();
        }
        else{
            transfer.tax=bank_acc.other_banks
            return transfer.save();
        }
    }

 };

Transfer.init({
    STK_acc: {
        type: Sequelize.STRING,
    },
    STK:{
        type: Sequelize.STRING,
    },
    type:{
        type: Sequelize.INTEGER,
    },
    money: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW(),
    },
    tax: {
        type: Sequelize.INTEGER,
    },
    bank: {
        type: Sequelize.STRING,
    },
    OTP: {
        type: Sequelize.STRING,
    },
}, {
    sequelize: db,
    modelName:'transfer',
});

module.exports= Transfer;