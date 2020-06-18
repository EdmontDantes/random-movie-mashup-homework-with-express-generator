const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// bringing dotenv for Mongodb_URL and others should a need will arise
require('dotenv').config();

// Custom Packages not included in expres-gen
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');


// express validator using this package to validate userinput for login/register for passport package this is helper pack
// const { check, validationResult } = require('express-validator');

// using connect-mongo here by using let
let MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

// MiddleWares
const { localVars } = require('./middlewares/localVariables');

// using outside files such as models, routes
const User = require('./model/User');

//
//using Authentication to view thirdparty Base path, used the same in all routes for more security 
const { checkAuthentication } = require('./middlewares/isAuthenticated')
const indexRouter = require('./routes/index');
const thirdParty = require('./routes/thirdParty');

const app = express();

// Passport Library middleware 
require('./lib/passport');

// connect to mongodb via mongoose possibly not needed after production
// replaced by session need to bring in some 404 page generating package with not found routes later since routes that don't exist hang the app
mongoose
        .connect(process.env.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true
        })
        .then(() => {
            console.log('Mongodb Connected')
        })
        .catch(err => console.log(`Mongo error: ${err}`));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// use morgan for http requests console.logs in terminal
app.use(morgan('dev'));

// express json and urlencoding 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// use cookies and session to connect to MongoDB
app.use(cookieParser());
app.use(cookieParser()); // has to be first
app.use(session({ //after cookieParser
    resave: false,
    saveUninitialized: false,
    useCreateIndex: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        mongooseConnection: mongoose.connection,
        autoReconnect: true
    }),
    cookie: {
        secure: false,
        maxAge: 1000 * 60 *60 * 24
    }
}))

// using flash, passport.initialize and pass.sess
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// use public files here
app.use(express.static(path.join(__dirname, 'public')));


// !!! testing purposes only REMEBER TO REMOVE LATER
app.use((req, res, next) => {
    console.log('Session', req.session);
    console.log('User', req.user);
    next();
})


// local Variables middleware goes here
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    next()
})

// base routes
app.use('/', indexRouter);
app.use('/thirdparty', thirdParty);

// app.get('/', (req, res) => {
//     // res.render('index')
//     User.find()
//     .then((users) => {
//         return res.status(200).json(users);
//     })
//     .catch((err) => err);
// });

// const auth = (req ,res, next) => {
    //     if(req.isAuthenticated()) {
        //         next();
        
        //     } else {
            //         return res.send('You are not authorized to view this page')
            //     }
            // }


// app.get('/logged',(req, res) => {
// // if(req.isAuthenticated()) {


// // } else {
//     //     return res.send('You are not authorized to view this page')
//     // }
//     res.render('./main/logged');
// })

// app.get('/login', (req, res) => {
//     res.render('./main/login');
// })

// app.get('/thankyou', (req, res) => {
//     res.render('./main/thankyou');
// })

// app.get('/register', (req, res) => {
//     res.render('./main/register');
// })

// app.get('/bootstrap', (req, res) => {
//     res.render('./main/bootstrap');
// })

// const validateInput = (req, res, next) => {
//     const { email, password } = req.body
//     if(!email || password) {
//         req.flash('errors', 'All inputs Must Be Filled')
//     } else {
//         return res.redirect('/login')
//     }
//     next();
// }

// const loginCheck = [
//     check('email').isEmail(),
//     check('password').isLength({ min: 3})
// ];

// const loginValidate = (req, res, next) => {
//     const info = validationResult(req);
//     if(!info.isEmpty()) {
//         req.flash('errors', 'Invalid Email or Password');
//         return res.redirect('/login');
//     }
//     next();
// }
                    
// app.post('/login', loginCheck, loginValidate, passport.authenticate('local-login', {
//     successRedirect: '/logged',
//     failureRedirect: '/login',
//     failureFlash: true
// })
// )




// app.get('/logout', (req, res) => {
//     req.logout();
//     req.flash('success', 'You are now logged out');
//     res.redirect('/bootstrap');
// })


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
