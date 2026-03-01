import path from 'path';
import mongoose from 'mongoose';
import chalk from 'chalk';
import * as dotenv from 'dotenv';

// environment variables
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  debug: process.env.NODE_ENV === 'development',
  encoding: 'UTF-8',
});

// get the connection string and the database name from the environment variables.
const uri = process.env.MONGO_CONNECTION_STRING;
const dbName = process.env.DATABASE_NAME;

// validate environment variables
if (!uri) {
  throw new Error('MONGO_CONNECTION_STRING is not defined in the environment variables');
}
if (!dbName) {
  throw new Error('DATABASE_NAME is not defined in the environment variables');
}

// --- Event Listeners (Best practice: Define these before connecting) ---
mongoose.connection.on('connected', () => {
  console.log(chalk.green(`Mongoose connected to ${dbName}`));
});

mongoose.connection.on('error', (error) => {
  console.error(chalk.red(`Mongoose connection error: ${error}`));
});

mongoose.connection.on('disconnected', () => {
  console.warn(chalk.yellow('Mongoose disconnected'));
});

// handle application termination - graceful shutdown
// defined outside connect() so it is only registered once
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log(chalk.blue('\n Mongoose connection closed due to application termination.'));
});

// -- main connect function ---
async function connect() {
  try {
    // set mongoose options
    mongoose.set('strictQuery', true);

    // open mongoose's default connection to mongodb
    await mongoose.connect(uri, { dbName });

    console.log(
      chalk.blue('\n', `Successfully connected to the NOSQL database - ${dbName}.`, '\n')
    );
  } catch (error) {
    console.error(chalk.red('\n', `Unable to connect to the ${dbName} database: ${error}`, '\n'));
    process.exit(1);
  }
}

// -- disconnect function ---
async function disconnect() {
  try {
    await mongoose.connection.close();
    console.log(chalk.blue('Mongoose connection closed.'));
  } catch (error) {
    console.error(chalk.red('Error closing Mongoose connection:', error));
    throw error;
  }
}

export { connect, disconnect };
