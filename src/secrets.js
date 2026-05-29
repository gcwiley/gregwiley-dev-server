import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// singleton pattern for Secret Manager client
let client;

export async function getSecret(secretName) {
  // initialize client if it doesn't exist.
  if (!client) {
    client = new SecretManagerServiceClient()
  }
  // allow overriding the project ID if secrets are located in a different GCP project
  const projectId =
    process.env.SECRETS_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
  if (!projectId) {
    // throw an error if the project ID is not set, since it is required to access secrets
    throw new Error(
      'Neither SECRETS_PROJECT_ID nor GOOGLE_CLOUD_PROJECT environment variable is set.',
    );
  }

  const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;

  const [response] = await client.accessSecretVersion({ name });
  return response.payload.data.toString('utf8');
}

// load all required secrets into process.env concurrently
export async function loadSecrets() {
  // only load secrets from Secret Manager in production (GCP App Engine)
  if (process.env.NODE_ENV === 'production' || process.env.GAE_ENV) {
    // fetch all secrets in parallel
    const [mongoConn, mongoPass, corsOrigin] = await Promise.all([
      getSecret('MONGO_CONNECTION_STRING'),
      getSecret('CORS_ORIGIN'),
    ]);

    process.env.MONGO_CONNECTION_STRING = mongoConn;
    process.env.MONGO_DATABASE_PASSWORD = mongoPass;
    process.env.CORS_ORIGIN = corsOrigin;

    console.log('Secrets loaded from Google Secret Manager in parallel.');
  } else {
    // in local dev, continue using dotenv / .env file
    console.log('Using local .env file for secrets.');
  }
}
