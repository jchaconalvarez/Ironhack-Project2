const express = require('express');
const NewsAPI = require('newsapi');
const Users = require('../models/user');
const Articles = require('../models/article');

const newsapi = new NewsAPI('da5125e659e04c93929fa448a270da80');

const router = express.Router();
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

router.put('/save', (req, res, next) => {
  const { data } = req.body;
  console.log(data);
  Users.findByIdAndUpdate(req.session.usr.id, data)
    .then((element) => {
      console.log(element)
      req.session.usr = element;
      const { usr: user } = req.session;
      const { articles: articlesUser } = req.session.usr;

      res.render('user/profile', { user, articlesUser });
    })
    .catch(next);
});

module.exports = router;
