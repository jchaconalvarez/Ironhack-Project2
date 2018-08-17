const express = require('express');
const NewsAPI = require('newsapi');
const bcrypt = require('bcrypt');
const Users = require('../models/user');
const Articles = require('../models/article');

const newsapi = new NewsAPI('da5125e659e04c93929fa448a270da80');

const router = express.Router();
const saltRounds = 10;

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.redirect('/user/home');
});

router.get('/home', (req, res, next) => {
  const user = req.session.usr;

  Articles.find()
    .then((topHeadlines) => {
      const articlesCarousel  = topHeadlines;
      const  articlesUser = topHeadlines;
      res.render('user/home', { articlesCarousel, articlesUser, user });
    })
    .catch(next);
});

router.get('/profile', (req, res, next) => {
  const { usr: user } = req.session;
  const { articles: articlesUser } = req.session.usr;

  res.render('user/profile', { user, articlesUser });
});

router.get('/edit', (req, res, next) => {
  const { usr: user } = req.session;
  const { articles: articlesUser } = req.session.usr;

  res.render('user/edit', { user, articlesUser });
});

router.post('/save', (req, res, next) => {
  const { name, email, password } = req.body;

  hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
  const newDataOfUserPassword = { name, email, password : hashedPassword };
  const newDataOfUser = { name, email };

  console.log(newDataOfUser);

  Users.findByIdAndUpdate(req.session.usr.id, password ? newDataOfUserPassword : newDataOfUser)
    .then(() => {
      Users.findOne({ email })
        .populate('articles')
        .populate('users')
        .then((updatedUser) => {
          console.log(updatedUser);
          req.session.currentUser = updatedUser.user;
          req.session.usr = updatedUser;

          const { usr: user } = req.session;
          const { articles: articlesUser } = req.session.usr;
          res.render('user/profile', { user, articlesUser });
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
