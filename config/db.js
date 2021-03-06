const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`dnt ==> MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

module.exports = connectDB;

// 01-02-2022 DL
// 01-01-2022 AL
