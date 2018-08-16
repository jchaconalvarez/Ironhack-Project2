const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const NewsAPI = require('newsapi');

const ArticlesMSRV = require('../models/article');

const newsapi1 = new NewsAPI('da5125e659e04c93929fa448a270da80');
const newsapi2 = new NewsAPI('546fcf53233c4a85a6447c9f27c5d391');

const app = express();
require('dotenv').config();

const languages = ['de', 'en', 'es', 'fr', 'it', 'pt'];
let switchAPIKey = true;
let serverStatus = String;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const wait = ms => new Promise(timer => setTimeout(timer, ms));

const queriesService = (ms, arrayOfLanguages) => new Promise((resolve, reject) => {
  setInterval(() => {
    const promises = [];
    arrayOfLanguages.forEach((language, index) => {
      promises.push(switchAPIKey
        ? newsapi1.v2.topHeadlines({ language })
        : newsapi2.v2.topHeadlines({ language }));
      console.log(`${switchAPIKey ? 'API1' : 'API2'} HeadLines->${index}`);
    });
    switchAPIKey = !switchAPIKey;
    Promise.all(promises)
      .then(queryReasult => resolve(queryReasult))
      .catch(error => reject(error));
  }, ms);
});

app.get('/start', (req, res, next) => {
  queryService('start');
  // next();
  // res.redirect('/status');
}).get('/stop', (req, res, next) => {
  queryService('stop');
  res.redirect('/status');
}).get('/status', (req, res, next) => {
  res.send(serverStatus);
});

app.listen(process.env.PORT_MICROSERVICE_APINEWS, () => {
  console.log('server listening at localhost port 3003');
});

const queryService = (status) => {
  switch (status) {
    case 'start':
      queriesService(process.env.TIME_MICROSERVICE, languages)
        .then((topHeadlinesArray) => {
          topHeadlinesArray.forEach((topHeadlines, index) => {
            console.log(`article ->${index}`);
            const { articles  } = topHeadlines;
            articles.forEach((article) => {
              ArticlesMSRV.findOne(article)
                .then((match) => {
                  if (!match) ArticlesMSRV.create(article);
                });
            });
          });
        })
        .catch((error) => {
          console.log(error);
          next(error);
        });
      serverStatus = 'queries service started';
      break;
    case 'stop':
      clearInterval(queriesService);
      serverStatus = 'queries service stopped';
      break;
    default:
  }
};
