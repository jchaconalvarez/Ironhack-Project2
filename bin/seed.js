const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Article = require('../models/article');


mongoose.connect('mongodb://admin:admin2018@ds115442.mlab.com:15442/ironhack_prj2', { useNewUrlParser: true });

User.collection.drop();
Article.collection.drop();

const users = [
  {
    name: 'perico',
    email: 'pp@uiui.com',
    password: bcrypt.hashSync('perico', 10),
    country: ['gr', 'hk', 'us', 've', 'za', 'es'],
    languages: ['ar', 'de', 'en'],
  },
  {
    name: 'pepe',
    email: 'erilo@uiui.com',
    password: bcrypt.hashSync('pepe', 10),
    country: ['ve', 'za', 'es'],
    languages: [ 'en'],
  },
];

const articles = [
  {
    source: {
      id: 'goo',
      name: 'Google',
    },
    author: 'Peter',
    title: 'lallallalalala',
    description: 'rwtwrtrwt',
    url: 'url',
    urlToImage: 'URL img',
    publishedAt: Date.now(),
  },
  {
    source: {
      id: 'yahoo',
      name: 'Yahoo',
    },
    author: 'oli',
    title: 'lallawdwdwllalalala',
    description: 'rwtweweeeeeeeeeewrtrwt',
    url: 'url',
    urlToImage: 'URL img',
    publishedAt: Date.now(),
  },
];

User.create(users)
  .then(() => {
    console.log('users OK');

    return Article.create(articles).then(() => {
      console.log('articles OK');
      mongoose.connection.close();
    });
  })
  .catch((error) => {
    console.log(error);
  });
