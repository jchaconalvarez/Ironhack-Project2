const express = require('express');

const router = express.Router();
const Articles = require('../models/article');
const User = require('../models/user');

// CREATE
router.post('/:id/new', (req, res, next) => {
  const { id: articleId } = req.params;
  const newComment = req.body;

  console.log(newComment);
  Articles.findByIdAndUpdate(articleId, { $push: { comments: {} } })
    .then((article) => {
      Articles.update({ _id: articleId, 'comments._id': article.comments[comments.length - 1]._id }, { $set: { 'comments.$.text': newComment } });
    })
    .then(() => {
      console.log('comment added');
    })
    .catch(next);
});

module.exports = router;
