import { describe, it, expect, vi } from 'vitest';

// mock the Secret Manager client before importing
vi.mock('@google-cloud/secret-manager', () => ({
  SecretManagerServiceClient: vi.fn().mockImplementation(() => ({
    accessSecretVersion: vi.fn().mockResolvedValue([
      {
        payload: { data: Buffer.from('mock-secret-value') },
      },
    ]),
  })),
}));

// now import the function under test
const { getSecret } = await import('../secrets.js');

describe('getSecret', () => {
  it('throws if project ID environment are not set', async () => {
    delete process.env.GOOGLE_CLOUD_PROJECT;
    delete process.env.SECRETS_PROJECT_ID;
    await expect(getSecret('TEST_SECRET')).rejects.toThrow(
      'Neither SECRETS_PROJECT_ID nor GOOGLE_CLOUD_PROJECT environment variable is set.',
    );
  });

  it('returns the secret value when project ID is set', async () => {
    process.env.GOOGLE_CLOUD_PROJECT = 'test-project';
    const value = await getSecret('TEST_SECRET');
    expect(value).toBe('mock-secret-value');
  });
});
