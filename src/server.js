import { loadSecrets } from './secrets.js';

// Load secrets BEFORE importing app.js so that all of app.js's static
// dependencies (models → connect_to_sqldb.js) are evaluated only after
// the env vars are set in process.env.
// This is important because connect_to_sqldb.js reads env vars at import time to configure the Sequelize instance, and if they are not set, it will throw an error.
// Note: This is a top-level await, which is supported in ES modules (type: "module" in package.json).

// Load secrets from Google Secret Manager or .env file
await loadSecrets();

// Import the app.js module after secrets are loaded 
// This ensures that the Sequelize instance is configured with the correct environment variables before any models are defined or database connections are attempted.
// Note: We use dynamic import here to ensure that the secrets are loaded before app.js is evaluated.
// This is important because connect_to_sqldb.js reads env vars at import time to configure the Sequelize instance, and if they are not set, it will throw an error.
await import('./app.js');