const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Gazette' });
});
router.get('/:id/favs', (req, res, next) => {
  res.render('/user/home', { title: 'Return from GET favs in index' });
});
router.post('/:id/favs', (req, res, next) => {
  req.flash('title', 'Return from POST favs in index');
  res.rendirect('/:id/edit');
});
router.get('/:id/edit', (req, res, next) => {
  res.render('profile', { title: 'Return from GET edit in index' });
});
router.post('/:id/edit', (req, res, next) => {
  req.flash('title', 'Return from POST edit in index');
  res.redirect('/:id/edit');
});
router.delete('/:id', (req, res, next) => {
  req.flash('title', 'Return from DELETE in index');
  res.rendirect('/');
});

module.exports = router;
