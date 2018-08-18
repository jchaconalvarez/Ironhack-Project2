module.exports = {
  checkSession: (req, res, next) => {
    if (req.session.currentUser) {
      res.locals.currentUser = req.session.currentUser;
      next();
    } else {
      req.flash('info', 'You must be logged in to view this page');
      res.redirect('/auth/login');
    }
  },
};
