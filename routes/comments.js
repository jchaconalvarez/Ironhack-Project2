const express = require('express');

const router = express.Router();
const Articles = require('../models/article');
const Users = require('../models/user');
const Comments = require('../models/comment');

// CREATE
router.post('/:id/new', (req, res, next) => {
  const { id: articleId } = req.params;

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

  Comments.findByIdAndRemove(commentId).populate('user')
    .then((comment) => {
      console.log('Before Articles -----');
      console.log(comment.user.comments);
      Articles.findByIdAndUpdate(comment.article, { $pull: { comments: commentId } })
        .then((article) => {
          console.log('Before Users -----');
          console.log(comment.user.comments, comments.user._id);
          Users.findByIdAndUpdate(comment.user._id, { $pull: { comments: commentId } });
          console.log('After Users -----');
          console.log(comment.user.comments, commentId);
          res.redirect(`/articles/${article._id}`);
        })
        .catch(next);
    });
});

module.exports = router;
