const express = require('express');
const NewsAPI = require('newsapi');

const newsapi = new NewsAPI('da5125e659e04c93929fa448a270da80');

const router = express.Router();
const Articles = require('../models/article');

router.get('/', (req, res, next) => {
  res.redirect('/user/home');
});
router.get('/new', (req, res, next) => {
  res.render('/articles/new', req.session.usr);
});
// CRUD
// Create
router.post('/new', (req, res, next) => {
  const { article : articleToCreate } = req.body;

  Articles.create(articleToCreate)
    .then((article) => {
      console.log(article);
      res.render('articles/article', article);
    })
    .catch(next);
});

// Read
router.get('/:id', (req, res, next) => {
  Articles.findById(req.body.id)
    .then((article) => {
      res.render('article/', article);
    })
    .catch(next);
});

// Update
router.put('/:id/save', (req, res, next) => {
  const { articleToUpdate } = req.body;
  const { id } = req.body;

  Articles.findByIdAndUpdate(id, articleToUpdate)
    .then((article) => {
      req.flash('msg', 'Article updated');
      res.redirect(`/article/${id}`);
    })
    .catch(next);
});
// Delete
router.delete('/:id', (req, res, next) => {
  Articles.findByIdAndRemove(req.body.id)
    .then((article) => {
      req.flash('msg', 'Article removed from your favorites');
      res.redirect('user/profile');
    })
    .catch(next);
});

// FAVORITES
router.put('/:id/addfav', (req, res, next) => {
  // TODO: addFav
  res.redirect('/article/:id');
});

router.delete('/:id/removefav', (req, res, next) => {
  // TODO: deleteFav
  res.redirect('/article/:id');
});

module.exports = router;
