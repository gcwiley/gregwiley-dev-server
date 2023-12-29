import * as dotenv from 'dotenv';
import process from 'process';

// load env variables from .env file
dotenv.config();

import { getSecret } from './keyvault';

async function putKeyVaultSecretInEnvVar() {
  const secretName = process.env.KEY_VAULT_SECRET_NAME_DATABASE_URL;
  const keyVaultName = process.env.KEY_VAULT_NAME;

  if (!secretName || !keyVaultName) throw Error('getSecret: Required params missing');

  const connectionString = await getSecret(secretName, keyVaultName);
  process.env.DATABASE_URL = connectionString;
}

async function getConnectionInfo() {
  if (!process.env.DATABASE_URL) {
    await putKeyVaultSecretInEnvVar();

    // still dont have a database url?
    if (!process.env.DATABASE_URL) {
      throw new Error('No value in DATABASE_URL in env var');
    }
  }

  // to override the database name, set the DATABASE_NAME environment variable in the .env file
  const DATABASE_NAME = process.env.DATABASE_NAME || 'my-library-app';

  console.log(DATABASE_NAME);

  return {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_NAME: process.env.DATABASE_NAME,
  };
}

// export the function
export { getConnectionInfo };
