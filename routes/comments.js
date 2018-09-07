const express = require('express');

const router = express.Router();
const Articles = require('../models/article');
const Users = require('../models/user');
const Comments = require('../models/comment');

// CREATE
router.post('/:id/new', (req, res, next) => {
  const { id: articleId } = req.params;
  const newComment = req.body;

  console.log(newComment);
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

module.exports = router;
