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
  const numLanguages = req.session.usr.languages.length;
  const numCountries = req.session.usr.countries.length;
  const user = req.session.usr;

  // newsapi.v2.topHeadlines({ language: req.session.usr.languages })
  Articles.find()
    .then((topHeadlines) => {
      const articlesCarousel  = topHeadlines;// const { articles: articlesCarousel } = topHeadlines;
      const articlesUser = topHeadlines; // req.session.usr;
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
  const { data } = req.body;
  console.log(data);
  Users.findByIdAndUpdate(req.session.usr._id, data)
    .then(() => {
      res.render('user/profile');
    })
    .catch(next);
});

module.exports = router;

// function extendNews(originalJSON, newJson) {
//   for (let key in newJson)
//     if (newJson.hasOwnProperty(key)) originalJSON[key] = newJson[key];
//   return originalJSON;
// }
