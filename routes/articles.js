const express = require('express');
const NewsAPI = require('newsapi');

const newsapi = new NewsAPI('da5125e659e04c93929fa448a270da80');

const router = express.Router();
const Articles = require('../models/article');

router.get('/', (req, res, next) => {
  //TODO: favoritos
  //res.render
})
// CRUD
// Create
router.get('/new', (req, res, next) => {
  console.log(req.flash);
  const { articles } = req.session.usr;
  const { msgs } = req.flash;
  res.render('user/home', { articles, msgs });
});

// Read
router.get('/:id', (req, res, next) => {
  const { msg } = req.flash;

  Articles.findById(req.body.id)
    .then((article) =>{
      // TODO: manage errors
      res.render('user/home', { article, msg });
    })
    .catch(next);
});

// Update
router.put('/:id/save', (req, res, next) => {
  console.log(req.body);
  const { articleToUpdate } = req.body;
  Articles.findByIdAndUpdate(req.body.id, articleToUpdate)
    .then((article) => {
      req.flash('msg', 'Article updated');
    })
    .catch();
  res.redirect('/user/home');
});
// Delete
router.delete('/:id', (req, res, next) => {

  Articles.findByIdAndRemove(req.body.id)
    .then((article) => {
      req.flash('msg', 'Article removed from your favorites');
    })
    .catch(next);

  res.redirect('user/home');
});

// FAVORITES
router.put('/:id/addfav', (req, res, next) => {
  // TODO: addFav
  res.redirect('/article/:id', { title: 'Return from addFav in Articles' });
});

router.delete('/:id/removefav', (req, res, next) => {
  // TODO: deleteFav
  res.redirect('/article/:id', { title: 'Return from addFav in Articles' });
});

module.exports = router;
