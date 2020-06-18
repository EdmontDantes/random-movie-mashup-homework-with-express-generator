// possibly useful to put these into middlewares for now they are going to be here
module.exports = {
    localVars: (req, res, next) => {
        res.locals.user = req.user;
        res.locals.errors = req.flash('errors');
        res.locals.success = req.flash('success');
        next()
    }
}


