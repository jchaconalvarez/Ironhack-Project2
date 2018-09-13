module.exports = {
  checkSession: (req, res, next) => {
    if (req.session.usr) {
      res.locals.currentUser = req.session.usr;
      req.session.currentUser = req.session.usr.name;
      delete req.session.usr.password;
      delete res.locals.currentUser.password;
      console.log('-');
      next();
    } else {
      req.flash('info', 'You must be logged in to view this page');
      res.redirect('/auth/login');
    }
  },
};
