//Dependencies
//Router and database
const router = require('express').Router();
const sequelize = require('../config/connection');
//Models
const { Post, User, Comment, Listing } = require('../models');
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
    .then(dbPostData => {
        //Serialize data before passing to template
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('dashboard', { posts, logged_in: true });
         })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
        
    });
});

//Route to edit a post
router.get('/edit/:id', withAuth, (req, res) => {
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
    .then(dbPostData => {
        //If no post by that id exists, return an error
        if(!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        //Serialize data before passing to template
        const post = dbPostData.get({ plain: true });
        res.render('edit-post', { post, logged_in: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Route to edit the logged in user
router.get('/edit', withAuth, (req, res) => {
    //Access the User model and run the fineOne() method to get a single user based on the parameters
    User.findOne({
        //When the data is sent back, exclude the password property
        attributes: { exclude: ['password'] },
        where: {
            //Use id as the parameter for the request
            id: req.session.user_id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            //If no user is found, return an error
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        //Otherwise, return the data for the requested user
        const user = dbUserData.get({ plain: true });
        res.render('edit-user', { user, logged_in: true });
    })
    .catch(err => {
        //If there is a server error, return that error
        console.log(err);
        res.status(500).json(err);
    })
});

//Export the router
module.exports = router; 