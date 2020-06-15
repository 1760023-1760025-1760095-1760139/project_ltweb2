const db=require('./db');
const Sequelize=require('sequelize');
const Model=Sequelize.Model;

class Article extends Model{
    
}

Article.init({
    link: {
        type:Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    content:{
        type: Sequelize.TEXT,
        allowNull: false,
    },
    publishedAt: {
        type: Sequelize.DATE,
    },
}, {
    sequelize: db,
    modelName:'article',
});

module.exports=Article;