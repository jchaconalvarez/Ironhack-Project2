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

  newsapi.v2.topHeadlines({ language: req.session.usr.languages })
    .then((topHeadlines) => {
      const { articles: articlesCarousel } = topHeadlines;
      const { articles: articlesUser } = req.session.usr;
      res.render('user/home', { articlesCarousel, articlesUser });
    })
    .catch(next);
});

router.get('/edit', (req, res, next) => {
  const msg = {
    error: req.flash('error'),
    msg:'Edit Profile',
    user: req.session.usr,
  };
  res.render('user/edit', msg);
});

router.put('/save', (req, res, next) => {
  const { data } = req.body;
  console.log(data);
  Users.findByIdAndUpdate(req.session.usr._id, data)
    .then(() => {
      const msg = { error: req.flash('error'), msg:'Profile updated' };
    })
    .catch(next);
  res.render('user/edit', msg);
});

module.exports = router;

// function extendNews(originalJSON, newJson) {
//   for (let key in newJson)
//     if (newJson.hasOwnProperty(key)) originalJSON[key] = newJson[key];
//   return originalJSON;
// }
