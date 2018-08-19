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
  console.log('post /new');

  const { body : articleToCreate } = req;
  // const articleToCreate= {source: { id: origin, name: origin }}
  console.log('query----------------------------------');
  console.log(articleToCreate);

  Articles.create(articleToCreate)
    .then((newArticle) => {
      console.log('newarticle---de create------------------------------');
      console.log(newArticle);
      console.log(req.session.usr);

      // const { _id  } = newArticle;
      return Users.findByIdAndUpdate({ _id:req.session.usr._id },
        { $push:  { articles: { _id:newArticle._id } } })
        .populate('articles')
        .populate('users');
    })
    .then((article) => {
      console.log('newarticle---de find and update------------------------------');
      console.log(article);
      res.render('articles/profile', article);
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
    .then((article) => {
      req.flash('success', 'Article removed');
      res.redirect('/user/profile');
    })
    .catch(next);
});

// FAVORITES
router.post('/:id/addfav', (req, res, next) => {
  const { id } = req.params;
  const { usr : user } = req.session;

  // TODO: addFav
  console.log(req.body);
  console.log(req.params);
  console.log(id);

  res.redirect(`/articles/${id}`);
});

router.post('/:id/removefav', (req, res, next) => {
  const { id } = req.params;
  const { usr : user } = req.session;
  // TODO: deleteFav
  res.redirect(`/articles/${id}`);
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
