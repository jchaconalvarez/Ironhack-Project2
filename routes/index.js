const express = require('express');
const Users = require('../models/user');
const Articles = require('../models/article');

const router = express.Router();

/* GET  page. */

router.get('/', (req, res, next) => {
  Articles.find()
    .then((articles) => {
      res.render('index', { articles });
    })
    .catch(next);
});

module.exports = router;
