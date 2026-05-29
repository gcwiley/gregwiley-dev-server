import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import admin from 'firebase-admin';
import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';

// load environment variables
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  debug: process.env.NODE_ENV === 'development',
  encoding: 'UTF-8'
})

// load secrets first
import { loadSecrets } from './secrets.js';
await loadSecrets();

// dynamically import application dependencies after secrets are in process.env
const { connect, disconnect } = await import('./db/connect.js');
const { projectRouter } = await import('./routes/project.routes.js');

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
// get the directory name of the current module
const __dirname = path.dirname(__filename);
// port for the server to listen on
const PORT = process.env.PORT || 3000;
// CORS origin - must match your Angular app's URL
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';
// path to the Angular build output
const angularDistPath = path.join(
  __dirname,
  './dist/gregwiley-dev-client/browser',
);

// --- FIREBASE CREDENTIALS ---
let serviceAccountCredential;

if (process.env.NODE_ENV === 'production' || process.env.GAE_ENV) {
  serviceAccountCredential = admin.credential.applicationDefault();
} else {
  // local development fallback
  const serviceAccountJson = JSON.parse(
    readFileSync(
      path.join(__dirname, '../credentials/service-account.json'),
      'utf-8',
    ),
  );
  serviceAccountCredential = admin.credential.cert(serviceAccountJson);
}

// --- FIREBASE INIT ---
admin.initializeApp({
  credential: serviceAccountCredential,
  storageBucket: `${process.env.GOOGLE_CLOUD_PROJECT || 'fix this!'}.appspot.com`,
});
const bucket = admin.storage().bucket();

// --- EXPRESS ---
const app = express();

// trust first proxy (GAE load balancer)
if (process.env.NODE_ENV === 'production' || process.env.GAE_ENV) {
  app.set('trust proxy', 1);
}

// --- HELMET ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'https://storage.googleapis.com'],
      },
    },
  }),
);

// --- CORS ---
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);

// --- MORGAN LOGGER ---
app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- BODY PARSERS ---
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// --- STATIC FILES ---
app.use(express.static(angularDistPath));

// attach bucket to request
app.use((req, res, next) => {
  req.bucket = bucket;
  next();
});

// --- API RATE LIMITING ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

// apply the rate limiting middleware to API calls
app.use('/api', apiLimiter);

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
  if (res.headersSent) {
    return next(error);
  }
  const status = error.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : error.message,
  });
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
