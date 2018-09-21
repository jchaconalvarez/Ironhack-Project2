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
  const title = '';
  console.log(languages);


  Articles.find({ language: { $in: languages } }).sort({ timeStamp : 1.0 }).limit(50)
    .then((topHeadlines) => {
      const articles = topHeadlines; // req.session.usr;
      res.render('user/home', { articles, user, title, carouselActive: false });
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

  res.render('user/edit', { user, articles, languages:req.session.usr.languages });
});

router.post('/save', (req, res, next) => {
  const { name, email, password, en, es, de, fr, it, pt } = req.body;
  let languages = [en, es, de, fr, it, pt];

  languages = languages.filter(element => element != undefined);

  hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
  const newDataOfUserPassword = { name, email, languages, password : hashedPassword };
  const newDataOfUser = { name, email, languages };

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
  const title = 'Published articles';

  res.render('user/home', { user, articles, title, carouselActive: false });
});

// FAVORITES
router.get('/favorites', (req, res, next) => {
  const { user } = req.session;
  const { favorites: articles } = req.session.usr;
  const title = 'Favorite articles';

  res.render('user/home', { user, articles, title, carouselActive: false,
  });
});

module.exports = router;
