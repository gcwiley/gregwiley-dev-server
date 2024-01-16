import path from 'path';
import process from 'process';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// load the environment variables
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
    // opens mongoose's default connection to mongodb
    await mongoose.connect(uri, { dbName: dbName });
    console.log('\n', `Successfully connected to the database - ${dbName}`, '\n');
  } catch (error) {
    console.error('\n', `Unable to connect to the ${dbName} database: ${error}`, '\n');
  }
}

// export the function
export { connect };
