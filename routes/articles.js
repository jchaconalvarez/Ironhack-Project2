const express = require('express');

const router = express.Router();
const Articles = require('../models/article');
const Users = require('../models/user');

router.get('/', (req, res, next) => {
  res.redirect('/user/home');
});

router.get('/new', (req, res, next) => {
  const { usr: user } = req.session;
  res.render('articles/new', { user });
});
// CRUD
// Create
router.post('/new', (req, res, next) => {
  const { body: articleToCreate } = req;

  Articles.create(articleToCreate)
    .then((article) => {
      const { _id: userId } = req.session.usr;
      const { _id: articleId } = article;
      Users.findByIdAndUpdate(userId, { $push: { articles: articleId } }, { new: true })
        .then((user) => {
          const artId = user.articles[user.articles.length - 1];
          Articles.findById(artId)
            .then((article) => {
              res.redirect(`/articles/${article._id}`);
            });
        });
    })
    .catch(next);
});

// Update
router.post('/:id/save', (req, res, next) => {
  const { articleToUpdate } = req.body;
  const { _id } = req.body;

  Articles.findByIdAndUpdate(_id, articleToUpdate)
    .then((article) => {
      req.flash('success', 'Article updated');
      res.redirect(`/article/${id}`);
    })
    .catch(next);
});

// Delete ok
router.post('/:id/delete', (req, res, next) => {
  const { id } = req.params;
  Articles.findByIdAndRemove(id)
    .then(() => {
      req.flash('success', 'Article removed');
      res.redirect('/user/profile');
    })
    .catch(next);
});

// FAVORITES
router.post('/:id/addfav', (req, res, next) => {
  const { id } = req.params;
  const user = req.session.usr;

  const checkIfFavorite = (article) => {
    return article._id === id;
  };

  const updateFavorites = new Promise((resolve, reject) => {
    if (user.favorites.some(checkIfFavorite)) {
      resolve(Users.findByIdAndUpdate(user._id, { $pull: { favorites: id } }));
    } else {
      resolve(Users.findByIdAndUpdate(user._id, { $push: { favorites: id } }));
    }
  });

  updateFavorites
    .then(() => {
      res.redirect('/user/home');
    })
    .catch(next);
});

// Read OK
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const { usr : user } = req.session;

  console.log(req.params);

  Articles.findById(id)
    .then((article) => {
      console.log(article);

      res.render('articles/view', { article, user });
    })
    .catch(next);
});


module.exports = router;
