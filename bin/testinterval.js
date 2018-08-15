const queryService = (args, period) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const promises = [];
      languages.forEach((language, index) => {
        if (switchAPIKey) {
          promises.push(newsapi1.v2.topHeadlines({ language }));
          console.log(`API1 HeadLines->${index}`);
        } else {
          promises.push(newsapi2.v2.topHeadlines({ language }));
          console.log(`API2 HeadLines->${index}`);
        }
      });
      switchAPIKey = !switchAPIKey;
      return Promise.all(promises)
    }, period);
  });
};
