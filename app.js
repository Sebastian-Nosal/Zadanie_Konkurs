const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const sessionOptions = { secret: 'SECRET', saveUninitialized: true, resave: true };

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const fileupload = require("express-fileupload");
const router = require('./routes/main.routes');
const apiRouter = require('./routes/api.routes');

app.use(session(sessionOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('public'));
app.use(fileupload());

app.use('/', router);
app.use('/api', apiRouter);

module.exports = app;
