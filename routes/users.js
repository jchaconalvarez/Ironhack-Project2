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

router.get('/edit', (req, res, next) => {
  const { usr: user } = req.session;
  const { articles: articlesUser } = req.session.usr;

  res.render('user/edit', { user, articlesUser });
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
