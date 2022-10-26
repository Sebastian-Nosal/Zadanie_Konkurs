const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');

const PORT = process.env.PORT || 8080;
const app = express();

const sessionOptions = { secret: 'SECRET', saveUninitialized: true, resave: true };

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// routes

const router = require('./routes/main.routes');
const apiRouter = require('./routes/api.routes');

app.use(session(sessionOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('public'));

app.use('/', router);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => console.log(`Server works on port ${PORT}`));
