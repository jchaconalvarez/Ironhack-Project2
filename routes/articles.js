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
// router.post('/new', (req, res, next) => {
//   console.log('post /new');

//   const { body : articleToCreate } = req;
//   // const articleToCreate= {source: { id: origin, name: origin }}
//   console.log('query----------------------------------');
//   console.log(articleToCreate);

//   Articles.create(articleToCreate)
//     .then((article) => {
//       console.log('newarticle---de create------------------------------');
//       console.log(article);
//       const { _id : userId } = req.session.usr;
//       const { _id : articleId } = article;
//       Users.findByIdAndUpdate(userId, { $push: [{ articles: [{ ref: articleId }] }] }, { new: true });
//     })
//     .then((user) => {
//       console.log('newarticle---de find and update------------------------------');
//       const artId = user.articles[user.articles.length - 1];
//       console.log(user.articles);
//       console.log(user.articles[user.articles.length - 1]);
//       return Articles.findById(artId);
//     })
//     .then((article) => {
//       console.log(article);
//       // res.render(`articles/${article._id}`, article);
//     })
//     .catch(next);
// });

router.post('/new', (req, res, next) => {
  const { body: articleToCreate } = req;

  Articles.create(articleToCreate)
    .then((article) => {
      const { _id: userId } = req.session.usr;
      const { _id: articleId } = article;
      Users.findByIdAndUpdate(userId, { $push: { articles:  articleId } }, { new: true })
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
