const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const handlebarsEngine = require('express-handlebars');

// Load config
dotenv.config({ path: './config/config.env' });

// check DB connections
connectDB();

const PORT = process.env.PORT || 9234;

const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Template engine Handlebars
app.engine(
  '.hbs',
  handlebarsEngine.engine({ defaultLayout: 'main', extname: '.hbs' })
);
app.set('view engine', '.hbs');
app.set('views', './views');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));

app.listen(PORT, () => {
  console.log(
    `dnt:FROM SERVER: app running on ${process.env.NODE_ENV} with port ${PORT}`
  );
});
