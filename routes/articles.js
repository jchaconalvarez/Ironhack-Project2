const express = require('express');

const router = express.Router();
const Articles = require('../models/article');

router.post('/:id/addfav', (req, res, next) => {
  // TODO: addFav
  res.redirect('/article/:id', { title: 'Return from addFav in Articles' });
});

router.delete('/:id/:commentId)', (req, res, next) => {
  res.render('/article/:id', { title: 'Return from delete comment in Articles' });
});

router.get('/:id', (req, res, next) => {
  const msg = { error: req.flash('error'), id : req.body._id };
  res.render('/user/home', { title: 'Return fron Articles', msg });
});
router.put('/:id', (req, res, next) => {
  // TODO: PUT
  res.redirect('/article/:id');
});

module.exports = router;
