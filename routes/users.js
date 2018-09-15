const express = require('express');
const NewsAPI = require('newsapi');
const bcrypt = require('bcrypt');
const Users = require('../models/user');
const Articles = require('../models/article');

const newsapi = new NewsAPI('da5125e659e04c93929fa448a270da80');

const router = express.Router();
const saltRounds = 10;

// USER HOME
router.get('/', (req, res, next) => {
  res.redirect('/user/home');
});

router.get('/home', (req, res, next) => {
  const user = req.session.usr;
  const { languages } = req.session.usr;

  // console.log(user);
  // console.log(languages);
  //  console.log('res.locals.currentUser----------------------');
  //  console.log(res.locals.currentUser);
  //  console.log('req.session.usr----------------');
  //  console.log(req.session.usr);


  Articles.find().sort({ publishedAt : -1.0 })

    .then((topHeadlines) => {
      // const articlesCarousel = topHeadlines;// const { articles: articlesCarousel } = topHeadlines;
      const articles = topHeadlines; // req.session.usr;
      res.render('user/home', { articles, user });
    })
    .catch(next);
});

// USER PROFILE
router.get('/profile', (req, res, next) => {
  const { usr: user } = req.session;
  const { favorites: articles } = req.session.usr;

  res.render('user/profile', { user, articles });
});

// EDIT PROFILE
router.get('/edit', (req, res, next) => {
  const { usr: user } = req.session;
  const { favorites: articles } = req.session.usr;

  res.render('user/edit', { user, articles });
});

router.post('/save', (req, res, next) => {
  const { name, email, password, languages } = req.body;
  hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
  const newDataOfUserPassword = { name, email, password : hashedPassword };
  const newDataOfUser = { name, email };

  Users.findByIdAndUpdate(req.session.usr.id, password ? newDataOfUserPassword : newDataOfUser)
    .then(() => {
      // console.log(req.session)
      Users.findById({ _id:req.session.usr.id })
        .then((updatedUser) => {
          req.session.currentUser = updatedUser.name;
          req.session.usr = updatedUser;

          const { usr: user } = req.session;
          const { articles } = req.session.usr.articles;

          res.render('user/profile', { user, articles });
        })
        .catch(next);
    })
    .catch(next);
});

// PUBLISHED ARTICLES
router.get('/published', (req, res, next) => {
  const { user } = req.session;
  const { articles } = req.session.usr;

  res.render('user/home', { user, articles });
});

// FAVORITES
router.get('/favorites', (req, res, next) => {
  const { user } = req.session;
  const { favorites: articles } = req.session.usr;

  res.render('user/home', { user, articles });
});

module.exports = router;
