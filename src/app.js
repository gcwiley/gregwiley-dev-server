import path from 'node:path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
import logger from 'morgan';
import { applicationDefault, initializeApp } from 'firebase-admin/app';

// import the routers
import { projectRouter } from './routes/project.js';
import { postRouter } from './routes/post.js';

// Initialize the Firebase SDK
initializeApp({
  credential: applicationDefault(),
});

// import the database connection
import './db/db.js';

// create an express application
const app = express();

const port = process.env.PORT || 3000;

// allow static access to the angular client side folder
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
  console.log(`Successfully started server running on port ${port}`);
});
