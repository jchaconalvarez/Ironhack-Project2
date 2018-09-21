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
              req.flash('success', 'Article published');
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
      res.render('articles/view', { articles, user, carouselActive: false });
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
      res.redirect('/user/home');
    })
    .catch(next);
});

// AXIOS-------
// FAVORITES
router.put('/:id/addfav', (req, res, next) => {
  const { id } = req.params;
  const user = req.session.usr;

  Users.find({ _id: user._id, favorites: { $elemMatch: { $eq: id } } })
    .then((match) => {
      if (match.length > 0) {
        Users.findByIdAndUpdate({ _id: user._id },  { $pull: { favorites: id } })
          .then(() => res.send(false))
          .catch(next);
      } else {
        Users.findByIdAndUpdate({ _id: user._id }, { $push: { favorites: id } })
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

  Users.find({ _id: user._id,  likes: { $elemMatch: { $eq: id }  } })
    .then((data) => {
      const userAlreadyHasLike = data.length > 0;
      const operationLike = userAlreadyHasLike ? -1 : 1;
      like = !userAlreadyHasLike;

      Users.find({ _id:user._id }, { dislikes:{ $elemMatch: { $eq: id } } }).exec()
        .then((data) => {
          const userAlreadyHasDisLike =  data[0].dislikes.length > 0;
          const operationDisLike = userAlreadyHasDisLike ? -1 : 0;
          unlike = !userAlreadyHasDisLike;

          const articlesUpdate = Articles.findByIdAndUpdate({ _id: id }, { $inc: { likes: operationLike, dislikes: operationDisLike } });
          const usersUpdateLike = (userAlreadyHasLike && !userAlreadyHasDisLike)
            ? Users.findByIdAndUpdate({ _id:user._id }, { $pull: { likes: id } })
            : Users.findByIdAndUpdate({ _id:user._id }, { $push: { likes: id } });
          const usersUpdateLikeAndDisLike = (!userAlreadyHasLike && userAlreadyHasDisLike)
            ? Users.findByIdAndUpdate({ _id:user._id }, { $push: { likes: id }, $pull: { dislikes: id } })
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
                    likes: article.likes,
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

      Users.find({ _id:user._id }, { likes:{ $elemMatch: { $eq: id } } }).exec()
        .then((data) => {
          const userAlreadyHasLike =  data[0].likes.length > 0;
          const operationLike = userAlreadyHasLike ? -1 : 0;
          const articlesUpdate = Articles.findByIdAndUpdate({ _id: id }, { $inc: { dislikes: operationDisLike, likes: operationLike } });
          const usersUpdateDisLike = (userAlreadyHasDisLike && !userAlreadyHasLike)
            ? Users.findByIdAndUpdate({ _id:user._id }, { $pull: { dislikes: id } })
            : Users.findByIdAndUpdate({ _id:user._id }, { $push: { dislikes: id } });
          const usersUpdateDisLikeAndLike = (!userAlreadyHasDisLike && userAlreadyHasLike)
            ? Users.findByIdAndUpdate({ _id:user._id }, { $push: { dislikes: id }, $pull: { likes: id } })
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
                    likes: article.likes,
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
    service: process.env.APP_MAIL_SERVICE,
    auth: {
      user: process.env.APP_MAIL,
      pass: process.env.APP_PASS,
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
      req.flash('success', 'Article shared');
      res.send(info);
    }).catch((error) => {
      req.flash('error', 'Article could not be shared');
      console.log(error);
    });
});

module.exports = router;
