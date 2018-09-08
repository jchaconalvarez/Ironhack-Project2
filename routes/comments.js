const express = require('express');

const router = express.Router();
const Articles = require('../models/article');
const Users = require('../models/user');
const Comments = require('../models/comment');

// CREATE
router.post('/:id/new', (req, res, next) => {
  const { id: articleId } = req.params;
  const newComment = req.body;

  Comments.create({ text: req.body.text, article: articleId, user: req.session.usr._id })
    .then((comment) => {
      Users.findByIdAndUpdate(req.session.usr._id, { $push: { comments: comment._id } })
        .then(() => {
          Articles.findByIdAndUpdate(articleId, { $push: { comments: comment._id } })
            .then(() => {
              res.redirect(`/articles/${articleId}`);
            })
            .catch(next);
        });
    });
});

// DELETE
router.post('/:id/delete', (req, res, next) => {
  const { id: commentId } = req.params;

  Comments.findById(commentId)
    .then((comment) => {
      const { _id: articleId } = comment.article;
      Comments.deleteOne({ _id: commentId })
        .then(() => {
          res.redirect(`/articles/${articleId}`);
        })
        .catch(error);
    });
});

module.exports = router;
