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
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

// routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const articlesRouter = require('./routes/articles');

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
  secret: process.env.MONGOSESSION_SECRET,
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
app.use('/user', authMiddlewares.checkSession,
  queriesMiddlewares.queryCurrentUserRelations,
  usersRouter);
app.use('/articles', authMiddlewares.checkSession,
  articlesRouter);

// catch 404 and go to error page
app.use((req, res, next) => {
  // next(createError(404));
  res.status(404).sendfile('public/error/HTTP404.html');
});
// catch 500 and go to error page
app.use((err, req, res, next) => {
  // next(createError(500));
  res.status(500).sendFile('public/error/HTTP500.html');
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status); // || 500);
  res.render('error');
});

module.exports = app;
