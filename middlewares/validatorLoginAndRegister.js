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

module.exports = loginCheck, loginValidate;