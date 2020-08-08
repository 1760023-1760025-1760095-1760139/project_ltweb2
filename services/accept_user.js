const bcrypt=require('bcrypt');
const db=require('./db');
const Sequelize=require('sequelize');
const User=require('../services/user');
const Interest_rate=require('../services/interest_rate');
const Notification=require('../services/notification');
const Account=require('../services/account');
const Email=require('../services/email');
const Bank=require('../services/bank');

const Model=Sequelize.Model;

class Accept_user extends Model {
    static async findByPk(id){
        return Accept_user.findOne({
            where:{
                id,
            }
        });
    };

    static async findByAll_STK(STK,bank){
        return Accept_user.findAll({
            where:{
                STK,
                bank,
            }
        });
    };

    static async deleteById(id){
        return Accept_user.destroy({
            where:{
                id,
            }
        });
    }

    static async addUser_send(id_send,STK,displayName,money,currency,STK_rec,displayName_rec,bank,bank_name){
        return this.create({
            id_send,
            STK,
            displayName,
            type:1,
            money,
            currency,
            STK_rec,
            displayName_rec,
            bank,
            bank_name,
        }).then(temp => temp);
    }

    static async addUser_receive(id_send,STK,displayName,money,currency,STK_rec,displayName_rec,bank,bank_name){
        return this.create({
            id_send,
            STK,
            displayName,
            type:2,
            money,
            currency,
            STK_rec,
            displayName_rec,
            bank,
            bank_name,
        }).then(temp => temp);
    }

    static async addUser_saving(id_send,STK,displayName,money,total_money,month,date){
        return this.create({
            id_send,
            STK,
            displayName,
            type:3,
            money,
            total_money,
            month,
            date,
        }).then(temp => temp);
    }

    static async addUser_accept_pass(STK,displayName){
        return this.create({
            STK,
            displayName,
            type:4,
        }).then(temp => temp);
    }

    static async addUser_transaction_lock(STK,displayName){
        return this.create({
            STK,
            displayName,
            type:5,
        }).then(temp => temp);
    }

    static async addUser_account_lock(STK,displayName){
        return this.create({
            STK,
            displayName,
            type:6,
        }).then(temp => temp);
    }

 };
 
 Accept_user.init({
    id_send:{
        type: Sequelize.INTEGER,//gửi tiền 
    },
    STK:{
        type: Sequelize.INTEGER,//gửi tiền && tiết kiệm
        allowNull: false,
    },
    displayName:{
        type: Sequelize.STRING,//gửi tiền && tiết kiệm
    },
    type:{
        type: Sequelize.INTEGER,//1: gửi tiền -- 2:người nhận -- 3: gửi tài khoản tiết kiệm -- 4: đổi password -- 5: khóa giao dịch -- 6:lock acc
    },
    money:{
        type: Sequelize.INTEGER,//gửi tiền && tiết kiệm
        allowNull: false,
    },
    currency:{
        type: Sequelize.STRING,//gửi tiền 
    },
    STK_rec:{
        type: Sequelize.INTEGER,//gửi tiền 
    },
    displayName_rec:{
        type: Sequelize.STRING,//gửi tiền && tiết kiệm
    },
    bank:{
        type: Sequelize.STRING,//gửi tiền 
    },
    bank_name:{
        type: Sequelize.STRING,//gửi tiền 
    },
    total_money: {
        type: Sequelize.INTEGER,// tiết kiệm
        allowNull: false,
    },
    month:{
        type: Sequelize.INTEGER,//tiết kiệm
    },
    date:{
        type: Sequelize.STRING,//tiết kiệm
    },
}, {
    sequelize: db,
    modelName:'accept_user',
});


module.exports= Accept_user;