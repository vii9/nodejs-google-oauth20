const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const handlebarsEngine = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');

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

// Template engine Handlebars
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
