import { pool } from '../database/database';
import { DrizzleUserRepository } from './DrizzleUserRepository';
import { Email } from '../../domain/value-objects/Email';
import { User } from '../../domain/entities/User';

describe('DrizzleUserRepository integration', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('should save and find a user in PostgreSQL', async () => {
    const repository = new DrizzleUserRepository();

    const email = `integration-${Date.now()}@example.com`;

    const user = User.create(
      `integration-${Date.now()}`,
      Email.create(email),
      'hashed-password',
    );

    await repository.save(user);

    const result = await repository.findByEmail(
      Email.create(email),
    );

    expect(result).not.toBeNull();
    expect(result?.id).toBe(user.id);
    expect(result?.email.value).toBe(email);
    expect(result?.passwordHash).toBe('hashed-password');
    expect(result?.emailVerified).toBe(false);
  });
});