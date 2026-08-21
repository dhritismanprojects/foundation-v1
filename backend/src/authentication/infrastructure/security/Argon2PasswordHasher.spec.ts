import { Argon2PasswordHasher } from './Argon2PasswordHasher';

describe('Argon2PasswordHasher', () => {
  it('should hash a password', async () => {
    const passwordHasher = new Argon2PasswordHasher();

    const password = 'plain-password';

    const hash = await passwordHasher.hash(password);

    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$argon2id\$/);
  });
});