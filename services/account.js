const bcrypt=require('bcrypt');
const db=require('./db');
const Sequelize=require('sequelize');

const Model=Sequelize.Model;

class Account extends Model {
    static async findById(id){
        return Account.findByPk(id);
    }
 }
Account.init({
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    money:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    money_save: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Date: {
        type: Sequelize.DATE,
    },
}, {
    sequelize: db,
    modelName:'account',
});


module.exports= Account;