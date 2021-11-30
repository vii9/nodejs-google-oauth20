const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const handlebarsEngine = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

// check DB connections
connectDB();

const PORT = process.env.PORT || 9234;

const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

// Template engine Handlebars xxYx
app.engine(
  '.hbs',
  handlebarsEngine.engine({ defaultLayout: 'main', extname: '.hbs' })
);
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      mongooseConnection: mongoose.connection,
      ttl: 5 * 60, // save session : 60=1 minute lag
      // ttl: 14 * 24 * 60 * 60 // save session for 14 days
    }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

app.listen(PORT, () => {
  console.log(
    `dnt:FROM SERVER: app running on ${process.env.NODE_ENV} with port ${PORT}`
  );
});
