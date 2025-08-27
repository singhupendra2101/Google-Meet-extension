const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.DB_URL;

mongoose.connect(url)
  .then((result) => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;
