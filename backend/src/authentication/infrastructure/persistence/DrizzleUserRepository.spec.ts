import { DrizzleUserRepository } from './DrizzleUserRepository';
import { Email } from '../../domain/value-objects/Email';
import { User } from '../../domain/entities/User';

jest.mock('../database/database', () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
  },
}));

import { db } from '../database/database';

describe('DrizzleUserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save a user', async () => {
    const values = jest.fn().mockResolvedValue(undefined);

    (db.insert as jest.Mock).mockReturnValue({
      values,
    });

    const repository = new DrizzleUserRepository();

    const user = User.create(
      'user-123',
      Email.create('user@example.com'),
      'hashed-password',
    );

    await repository.save(user);

    expect(db.insert).toHaveBeenCalled();
    expect(values).toHaveBeenCalledWith({
      id: 'user-123',
      email: 'user@example.com',
      passwordHash: 'hashed-password',
      emailVerified: false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });

  it('should return null when a user is not found', async () => {
    const limit = jest.fn().mockResolvedValue([]);

    const where = jest.fn().mockReturnValue({
      limit,
    });

    const from = jest.fn().mockReturnValue({
      where,
    });

    (db.select as jest.Mock).mockReturnValue({
      from,
    });

    const repository = new DrizzleUserRepository();

    const result = await repository.findByEmail(
      Email.create('user@example.com'),
    );

    expect(result).toBeNull();
  });

  it('should return a user when found', async () => {
    const limit = jest.fn().mockResolvedValue([
      {
        id: 'user-123',
        email: 'user@example.com',
        passwordHash: 'hashed-password',
        emailVerified: true,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-02'),
      },
    ]);

    const where = jest.fn().mockReturnValue({
      limit,
    });

    const from = jest.fn().mockReturnValue({
      where,
    });

    (db.select as jest.Mock).mockReturnValue({
      from,
    });

    const repository = new DrizzleUserRepository();

    const result = await repository.findByEmail(
      Email.create('user@example.com'),
    );

    expect(result).not.toBeNull();
    expect(result?.id).toBe('user-123');
    expect(result?.email.value).toBe('user@example.com');
    expect(result?.passwordHash).toBe('hashed-password');
    expect(result?.emailVerified).toBe(true);
    expect(result?.createdAt).toEqual(new Date('2026-01-01'));
    expect(result?.updatedAt).toEqual(new Date('2026-01-02'));
  });
});