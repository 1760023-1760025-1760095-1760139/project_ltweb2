const db=require('./db');
const Sequelize=require('sequelize');

const Model=Sequelize.Model;

class Notification extends Model {
    static async findById(id){
        return Notification.findByPk(id);
    }

    static async findByIdAll(STK){ 
        return Notification.findAll({
            where: {
                STK,
            }
        });
    }

    static async findById_DateAll(STK,date){
        return Notification.findAll({
            where:{
                STK,
                date,
            }
        }).then(temp => temp);
    }

    static async addNotification(STK,notification){
        return this.create({
            STK,
            notification,
        }).then(temp => temp);
    }

    static async addDate(date){
        return this.create({
            date,
        }).then(temp => temp);
    }

    static async deleteById(id){
        return Notification.destroy({
            where:{
                id,
            }
        });
    }
 };
Notification.init({
    STK:{
        type: Sequelize.INTEGER,
    },
    notification:{
        type: Sequelize.STRING(500),
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW(),
    },
}, {
    sequelize: db,
    modelName:'notification',
});

module.exports= Notification;