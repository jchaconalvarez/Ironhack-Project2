const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();
const saltRounds = 10;

router.get('/', (req, res, next) => {
  res.redirect('/auth/login');  // control root of auth. alwais redirect /auth/loggin
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', 'email and password are required');
    res.redirect('/auth/login');
  } else {
    User.findOne({ email })
      .then((user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user.name ? user.name : user.email;
          req.session.usr = user;
          res.redirect('/user/home');
        } else {
          req.flash('error', 'Username or Password incorrect');
          res.redirect('/auth/login');
        }
      })
      .catch(next);
  }
});

router.get('/signup', (req, res, next) => {
  const languages = [{ en:'en' }, { es:'es' }, { de:'de' }, { fr:'fr' }, { it:'it' }, { pt:'pt' }];
  res.render('auth/signup', { languages });
});
// TODO: Flags
router.post('/signup', (req, res, next) => {
  // const { email, password, name } = req.body;
  const { name, email, password, checkpassword, en, es, de, fr, it, pt } = req.body;
  let languages = [en, es, de, fr, it, pt];
  console.log(req.body);

  languages = languages.filter(element => element != undefined);

  if (!email || !password) {
    req.flash('error', 'Username and Password are required');
    res.redirect('/auth/signup');
  } else if (password != checkpassword) {
    req.flash('error', 'Password must be equal');
    res.redirect('/auth/signup');
  } else {
    User.findOne({ email })
      .then((user) => {
        if (user) {
          req.flash('error', `Email ${email} exist, try login`);
          res.redirect('/auth/login');
        } else {
          hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
          User.create({ email, password: hashedPassword, name, languages })
            .then((newUser) => {
              req.flash('success', 'Login correct');
              req.session.currentUser = newUser.name ? newUser.name : newUser.email; // TODO: update if change profile
              req.session.usr = newUser;
              res.redirect('/user/home');
            });
        }
      })
      .catch(next);
  }
});

router.get('/logout', (req, res) => {
  delete req.session.currentUser;
  delete req.session.user;
  delete req.session.news;
  res.redirect('/');
});

module.exports = router;
