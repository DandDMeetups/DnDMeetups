//Dependencies
//Express connection
const router = require('express').Router();
//Comment model
const { Comment } = require('');
//Authorization helper
const withAuth = require('../../utils/auth');

//Routes

//Get comments
router.get('/', (req, res) => {
    //Access the Comment model and run findAll() method to get all comments
    Comment.findAll()
    //Return the data as JSON formatted
    .then(dbCommentData => res.json(dbCommentData))
    //If there is a server error, return that error
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Post a new comment
router.post('/', withAuth, (req, res) => {
    //Check the session, and if it exists, create a comment
    if(req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            //Use the user id from the session
            user_id: req.session.user_id
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

//Delete a comment
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if(!dbCommentData) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Export the router
module.exports = router;