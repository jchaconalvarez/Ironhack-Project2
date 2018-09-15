const express = require('express');
const mongodb = require('mongoose');

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

  Articles.create({ articleToCreate, postedBy: req.session.usr })
    .then((article) => {
      console.log(article.postedBy);

      const { _id: userId } = req.session.usr;
      const { _id: articleId } = article;
      Users.findByIdAndUpdate(userId, { $push: { articles: articleId } })
        .then((user) => {

          const artId = article._id;

          Articles.findById(artId)
            .then((article) => {
              console.log(article);
              console.log(article._id);
              res.redirect(`/articles/${article._id}`);
            });
        });
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

// DELETE
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

// AXIOS-------
// FAVORITES
router.put('/:id/addfav', (req, res, next) => {
  const { id } = req.params;
  const user = req.session.usr;

  //   const updateFavorites = new Promise((resolve, reject) => {
  //     if (user.favorites.some(checkIfFavorite)) {
  //       resolve(Users.findByIdAndUpdate(user._id, { $pull: { favorites: id } }));
  //     } else {
  //       resolve(Users.findByIdAndUpdate(user._id, { $push: { favorites: id } }));
  //     }
  //   });

  //   updateFavorites
  //     .then(() => {
  //       res.redirect('/user/home');
  //     })
  //     .catch(next);
  // });

  Users.find({ _id:{ $eq: user._id } }, { articles: { $elemMatch: { $eq: id } } })
    .then((match) => {
      const data = JSON.parse(JSON.stringify(match));

      if (data[0].articles.length > 0) {
        Users.findByIdAndUpdate({ _id:user._id },  { $pull: { articles: id } })
          .then(() => res.send(false))
          .catch(next);
      } else {
        Users.findByIdAndUpdate({ _id:user._id }, { $push: { articles: id } })
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

  Users.find({ _id:{ $eq: user._id } }, { favorites: { $elemMatch: { $eq: id } } })
    .then((match) => {
      const data = JSON.parse(JSON.stringify(match));
      const action = data[0].favorites.length > 0;
      const sum = action ? -1 : 1;
      const articles = Articles.findByIdAndUpdate({ _id: id }, { $inc: { favorites: sum } });
      const users = action
        ? Users.findByIdAndUpdate({ _id:user._id }, { $pull: { favorites: id } })
        : Users.findByIdAndUpdate({ _id:user._id }, { $push: { favorites: id } });

      Promise.all([articles, users])
        .then((_result) => {
          Articles.findById(id)
            .then(article =>  res.send({ likes: article.favorites, liked: !action }))
            .catch(next);
        })
        .catch(next);
    });
});

// DISLIKE
router.put('/:id/dislike', (req, res, next) => {
  const { id } = req.params;
  const user = req.session.usr;
  let userAlreadyHasDisLike = false;
  let userAlreadyHasLike = false;

  Users.find({ _id:{ $eq: user._id } }, { dislikes: { $elemMatch: { $eq: id } } }).exec()
    .then((data) => {
      // console.log(data);

      const usrDisLikes = JSON.parse(JSON.stringify(data));
      userAlreadyHasDisLike = usrDisLikes[0].dislikes[0] == id;
      const operation = userAlreadyHasDisLike ? -1 : 1;

      Users.find({ _id:{ $eq: user._id } }, { favorites:{ $elemMatch: { $eq: id } } }).exec()
        .then((data) => {
          // console.log(data);
          const usrLikes = JSON.parse(JSON.stringify(data));
          userAlreadyHasLike =  usrLikes[0].favorites[0] == id;

          const articlesUpdate = Articles.findByIdAndUpdate({ _id: id }, { $inc: { dislikes: operation } });

          console.log(operation);
          console.log(userAlreadyHasDisLike);
          console.log(userAlreadyHasLike);

          if (userAlreadyHasDisLike && !userAlreadyHasLike) {
            const usersUpdate = Users.findByIdAndUpdate({ _id:user._id }, { $pull: { dislikes: id } });
          } else if (!userAlreadyHasDisLike && !userAlreadyHasLike) {
            const usersUpdate =  Users.findByIdAndUpdate({ _id:user._id }, { $push: { dislikes: id } });
          } else if (!userAlreadyHasDisLike && userAlreadyHasLike) {
            const usersUpdate =  Users.findByIdAndUpdate({ _id:user._id }, { $push: { dislikes: id }, $pull: { favorites: id } });
          }

          Promise.all([articlesUpdate, usersUpdate])
            .then((_result) => {
              console.log(_result);

              Articles.findById(id)
                .then(article => res.send({

                  unlikes: article.dislikes,
                  unliked: !userAlreadyHasDislike,
                  likes: article.likes,
                  liked,
                }));
            }).catch(next);
        }).catch(next);
    }).catch(next);
});
// });

router.post('/share', (req, res, next) => {
  console.log(req.body);
});
module.exports = router;
