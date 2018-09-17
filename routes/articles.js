const express = require('express');
const mongodb = require('mongoose');
const nodemailer = require('nodemailer');

const Articles = require('../models/article');
const Users = require('../models/user');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.redirect('/user/home');
});

router.get('/new', (req, res, next) => {
  const { usr: user } = req.session;
  res.render('articles/new', { user });
});


// CRUD
// CREATE
router.post('/new', (req, res, next) => {
  const { body: articleToCreate } = req;
  articleToCreate.postedBy = req.session.usr;

  Articles.create(articleToCreate)
    .then((article) => {
      const { _id: userId } = req.session.usr;
      const { _id: articleId } = article;
      Users.findByIdAndUpdate(userId, { $push: { articles: articleId } })
        .then(() => {
          Articles.findById(article._id)
            .then((article) => {
              res.redirect(`/articles/${article._id}`);
            });
        });
    })
    .catch(next);
});

// READ
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const { usr : user } = req.session;

  Articles.findById(id).populate('comments')
    .then((article) => {
      const articles = [article]; // showArticles.ejs requires an array of articles.
      res.render('articles/view', { articles, user });
    })
    .catch(next);
});

// UPDATE
router.post('/:id/save', (req, res, next) => {
  const { articleToUpdate } = req.body;
  const { _id } = req.body;

  Articles.findByIdAndUpdate(_id, articleToUpdate, { postedby: req.session.usr._id })
    .then(() => {
      req.flash('success', 'Article updated');
      res.redirect(`/article/${id}`);
    })
    .catch(next);
});

// DELETE (ONLY FOR CREATOR OF ARTICLE)
router.delete('/:id/delete', (req, res, next) => {
  const { id } = req.params;

  Articles.findByIdAndRemove(id)
    .then((obj) => {
      console.log(obj);
      req.flash('success', 'Article removed');
      res.send(200);
      //     res.redirect('/user/home');
    })
    .catch(next);
});

// AXIOS-------
// FAVORITES
router.put('/:id/addfav', (req, res, next) => {
  const { id } = req.params;
  const user = req.session.usr;

  Users.find({ _id: user._id, articles: { $elemMatch: { $eq: id } } })
    .then((match) => {
      if (match.length > 0) {
        Users.findByIdAndUpdate({ _id: user._id },  { $pull: { articles: id } })
          .then(() => res.send(false))
          .catch(next);
      } else {
        console.log('meter');
        Users.findByIdAndUpdate({ _id: user._id }, { $push: { articles: id } })
          .then(() => res.send(true))
          .catch(next);
      }
    })
    .catch(next);
});

// LIKES
router.put('/:id/like', (req, res, next) => {
  const { id } = req.params;
  const user = req.session.usr;
  const arrayOfQueries = [];
  let like = false;
  let unlike = false;

  Users.find({ _id: user._id,  favorites: { $elemMatch: { $eq: id }  } })
    .then((data) => {
      const userAlreadyHasLike = data.length > 0;
      const operationLike = userAlreadyHasLike ? -1 : 1;
      like = !userAlreadyHasLike;

      Users.find({ _id:user._id }, { dislikes:{ $elemMatch: { $eq: id } } }).exec()
        .then((data) => {
          const userAlreadyHasDisLike =  data[0].dislikes.length > 0;
          const operationDisLike = userAlreadyHasDisLike ? -1 : 0;
          unlike = !userAlreadyHasDisLike;

          const articlesUpdate = Articles.findByIdAndUpdate({ _id: id }, { $inc: { favorites: operationLike, dislikes: operationDisLike } });
          const usersUpdateLike = (userAlreadyHasLike && !userAlreadyHasDisLike)
            ? Users.findByIdAndUpdate({ _id:user._id }, { $pull: { favorites: id } })
            : Users.findByIdAndUpdate({ _id:user._id }, { $push: { favorites: id } });
          const usersUpdateLikeAndDisLike = (!userAlreadyHasLike && userAlreadyHasDisLike)
            ? Users.findByIdAndUpdate({ _id:user._id }, { $push: { favorites: id }, $pull: { dislikes: id } })
            : usersUpdateLike;

          arrayOfQueries.push(articlesUpdate);
          arrayOfQueries.push(usersUpdateLikeAndDisLike);

          Promise.all([articlesUpdate, usersUpdateLikeAndDisLike])
            .then((_result) => {
              Articles.findById({ _id:id })
                .then((article) => {
                  res.send({
                    unlikes: article.dislikes,
                    disliked: !userAlreadyHasDisLike,
                    likes: article.favorites,
                    liked: !userAlreadyHasLike,
                  });
                }).catch(next);
            }).catch(next);
        }).catch(next);
    }).catch(next);
});

// DISLIKE
router.put('/:id/dislike', (req, res, next) => {
  const { id } = req.params;
  const user = req.session.usr;
  const arrayOfQueries = [];

  Users.find({ _id: user._id,  dislikes: { $elemMatch: { $eq: id }  } })
    .then((data) => {
      const userAlreadyHasDisLike = data.length > 0;
      const operationDisLike = userAlreadyHasDisLike ? -1 : 1;

      Users.find({ _id:user._id }, { favorites:{ $elemMatch: { $eq: id } } }).exec()
        .then((data) => {
          const userAlreadyHasLike =  data[0].favorites.length > 0;
          const operationLike = userAlreadyHasLike ? -1 : 0;
          const articlesUpdate = Articles.findByIdAndUpdate({ _id: id }, { $inc: { dislikes: operationDisLike, favorites: operationLike } });
          const usersUpdateDisLike = (userAlreadyHasDisLike && !userAlreadyHasLike)
            ? Users.findByIdAndUpdate({ _id:user._id }, { $pull: { dislikes: id } })
            : Users.findByIdAndUpdate({ _id:user._id }, { $push: { dislikes: id } });
          const usersUpdateDisLikeAndLike = (!userAlreadyHasDisLike && userAlreadyHasLike)
            ? Users.findByIdAndUpdate({ _id:user._id }, { $push: { dislikes: id }, $pull: { favorites: id } })
            : usersUpdateDisLike;

          arrayOfQueries.push(articlesUpdate);
          arrayOfQueries.push(usersUpdateDisLikeAndLike);

          Promise.all([articlesUpdate, usersUpdateDisLikeAndLike])
            .then((_result) => {
              Articles.findById({ _id:id })
                .then((article) => {
                  res.send({
                    unlikes: article.dislikes,
                    disliked: !userAlreadyHasDisLike,
                    likes: article.favorites,
                    liked: !userAlreadyHasLike,
                  });
                }).catch(next);
            }).catch(next);
        }).catch(next);
    }).catch(next);
});

router.put('/share', (req, res, next) => {
  console.log(req.body);

  const { email, host, link } = req.body;
  console.log(email);
  console.log(link);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'appgazette@gmail.com',
      pass: 'gazette.app.2018',
    },
  });

  transporter.sendMail({
    from: 'APP Gazette. The news aggregator <appgazette@gmail.com>',
    to: email,
    subject: `${req.session.usr.name} has sent you a news with APP Gazette.`,
    html: `
    <b>${req.session.usr.name} - <${req.session.usr.email}> thinks you may be interested in this article.</b>
    <br><b>http://${host}/articles/${link}</b><br><b>Register in Gazette to see this and more news.</b><br>
    <b>A cordial greeting</b> <b>The Gazette team</b>`,
  })
    .then((info) => {
      req.flash('success', 'email send correctly');
      res.send(info);
    }).catch((error) => {
      req.flash('error', 'email not delivered');
      console.log(error);
    });
});

module.exports = router;
