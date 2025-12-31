import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import admin from 'firebase-admin';
import express from 'express';
import logger from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { serviceAccount } from '../credentials/service-account.js';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`,
});

const bucket = admin.storage().bucket();
import { projectRouter } from './routes/project.js';
import { connect } from './db/connect.js';

const app = express();

const port = process.env.PORT || 3000;

// allow static access to the angular client-side folder
const clientDistPath = path.join(__dirname, './dist/gregwiley-dev-client/browser');
app.use(express.static(clientDistPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use((req, res, next) => {
  req.bucket = bucket;
  next();
});

// --- ROUTES ---
app.use('/api/projects', projectRouter);

// --- STATIC FILES ---
app.get('*', (req, res) => {
  res.sendFile(path.resolve(clientDistPath, 'index.html'));
});

// global error handler - express requires 4 args for error handlers
app.use((error, req, res, next) => {
  console.error(chalk.red('Server Error:', error.stack));
  // ensure we don't try to send a response if one was already sent
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(500)
    .json({ error: 'Internal Server Error', message: error.message });
});

// --- SERVER STARTUP ---
const startServer = async () => {
  try {
    await connect();

    app.listen(port, () => {
      console.log(chalk.green(`Successfully started server running on port ${port}`));
    });
  } catch (error) {
    console.error(chalk.red('Failed to connect to MongoDB:', error));
    process.exit(1);
  }
};

startServer();
