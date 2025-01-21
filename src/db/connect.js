import path from 'path';
import process from 'process';
import mongoose from 'mongoose';
import chalk from 'chalk';
import * as dotenv from 'dotenv';

// load in the environment variables
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  debug: true,
});

// get the connection string from the .env file
const uri = process.env.COSMOS_CONNECTION_STRING;

// get the name of the database from the .env file
const dbName = process.env.DATABASE_NAME;

async function connect() {
  try {
    // set mongoose options
    mongoose.set('strictQuery', true);
    // opens mongoose's default connection to mongodb
    await mongoose.connect(uri, { dbName: dbName });
    console.log(chalk.blue(`Successfully connected to the NOSQL database - ${dbName} on COSMOS`, '\n'));
  } catch (error) {
    console.error(chalk.red('\n', `Unable to connect to the ${dbName} database: ${error}`, '\n'));
  }
}

// export the connect function
export { connect };
