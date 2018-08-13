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
  console.log(req.session.usr.languages.length);
  newsapi.v2.topHeadlines({ country: ['us'] })
    .then((topHeadlines) => {
      console.log(topHeadlines);
      const { articles: articlesCarousel } = topHeadlines;

      Users.findById(req.session.usr._id).populate('articles')
        .then((user) => {
          console.log(user);
          const { articles: articlesUser } = user;
          res.render('user/home', { articlesCarousel, articlesUser });
        });
    })
    .catch(next);
});

router.get('/edit', (req, res, next) => {
  const user = req.session.usr;

  res.render('user/edit', { user });
});

module.exports = router;

// function extendNews(originalJSON, newJson) {
//   for (let key in newJson)
//     if (newJson.hasOwnProperty(key)) originalJSON[key] = newJson[key];
//   return originalJSON;
// }
