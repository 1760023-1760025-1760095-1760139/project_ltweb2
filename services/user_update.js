const bcrypt=require('bcrypt');
const db=require('./db');
const Sequelize=require('sequelize');

const Model=Sequelize.Model;

class User_Update extends Model {
    static async findById(id){
        return User_Update.findOne({
            where: {
                id,
            }
        });
    };

    static async deleteById(id){
        return User_Update.destroy({
            where:{
                id,
            }
        });
    };

    static async findByEmail(email){
        return User_Update.findOne({
            where: {
                email,
            }
        });
    };

    static hashPassword(password){
        return bcrypt.hashSync(password,10);
    }
 };
 
 User_Update.init({
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    displayName:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    SDT: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    paper_type: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    paper_number: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    date_of_issue: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    OTP: {
        type: Sequelize.STRING,
    },
    check:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: db,
    modelName:'user_update',
});


module.exports= User_Update;