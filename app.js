const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


// Load config
dotenv.config({ path: './config/config.env' });

// check DB connections
connectDB();

const PORT = process.env.PORT || 9234;

const app = express();

app.listen(PORT, () => {
  console.log(
    `dnt:FROM SERVER: app running on ${process.env.NODE_ENV} with port ${PORT}`
  );
});
