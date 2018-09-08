const express = require('express');
const mongoose = require('mongoose');
const NewsAPI = require('newsapi');

require('dotenv').config();
const Articles = require('../models/articleMSRV');

const newsapi1 = new NewsAPI(process.env.NEWS_API1);// 'da5125e659e04c93929fa448a270da80');
const newsapi2 = new NewsAPI(process.env.NEWS_API2);// '546fcf53233c4a85a6447c9f27c5d391');
const app = express();


let switchAPIKey = true;
let serverStatus = 'idle';
let queriesCounter = 0;
let articlesCounter = 0;
let queriesInterval;

const queryToAPI = () => {
  const languages = ['de', 'en', 'es', 'fr', 'it', 'pt'];
  const arrayOfPromises = [];

  languages.forEach((language, index) => {
    arrayOfPromises.push(switchAPIKey
      ? newsapi1.v2.topHeadlines({ language })
      : newsapi2.v2.topHeadlines({ language }));
    console.log(`${switchAPIKey ? 'API1' : 'API2'} HeadLines->${index}`);
  });

  switchAPIKey = !switchAPIKey;
  console.log('------------------------');
  Promise.all(arrayOfPromises)
    .then((topHeadlinesArray) => {
      topHeadlinesArray.forEach((topHeadlines, index) => {
        console.log(`source ->${index}`);

        topHeadlines.articles.forEach((article, index) => {
          console.log(`article ->${index}`);

          Articles.findOne(article, (error, match) => {
            if (error) return handleError(error);
            if (!match) {
              Articles.create(article, (error) => {
                if (error) return handleError(error);
                articlesCounter++;
                // console.log('updated');
              });
            }
          });
        });
      });
    })
    .catch((e) => {
      serverStatus = 'error';
      console.log(e);

      clearInterval(queriesInterval);
    });
};

mongoose.connect('mongodb://127.0.0.1:27017/ironhack_prj2', { useNewUrlParser: true });

app.get('/', (req, res, next) => {
  res.redirect('status');
}).get('/run', (req, res, next) => {
  console.log(`processing queries every: ${process.env.TIME_MICROSERVICE / 60000} minutes`);

  queriesInterval = setInterval(() => {
    queriesCounter++;
    console.log(`query nº: ${queriesCounter}`);
    queryToAPI();
  }, process.env.TIME_MICROSERVICE);
  serverStatus = 'running';
  res.redirect('status');
}).get('/stop', (req, res, next) => {
  queriesCounter = 0;
  serverStatus = 'stopped';

  clearInterval(queriesInterval);
  res.redirect('status');
}).get('/status', (req, res, next) => {
  res.send(`<h2>GAZETTE microservice ${serverStatus}.<h2>
            <h3>Articles collected: ${articlesCounter}<h3>`);
});

app.listen(process.env.PORT_MICROSERVICE_APINEWS, () => {
  console.log('GAZETTE microservice is listening at port 3003');
});
