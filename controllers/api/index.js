//An index file to gather the API routes and export them for use

//Dependencies
//Server connection
const router = require('express').Router();
//User routes
const userRoutes = require('./userRoutes');
//Post routes
const postRoutes = require('./post-routes');
//Project routes
const listingRoutes = require('./ListingRoutes');
//Comment routes
const commentRoutes = require('./comment-routes');

//Define route path for the API to use
router.use('/users', userRoutes);
router.use('/listing', listingRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

//Export the router
module.exports = router;
