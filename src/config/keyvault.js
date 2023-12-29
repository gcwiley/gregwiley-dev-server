import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const getSecret = async (secretName, keyVaultName) => {
  if (!secretName || !keyVaultName) {
    throw Error('getSecret: Required params missing');
  }

  const credential = new DefaultAzureCredential();

  //   build the URL to reach your key vault
  const url = `https://${keyVaultName}.vault.azure.net`;

  try {
    // create client to connect to service
    const client = new SecretClient(url, credential);

    // get secret object
    const latestSecret = await client.getSecret(secretName);

    console.log(`Secret (${secretName}=${latestSecret.value})`);

    // return value
    return latestSecret.value;
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
};

// export the fuction
export { getSecret };
