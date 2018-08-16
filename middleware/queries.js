const Users = require('../models/user');
const Articles = require('../models/article');

module.exports = {
  queryCurrentUserRelations: (req, res, next) => {
    if (req.session.currentUser && req.session.usr._id) {
      Users.findById(req.session.usr._id).populate('articles').populate('following')
        .then((user) => {
          req.session.usr = user;
          next();
        });
    } else {
      next();
    }
  },
};
