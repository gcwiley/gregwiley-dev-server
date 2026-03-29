import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// create the secret manager client
const client = new SecretManagerServiceClient();

// get the secret value from Google Secret Manager
export async function getSecret(secretName, version = 'latest') {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  if (!projectId) {
    throw new Error('GOOGLE_CLOUD_PROJECT environment variable is not set.');
  }

  const name = `projects/${projectId}/secrets/${secretName}/versions/${version}`;

  const [response] = await client.accessSecretVersion({ name });
  return response.payload.data.toString('utf8');
}

// load all required secrets into process.env
export async function loadSecrets() {
  // only load from secret manager in production (App Engine)
  if (process.env.NODE_ENV === 'production' || process.env.GAE_ENV) {
    process.env.MONGO_CONNECTION_STRING = await getSecret(
      'MONGO_CONNECTION_STRING',
    );
    process.env.MONGO_DATABASE_PASSWORD = await getSecret(
      'MONGO_DATABASE_PASSWORD',
    );
    process.env.CORS_ORIGIN = await getSecret('CORS_ORIGIN');
    // logs secrets loaded from Google Secret Manager
    console.log('Secrets loaded from Google Secret Manager.');
  } else {
    // in local dev, continue using dotenv / .env file
    console.log('Using local .env file for secrets.');
  }
}
