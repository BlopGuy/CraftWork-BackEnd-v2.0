require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');


require('./configs/passport');


mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app
.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialed: true,
  resave: true,
  cookie: {
    sameSite: true,
    secure: false,
    httpOnly: true,
    maxAge: 60000
  },
  rolling: true
}));

app.use(passport.initialize());
app.use(passport.session());

app
  .use(
    cors({
      credentials: true,
      origin: [process.env.CLIENT_HOSTNAME]
    })
  )


const index = require('./routes/index');
app.use('/', index);

const projectRoutes = require('./routes/project-routes');
app.use('/api', projectRoutes);

const authRoutes = require('./routes/auth-routes');
app.use('/api', authRoutes);


module.exports = app;
