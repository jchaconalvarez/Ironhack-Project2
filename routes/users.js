const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.redirect('/users/home');
});

router.get('/home', (req, res, next) => {
  res.render('home');
});


module.exports = router;
