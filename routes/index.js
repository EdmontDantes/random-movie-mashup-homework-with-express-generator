const router = require('express').Router();
const { index, loginRenderView, loginPostPassportAndValidateInput } = require('../controller/usersControllers');

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
        return res.redirect('/login');
    }
    next();
}


/* GET home page. */
router.get('/', index);
router.get('/login', loginRenderView);
router.post('/login', loginCheck, loginValidate , loginPostPassportAndValidateInput);


// app.post('/register', (req, res) => {
//   User.findOne( { email: req.body.email }).then((user) => {
//       if(user) {
//           res.status(400).json({ message: 'User Exists'});
//           req.flash('error', 'Account exists');
//           return res.redirect(301, '/register');
//       } else {
//           const newUser = new User();
//           const salt = bcrypt.genSaltSync(10);
//           const hash = bcrypt.hashSync(req.body.password, salt);

//           newUser.name = req.body.name;
//           newUser.email = req.body.email;
//           newUser.password = hash;

//           newUser.save().then((user) => {
//               req.login(user, (err) => {
//                   if(err) {
//                       res.status(500).json({ confirmation: false, message: 'Server Error'});
//                   } else {
//                       res.redirect('/thankyou');
//                   }
//               });
//           })
//           .catch((error) => console.log(error));
//       }
//   })
// })


// const loginCheck = [
//   check('email').isEmail(),
//   check('password').isLength({ min: 3})
// ];

// const loginValidate = (req, res, next) => {
//   const info = validationResult(req);
//   if(!info.isEmpty()) {
//       req.flash('errors', 'Invalid Email or Password');
//       return res.redirect('/login');
//   }
//   next();
// }
                  
// app.post('/login', loginCheck, loginValidate, passport.authenticate('local-login', {
//   successRedirect: '/logged',
//   failureRedirect: '/login',
//   failureFlash: true
// })
// )



module.exports = router;
