const express = require('express');
const Users = require('../models/user');
const Articles = require('../models/article');

const router = express.Router();

/* GET  page. */

router.get('/', (req, res, next) => {;

  Articles.find()
    .then((articles) => {
      articles = articles.slice(0, 20);
      res.render('index', { articles, carouselActive: true });
    })
    .catch(next);
});

module.exports = router;
