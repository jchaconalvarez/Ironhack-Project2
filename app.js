const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');

require('dotenv').config();

// db connection

mongoose.connect('mongodb://gazetteapp:gazette1234@ds135866.mlab.com:35866/gazetteapp', { useNewUrlParser: true });

// routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const articlesRouter = require('./routes/articles');
const commentsRouter = require('./routes/comments');

// middlewares
const authMiddlewares = require('./middleware/auth');
const queriesMiddlewares = require('./middleware/queries');
const msgMiddlewares = require('./middleware/messages');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('layout extractMetas', true);
app.set('layout', 'layout/layout');
app.use(expressLayouts);

app.use(session({
  secret: 'some-string',
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60,
  }),
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(msgMiddlewares.notifications);

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', queriesMiddlewares.queryCurrentUserRelations,
  authMiddlewares.checkSession, usersRouter);
app.use('/articles', queriesMiddlewares.queryCurrentUserRelations,
  authMiddlewares.checkSession,
  articlesRouter);
app.use('/comments', queriesMiddlewares.queryCurrentUserRelations,
  authMiddlewares.checkSession,
  commentsRouter);

// catch 404 and go to error page
app.use((req, res, next) => {
  // next(createError(404));
  res.status(404).sendfile('public/error/HTTP404.html');
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //view env, development or production
  //console.log(req.app.get('env'));

  // render the error page
  if (req.app.get('env') === 'development') {
    res.status(err.status || 500);
    res.render('error');
  } else  res.status(500).sendfile('public/error/HTTP500.html');
});

module.exports = app;
