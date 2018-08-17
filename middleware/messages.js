exports.notifications = (req, res, next) => {
  // res.locals.messages = req.flash();
  res.locals.errorMessages = req.flash('error');
  res.locals.infoMessages = req.flash('info');
  res.locals.dangerMessages = req.flash('danger');
  res.locals.successMessages = req.flash('success');
  res.locals.warningMessages = req.flash('warning');

  console.log(res.locals.errorMessages);
  console.log(res.locals.infoMessages);
  console.log(res.locals.dangerMessages);
  console.log(res.locals.successMessages);
  console.log(res.locals.warningMessages);
  next();
};
