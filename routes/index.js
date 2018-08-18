const express = require('express');

const router = express.Router();

/* GET  page. */

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Gazette' });
});

module.exports = router;
