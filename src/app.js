import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import admin from 'firebase-admin';
import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { connect, disconnect } from './db/connect.js';
import { projectRouter } from './routes/project.js';
import { serviceAccount } from '../credentials/service-account.js';

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';
const angularDistPath = path.join(
  __dirname,
  './dist/gregwiley-dev-client/browser',
);

// --- FIREBASE INIT ---
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`,
});
const bucket = admin.storage().bucket();

// --- EXPRESS SETUP ---
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(angularDistPath));

// attach bucket to request
app.use((req, res, next) => {
  req.bucket = bucket;
  next();
});

// --- API RATE LIMITING ---
const apiLimiter = rateLimit({
  
})


// --- ROUTES ---
app.use('/api/projects', projectRouter);

// API 404 handler - must come BEFORE the catch-all
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// SPA catch-all - serves index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(angularDistPath, 'index.html'));
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

// --- STARTUP SEQUENCE ---
const startServer = async () => {
  try {
    await connect();

    const server = app.listen(PORT, () => {
      console.log(chalk.green(`\n✓ Server running on port ${PORT}\n`));
    });

    // Graceful shutdown handler
    const shutdown = async (signal) => {
      console.log(chalk.yellow(`\n${signal} received. Shutting down...`));

      server.close(async () => {
        try {
          await disconnect(); // Close DB connection
          console.log(chalk.green('✓ Server closed gracefully'));
          process.exit(0);
        } catch (err) {
          console.error(chalk.red('Error during shutdown:', err));
          process.exit(1);
        }
      });

      // Force exit if graceful shutdown takes too long
      setTimeout(() => {
        console.error(chalk.red('Forced shutdown after timeout'));
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error(chalk.red('Failed to start server:'), error);
    process.exit(1);
  }
};

startServer();
