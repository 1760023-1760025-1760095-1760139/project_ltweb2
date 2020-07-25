const bcrypt=require('bcrypt');
const db=require('./db');
const Sequelize=require('sequelize');

const Model=Sequelize.Model;

class Transfer extends Model {
    static async findByid_receiver(id_acc){
        return Transfer.findOne({
            where: {
                id_acc,
            }
        });
    }

    static async findByid_receiver(id_acc){
        return Transfer.findOne({
            where: {
                id_acc,
            }
        });
    }
 }
Transfer.init({
    id_acc:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    displayName_acc:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    id_receiver:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    displayName_receiver: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    money: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
    },
    accept: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    OTP: {
        type: Sequelize.STRING,
    },
}, {
    sequelize: db,
    modelName:'transfer',
});


module.exports= Transfer;