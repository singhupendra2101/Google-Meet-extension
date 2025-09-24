import mongoose from 'mongoose';
import 'dotenv/config';

const url = process.env.DB_URL;

mongoose.connect(url)
  .then((result) => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

export const { model, Schema } = mongoose;
