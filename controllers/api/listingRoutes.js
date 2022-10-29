const router = require('express').Router();
const { Listing, User } = require('../../models');
const withAuth = require('../../utils/auth');

//GET all listings
router.get('/', (req, res) => {
  Listing.findAll({
    //Query configuration
    //From the listing table, include list id, name, category, and text
    attributes: [
      'name',
      'category',
      'description',
      'date_created',
      'user_id'
    ],
    //From the User table, include the listing creator name
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
  //Return the listings
  .then(dbListingData => res.json(dbListingData))
  //If there was a server error, return the error
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//GET a single listing by id
router.get('/:id', (req, res) => {
  Listing.findOne({
    where: {
      //Specify the listing id parameter in the query
      id: req.params.id
    },
    //Query configuration, as with the get all listings route
      attributes: [
        'name',
        'category',
        'description',
      ],
        include: [
          {
            model: User,
            attributes: ['username']
          }
        ]
  })
  //Return the listings
  .then(dbListingData => {
    //If no listing by that id exists, return an error
    if (!dbListingData) {
      res.status(404).json({ message: 'No listing found with this id' });
      return;
    }
    res.json(dbListingData);
    

//POST create a new listing
router.post('/', withAuth, async (req, res) => {
  try {
    const newListing = await Listing.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newListing);
  } catch (err) {
    res.status(400).json(err);
  }
});
});

//Delete a listing
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const listingData = await Listing.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!listingData) {
      res.status(404).json({ message: 'No listing found with this id!' });
      return;
    }

    res.status(200).json(listingData);
  } catch (err) {
    res.status(500).json(err);
  }
});
});

//Export the router
module.exports = router;
