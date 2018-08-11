const express = require('express');
const NewsAPI = require('newsapi');

const newsapi = new NewsAPI('da5125e659e04c93929fa448a270da80');

const router = express.Router();
const Articles = require('../models/article');
const User = require('../models/user');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.redirect('/user/home');
});

router.get('/home', (req, res, next) => {
  newsapi.v2.topHeadlines({ language: 'en', country: 'us' })
    .then((response) => {
      const { articles } = response;
      res.render('user/home', { articles });
    }).catch(next);
});

module.exports = router;
