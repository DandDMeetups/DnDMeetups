//Dependencies
//Express connection
const router = require('express').Router();
//User, Post models
const { User, Post, Comment } = require('../../models');
//Express session
const session = require('express-session');
//Authorization helper
const withAuth = require('../../utils/auth');
//Sequelize store to save the session so the user can remain logged in
const SequelizeStore = require('connect-session-sequelize')('session.Store');

//Routes

//GET all users
router.get('/', (req, res) => {
  //Access the User model and run .findAll() method to get all users
  User.findAll({
    //When the data is sent back, exclude the password property
    attributes: { exclude: ['password'] }
  })
  //Return the data as JSON formatted
  .then(dbUserData => res.json(dbUserData))
  //If there is a server error, return that error
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//GET a single user by id
router.get('/:id', (req, res) => {
  //Access the User model and run the findOne() method to get a single user based on parameters
  User.findOne({
    //When the data is sent back, exclude the password property
    attributes: { exclude: ['password'] },
    where: {
      //Use id as the parameter for the request
      id: req.params.id
    },
    //Include the posts the user has created, the posts the user has commented on
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_text', 'created_at']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      }
    ]
  })
  .then(dbUserData => {
    if(!dbUserData) {
      //If no user is found, return an error
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    //Otherwise, return the data for the requested user
    res.json(dbUserData);
  })
  .catch(err => {
    //If there is a server error, return that error
    console.log(err);
    res.status(500).json(err);
  });
});

//POST 
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//POST login route for user
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

//POST log out an existing user
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      //204 status is that a request has succeeded, but client does not need to go to a different page
      res.status(204).end();
    });
  } else {
    //If there is no session, then the logout request will send back a no resource found status
    res.status(404).end();
  }
});

//PUT update an existing user
router.put('/:id', withAuth, (req, res) => {
  //Update method
  //If req.body has exact key/value pairs to match the model, you can just use 'req.body' instead of calling out each property, allowing for updating only key/value pairs that are passed through
  User.update(req.body, {
    //Since there is a hook to hash only the password, the option is noted here
    individualHooks: true,
    //Use the id as the parameter for the individual user to be updated
    where: {
      id: req.params.id
    }
  })
  .then(dbUserData => {
    if(!dbUserData[0]) {
      res.status(404).json({ message: 'No user found with this id'});
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
})

//DELETE delete an existing user
router.delete('/:id', withAuth, (req, res) => {
  //Destroy method
  User.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbUserData => {
    if(!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
