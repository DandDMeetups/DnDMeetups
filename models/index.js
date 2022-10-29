//User model
const User = require('./User');
//Project model
const Project = require('./Project');
//Post model
const Post = require('./Post');
//Comment model
const Comment = require('./Comment');

//Create associations between the models
//User-Post relationship
User.hasMany(Post, {
  foreignKey: 'user_id'
});

//Post-User relationship
Post.belongsTo(User, {
  foreignKey: 'user_id'
});

//Comment-User relationship
Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'cascade',
  hooks: true
});

//Comment-Post relationship
User.hasMany(Post, {
  foreignKey: 'post_id',
  onDelete: 'cascade',
  hooks: true
});

//User-Comment relationship
User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'cascade',
  hooks: true
});

//Post-Comment relationship
Post.hasMany(Comment, {
  foreignKey: 'post_id',
  onDelete: 'cascade',
  hooks: true
});

//User-Project relationship
User.hasMany(Project, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

//Project-User relationship
Project.belongsTo(User, {
  foreignKey: 'user_id'
});

//Export the modules
module.exports = { User, Project, Post, Comment };
