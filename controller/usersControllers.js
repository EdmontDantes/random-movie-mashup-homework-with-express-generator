
const User = require('../model/User');
const passport = require('passport');


module.exports = {
    index: (req, res) => {
        User.find()
        .then((users) => {
            return res.status(200).json(users);
        })
        .catch((err) => err);
    },
    loginRenderView: (req, res) => {
        res.render('./main/login');
    },
    loginPostPassportAndValidateInput: () => {
    passport.authenticate('local-login', {
        successRedirect: './main/logged',
        failureRedirect: './main/login',
        failureFlash: true
        })
    },

    

}


                