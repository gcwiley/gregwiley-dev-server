import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// get the current file name
const __filename = fileURLToPath(import.meta.url);
// get the directory name of the current file
const __dirname = path.dirname(__filename);

import express from 'express';
import logger from 'morgan';

// set up firebase
import { applicationDefault, initializeApp } from 'firebase-admin/app';

// Initialize the Firebase SDK
initializeApp({
  credential: applicationDefault(),
});

// import the routers
import { projectRouter } from './routes/project.js';
import { postRouter } from './routes/post.js';

// initialize the database connection function
import { connect } from './db/connect.js';

// connect to the mongo database
connect();

// create an express application
const app = express();

// set up port
const port = process.env.PORT || 3000;

// allow static access to the angular client-side folder
app.use(express.static(path.join(__dirname, '/dist/wiley-dev-client')));

// automatically parse incoming JSON to an object so we can access it in our request handlers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create a logger middleware
app.use(logger('dev'));

// register the routers
app.use(projectRouter);
app.use(postRouter);

// handle all other routes with angular app - returns angular app
app.get('*', (req, res) => {
  // send back the angular index.html file
  res.sendFile(path.join(__dirname, './dist/wiley-dev-client', 'index.html'));
});

// listen for connections
app.listen(port, () => {
  console.log(chalk.green(`Successfully started server running on port ${port}`));
});
