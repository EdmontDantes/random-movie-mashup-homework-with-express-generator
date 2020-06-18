
const User = require('../model/User');
const passport = require('passport');


module.exports = {
    index: (req, res) => {
        res.render('./main/index')
    },
    loginRenderView: (req, res) => {
        res.render('./main/logged');
    },
    loginPostPassportAndValidateInput: () => {
    passport.authenticate('local-login', {
        successRedirect: '/logged',
        failureRedirect: '/',
        failureFlash: true
        })
    },
    logged: (req, res) => {
        res.render('./main/logged')
    }

    

}


                