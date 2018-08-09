const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.redirect('/user/home');
});

router.get('/home', (req, res, next) => {
  res.render('user/home');
});


module.exports = router;
