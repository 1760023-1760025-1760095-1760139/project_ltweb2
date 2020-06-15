const db=require('./db');
const Sequelize=require('sequelize');
const User=require('./user');
const Model=Sequelize.Model;

class Todo extends Model{
    async markAsDone(){
        this.done=true;
        return this.save();
    }

    static async findAllNotDone(userId){
        return Todo.findAll({
            where : {
                done : false,
                userId,
            }
        });
    }
    
    static async findById(id){
        return Todo.findByPk(id);
    }
    
    
    
    static add(name,userId){
        return Todo.create({name,done:false,userId});;
    }
}

Todo.init({
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    done:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: db,
    modelName:'todo',
});

User.hasMany(Todo);
Todo.belongsTo(User);

module.exports=Todo;