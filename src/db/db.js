import process from 'process';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// load the environment variables
dotenv.config();

// get the connection string from the .env file
const connection_string = process.env.COSMOS_CONNECTION_STRING;

// opens Mongoose's default connection to MongoDB
mongoose
  .connect(connection_string)
  .then(() => {
    console.log('Successfully Connected to the database!');
  })
  .catch((error) => {
    console.log('Unable to connect to the database', error);
  });
