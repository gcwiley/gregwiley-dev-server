import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import admin from 'firebase-admin';
import multer from 'multer';

// get the current file name
const __filename = fileURLToPath(import.meta.url);
// get the directory name of the current file
const __dirname = path.dirname(__filename);

import express from 'express';
import logger from 'morgan';

// import the credentials
import { serviceAccount } from '../credentials/service-account.js';

// initialize the firebase SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// initialize firebase storage
const bucket = admin.storage().bucket(); // get the default storage bucket

// configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // store files in memory
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB lumit
  },
});

// import the routers
import { projectRouter } from './routes/project.js';

// initialize the database connection function
import { connect } from './db/connect.js';

// create an express application
const app = express();

// set up port
const port = process.env.PORT || 3000;

// allow static access to the angular client-side folder
app.use(express.static(path.join(__dirname, '/dist/gregwiley-dev-client/browser')));

// automatically parse incoming JSON to an object so we can access it in our request handlers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create a logger middleware
app.use(logger('dev'));

// make the firebase storage bucket and upload middleware available to request handlers
app.use((req, res, next) => {
  req.bucket = bucket; // attach the firebase storage bucket
  next();
});

// register the routers
app.use(projectRouter);

// handle all other routes with angular app - returns angular app - catch all route
app.get('*', (req, res) => {
  // send back the angular index.html file
  res.sendFile(path.join(__dirname, './dist/gregwiley-dev-client/browser', 'index.html'));
});

// function to start the server
const startServer = async () => {
  try {
    // connect to the mongo database and wait for it
    await connect();
    console.log(chalk.blue('Successfully connected to MongoDB.'));

    // listen for connections only after DB connection is successful
    app.listen(port, () => {
      console.log(chalk.green(`Successfully started server running on port ${port}`));
    });
  } catch (error) {
    console.error(chalk.red('Failed to connect to MongoDB:', error));
    process.exit(1); // exit if DB connection fails on startup
  }
};

// start the server
startServer();

// export upload middleware for use in routes
export { upload };
