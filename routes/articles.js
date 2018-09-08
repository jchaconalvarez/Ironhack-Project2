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
// CREATE
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

// UPDATE
router.post('/:id/save', (req, res, next) => {
  const { articleToUpdate } = req.body;
  const { _id } = req.body;

  Articles.findByIdAndUpdate(_id, articleToUpdate)
    .then(() => {
      req.flash('success', 'Article updated');
      res.redirect(`/article/${id}`);
    })
    .catch(next);
});

// DELETE
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

  const checkIfFavorite = article => article._id === id;

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

// READ
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const { usr : user } = req.session;

  Articles.findById(id)
    .then((article) => {
      const articles = [article]; // showArticles.ejs requires an array of articles.
      res.render('articles/view', { articles, user });
    })
    .catch(next);
});

// LIKES
router.get('/:id/like', (req, res, next) => {
  const { id } = req.params;

  Articles.findByIdAndUpdate(id, { $inc: { likes: 1 } })
    .then(() => {
      res.redirect('/user/home');
    })
    .catch(next);
});

router.get('/:id/dislike', (req, res, next) => {
  const { id } = req.params;

  Articles.findByIdAndUpdate(id, { $inc: { likes: -1 } })
    .then(() => {
      res.redirect('/user/home');
    })
    .catch(next);
});

module.exports = router;
