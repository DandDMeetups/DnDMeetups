//Dependencies
//Router and database
const router = require('express').Router();
const sequelize = require('../config/connection');
//Models
const { Post, User, Comment } = require('../models');
//Authorization middleware
const withAuth = require('../utils/auth');

//Route to render dashboard page
router.get('/', withAuth, (req, res) => {
    //All of the users posts are obtained from the database
    Post.findAll({
        where: {
            //Use the ID from the session
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'post_text',
            'title',
            'created_at',
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then() => {
        
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
        
    });
});

//Route to edit a post
router.get('', withAuth, (req, res) => {
    //All of the users posts are obtained from the database
    Post.fineOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_text',
            'title',
            'created_at',
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then( => {
        
    })
})