//Post model
//Dependencies
//Sequel model, datatypes, and database connection
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//Post model extends the sequelize model
class Post extends Model {}
//Define the table columns and configuration, similar to the setup for the User model
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_text: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                //Post must be at lease one character long
                len: [1]
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
)

//Export the model
module.exports = Post;