import process from 'process';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// load the environment variables
dotenv.config();

// opens Mongoose's default connection to MongoDB
// connection method returns a promise

// get the connection string from the .env file
const connection_string = process.env.COSMOS_CONNECTION_STRING;

mongoose
  .connect(connection_string)
  .then(() => {
    console.log('Successfully Connected to Database!');
  })
  .catch((error) => {
    console.log('Unable to connect to database', error);
  });
