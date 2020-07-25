const bcrypt=require('bcrypt');
const db=require('./db');
const Sequelize=require('sequelize');

const Model=Sequelize.Model;

class Money_load extends Model {
    static async findById(id){
        return Money_load.findByPk(id);
    }

    static async findByName(Name){
        return Money_load.findOne({
            where: {
                Name,
            }
        });
    }
 }
 Money_load.init({
    Name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    code:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    same_bank:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    other_banks: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: db,
    modelName:'money_load',
});


module.exports= Money_load;