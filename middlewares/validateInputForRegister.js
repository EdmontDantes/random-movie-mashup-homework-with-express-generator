module.exports = {
    validateInput: (req, res, next) => {
        const { name, email, password } = req.body
        if(!name || !email || !password) {
            req.flash('errors', 'All inputs Must Be Filled')
        } else {
            req.flash('success', 'You Have Successfully registered')
        }
        next();
        }
}