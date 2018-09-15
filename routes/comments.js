const express = require('express');

const router = express.Router();
const Articles = require('../models/article');
const Users = require('../models/user');
const Comments = require('../models/comment');

// CREATE
// TODO: change to AXIOS response
router.post('/:id/new', (req, res, next) => {
  const { id: articleId } = req.params;

  console.log(req.session.usr);
  Articles.findById(articleId)
    .then((article) => {
      Comments.create({ text: req.body.text, article, postedBy: req.session.usr })
        .then((comment) => {
          Users.findByIdAndUpdate(req.session.usr._id, { $push: { comments: comment._id } })
            .then(() => {
              Articles.findByIdAndUpdate(articleId, { $push: { comments: comment._id } })
                .then(() => {
                  res.redirect(`/articles/${articleId}`);
                });
            });
        })
    })
    .catch(next);
});

// DELETE
// TODO: change to AXIOS response
router.post('/:articleId/:commentId/delete', (req, res, next) => {
  const { commentId } = req.params;
  const { articleId } = req.params;

  Comments.findById(commentId)
    .then((comment) => {
      const { _id: postedById } = comment.postedBy;
      if (postedById == req.session.usr._id) {
        Comments.findByIdAndRemove(commentId)
          .then(() => {
            Articles.findByIdAndUpdate(articleId, { $pull: { comments: commentId } })
              .then(() => {
                Users.findByIdAndUpdate(postedById, { $pull: { comments: commentId } })
                  .then((user) => {
                    res.redirect(`/articles/${articleId}`);
                  });
              });
          });
      }
    })
    .catch(next);
});

module.exports = router;

// TODO: Create social for comments and response with AXIOS
