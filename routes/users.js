const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const { moviesPosterDescriptionController, randomUsersDataController } = require('../controllers/thirdPartyControllers');

// const router = require('express').Router();
const passport = require('passport');
const { index, logged, register } = require('../controllers/usersControllers');

// Check for authentication used in app.js as well for base paths
const { checkAuthentication } = require('../middlewares/isAuthenticated')


// Validate user input for login
const { check, validationResult } = require('express-validator');

const loginCheck = [
    check('email').isEmail(),
    check('password').isLength({ min: 3})
];

const loginValidate = (req, res, next) => {
    const info = validationResult(req);
    if(!info.isEmpty()) {
        req.flash('errors', 'Invalid Email or Password');
        return res.redirect('/');
    }
    next();
}

const registerValidate = (req, res, next) => {
  const info = validationResult(req);
  if(!info.isEmpty()) {
    req.flash('errors', 'All Fields Must be Filled')
  }
  next();
}

// Validate user input for register
const { validateInput } = require('../middlewares/validateInputForRegister')

/* GET home page. */
router.get('/', index);

router.post('/login', loginCheck, loginValidate , passport.authenticate('local-login', {
  successRedirect: '/users/logged',
  failureRedirect: '/',
  failureFlash: true
  }));
router.get('/logged', logged)

/// have to use register function staight here since it doens't redirect to / route inside controller it will redirect to users/
router.post('/register', (req, res) => {
  const { name, email, password } = req.body
  if(!name || !email || !password) {
      req.flash('errors', 'All inputs Must Be Filled')
      res.redirect('/')
  } else {
      User.findOne( { email: req.body.email }).then((user) => {
          if(user) {
                  req.flash('errors', 'account already exists');
                  res.redirect('/');
          } else {
              const newUser = new User();
              const salt = bcrypt.genSaltSync(10);
              const hash = bcrypt.hashSync(req.body.password, salt);
  
              newUser.name = req.body.name;
              newUser.email = req.body.email;
              newUser.password = hash;
  
              newUser.save().then((user) => {
                  req.flash('success', 'your account has been created please login')
                  res.redirect('/')

              })
              .catch((error) => console.log(error));
          }
      });

  }
})


router.get('/movies', moviesPosterDescriptionController);
router.get('/random', randomUsersDataController);

module.exports = router;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
