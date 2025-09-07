import path from 'path';
import process from 'process';
import mongoose from 'mongoose';
import chalk from 'chalk';
import * as dotenv from 'dotenv';

// environment variables
dotenv.config({
   path: path.resolve(process.cwd(), '.env'),
   debug: process.env.NODE_ENV === 'development', // only debug in development
   encoding: 'UTF-8',
});

// get the connection string and the database name from the environment variables.
const uri = process.env.GOOGLE_CLOUD_FIRESTORE;
const dbName = process.env.DATABASE_NAME;

// validate environment variables - ensures required variables are define
if (!uri) {
   throw new Error('MONGO_CONNECTION_STRING is not defined in the enviroment variables');
}

if (!dbName) {
   throw new Error('DATABASE_NAME is not defined in the environment variables');
}

async function connect() {
   try {
      // set mongoose options
      mongoose.set('strictQuery', true);

      // open mongoose's default connection to mongodb
      await mongoose.connect(uri, { dbName });
      console.log(
         chalk.blue(
            '\n',
            `Successfully connected to the NOSQL database - ${dbName} on Google Cloud`,
            '\n'
         )
      );

      // handle connection events - logs connection events for better debugging
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
      // closes the connection properly on application termination
      process.on('SIGINT', async () => {
         await mongoose.connection.close();
         console.log(chalk.blue('Mongoose connection closed due to application termination'));
         process.exit(0);
      });
   } catch (error) {
      console.error(chalk.red('\n', `Unable to connect to the ${dbName} database: ${error}`, '\n'));
      process.exit(1); // application exit
   }
}

export { connect };
