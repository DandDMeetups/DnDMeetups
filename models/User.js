//User Model
//Dependencies
//Use model and datatype from sequelize
const { Model, DataTypes } = require('sequelize');
//Use bcrypt for password hashing
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

//Create the User model
class User extends Model {
  //Set up a method to run on a user instance to check the password as provided
  //In the login route against the hashed database password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

//Define the table columns and configuration
User.init(
  {
    //Table column definitions
    //Define an id column
    id: {
      //Use the special sequelize datatypes object to define what type of data it is
      type: DataTypes.INTEGER,
      //This is the sequelize equivalent of SQL's 'Not Null' option
      allowNull: false,
      //Define this column as the primary key
      primaryKey: true,
      //Turn on auto increment
      autoIncrement: true,
    },
    //Define a name column
    name: {
      //Define the data type
      type: DataTypes.STRING,
      allowNull: false,
    },
    //Define a username column
    username: {
      //Define the data type
      type: DataTypes.STRING,
      //Require the data to be entered
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    //Define an email column
    email: {
      //Define the datatype
      type: DataTypes.STRING,
      //Require the data to be entered
      allowNull: false,
      //Do not allow duplicate email values in this table
      unique: true,
      //If allowNull is set to false, the data can be validated before creating the table data
      validate: {
        //This will check the format of the entry as a valid email by pattern checking <string>@<string>.<string>
        isEmail: true,
      },
    },
    //Define a password column
    password: {
      //Define the data type
      type: DataTypes.STRING,
      //Require the data to be entered
      allowNull: false,
      validate: {
        //This means the password must be at least 8 characters long
        len: [8],
      },
    },
  },
  {
    //Table Configuration Options
    //Add hooks for the password hashing operation
    hooks: {
      //Set up a beforeCreate lifecycle hook to hash the password before the object is created in the database
      //Return the new user data object
      beforeCreate: async (newUserData) => {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      //Set up a beforeUpdate lifecycle hook to hash the password before a user object is updated in the database
      beforeUpdate: async (updatedUserData) => {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      },
    },
    //Pass in the imported sequelize connection to the database
    sequelize,
    //Do not automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    //Do not pluralize name of database table
    freezeTableName: true,
    //Use underscores instead of camel-casing
    underscored: true,
    //Make it so the model name stays lowercase in the database
    modelName: 'user',
  }
);

module.exports = User;
