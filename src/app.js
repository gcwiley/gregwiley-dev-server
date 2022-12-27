import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import express from 'express';
import logger from 'morgan';
import { applicationDefault, initializeApp } from 'firebase-admin/app';

// get the current file name
const __filename = fileURLToPath(import.meta.url);

// get the directory name of the current file
const __dirname = path.dirname(__filename);

// Initialize the Firebase SDK
initializeApp({
  credential: applicationDefault(),
});

// import database connection
import './db/db.js';

// import the routers
import { projectRouter } from './routes/project.js';
import { postRouter } from './routes/post.js';

// create an express instance
const app = express();

// set the port
const PORT = process.env.PORT || 8080;

// allow static access to the angular client side folder
app.use(express.static(path.join(__dirname, 'dist/wiley-dev-client')));

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
  res.sendFile(path.join(__dirname, 'dist/wiley-dev-client', 'index.html'));
});

// start the server
app.listen(PORT, () => {
  console.log(`Successfully started server running on port ${PORT}`);
});
