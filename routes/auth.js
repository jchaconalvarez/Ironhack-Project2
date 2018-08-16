const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();
const saltRounds = 10;

router.get('/', (req, res, next) => {
  res.redirect('/auth/login');  // control root of auth. alwais redirect /auth/loggin
});

router.get('/login', (req, res) => {
  const msg = { error: req.flash('error') };
  res.render('auth/login', { title: 'login', msg });
});
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', 'email and password are required');
    res.redirect('auth/login');
  } else {
    User.findOne({ email })
      .then((user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user.name ? user.name : user.email; // TODO: update if change profile
          req.session.usr = user;
          // console.log(req.session);

          res.redirect('/user/home');
        } else {
          req.flash('error', 'Username or Password incorrect');
          res.redirect('auth/login');
        }
      })
      .catch(next);
  }
});

router.get('/signup', (req, res, next) => {
  const msg = { error: req.flash('error') };

  res.render('auth/signup', msg);
});
router.post('/signup', (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    req.flash('error', 'Username and Password are required');
    res.redirect('/auth/signup');
  } else {
    User.findOne({ email })
      .then((user) => {
        if (user) {
          req.flash('error', `Email ${email} exist, try login`);
          res.redirect('/auth/login');
        } else {
          hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
          User.create({ email, password: hashedPassword, name })
            .then((newUser) => {
              req.session.currentUser = newUser.name ? newUser.name : newUser.email; // TODO: update if change profile
              req.session.usr = newUser;
              res.redirect('/user/home');
            });
        }
      })
      .catch(next);
  }
});

router.post('/logout', (req, res) => {
  delete req.session.currentUser;
  delete req.session.user;
  delete req.session.news;
  res.redirect('/');
});

module.exports = router;
