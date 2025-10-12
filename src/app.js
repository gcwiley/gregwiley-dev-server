import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import admin from 'firebase-admin';
import express from 'express';
import logger from 'morgan';

// get the current file name
const __filename = fileURLToPath(import.meta.url);
// get the directory name of the current file
const __dirname = path.dirname(__filename);

// import the credentials
import { serviceAccount } from '../credentials/service-account.js';

// initialize the firebase SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`,
});

// initialize firebase storage
const bucket = admin.storage().bucket(); // get the default storage bucket

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

// catch-all: return angular app for client-side routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/gregwiley-dev-client/browser/index.html'));
});

// centralized error handler
app.use((err, req, res) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
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