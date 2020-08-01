const bcrypt=require('bcrypt');
const db=require('./db');
const Sequelize=require('sequelize');

const Model=Sequelize.Model;

class User extends Model {
    static async findById(id){
        return User.findByPk(id);
    }

    static async findByEmail(email){
        return User.findOne({
            where: {
                email,
            }
        });
    } 

    static async findBySTK_Bank(id,bank,staff){
        return User.findOne({
            where: {
                id,
                bank,
                staff,
            }
        });
    }

    static async findByAll_STK_Bank(bank,staff){
        return User.findAll({
            where: {
                bank,
                staff,
            }
        });
    }

    static hashPassword(password){
        return bcrypt.hashSync(password,10);
    }

    static verifyPassword(password,passwordHash){
        return bcrypt.compareSync(password,passwordHash);
    }
 };
User.init({
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    displayName:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    SDT: {
        type: Sequelize.INTEGER,
    },
    paper_type: {
        type: Sequelize.STRING,
    },
    paper_number: {
        type: Sequelize.INTEGER,
    },
    birthday: {
        type: Sequelize.STRING,
    },
    bank: {
        type: Sequelize.STRING,
    },
    OTP: {//lúc lập nick nên k cần xác thực bên staff
        type: Sequelize.STRING,
    },
    forgot: {//đổi mk khẩu khi quên k cần xác thực bên staff
        type: Sequelize.STRING,
    },
    update_OTP: {//đổi mk khẩu khi đang trong tài khoản cần xác thực bên staff kèm hình ảnh cmnd
        type: Sequelize.STRING,
    },
    update_password: {
        type: Sequelize.STRING,
    },
    authentication:{//gửi mã otp yêu cầu user xác thực
        type: Sequelize.STRING,
    },
    authentication_check:{//khi user xác thực sẽ gửi cho staff để chấp nhận/từ chối
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    lock: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    staff: {//phân quyền
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: db,
    modelName:'user',
});


module.exports= User;