import { RegisterUser } from './RegisterUser';
import { UserRepository } from '../../repositories/UserRepository';
import type { PasswordHasher } from '../../services/PasswordHasher';
import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';

describe('RegisterUser', () => {
  it('should register and save a user with a hashed password', async () => {
    const savedUsers: User[] = [];

    const userRepository: UserRepository = {
      async save(user: User): Promise<void> {
        savedUsers.push(user);
      },

      async findByEmail(email: Email): Promise<User | null> {
        return (
          savedUsers.find(
            (user) => user.email.value === email.value,
          ) ?? null
        );
      },
    };

    const passwordHasher: PasswordHasher = {
      async hash(password: string): Promise<string> {
        return `hashed-${password}`;
      },
    };

    const registerUser = new RegisterUser(
      userRepository,
      passwordHasher,
    );

    const user = await registerUser.execute({
      id: 'user-123',
      email: 'User@Example.com',
      password: 'plain-password',
    });

    expect(user.id).toBe('user-123');
    expect(user.email.value).toBe('user@example.com');
    expect(user.passwordHash).toBe('hashed-plain-password');
    expect(user.emailVerified).toBe(false);
    expect(savedUsers).toContain(user);
  });

  it('should reject an invalid email', async () => {
    const userRepository: UserRepository = {
      async save(): Promise<void> {},

      async findByEmail(): Promise<User | null> {
        return null;
      },
    };

    const passwordHasher: PasswordHasher = {
      async hash(password: string): Promise<string> {
        return `hashed-${password}`;
      },
    };

    const registerUser = new RegisterUser(
      userRepository,
      passwordHasher,
    );

    await expect(
      registerUser.execute({
        id: 'user-123',
        email: 'invalid-email',
        password: 'plain-password',
      }),
    ).rejects.toThrow('Invalid email address');
  });

  it('should reject registration when the email already exists', async () => {
    const existingUser = User.create(
      'existing-user',
      Email.create('existing@example.com'),
      'existing-hash',
    );

    const userRepository: UserRepository = {
      async save(): Promise<void> {},

      async findByEmail(email: Email): Promise<User | null> {
        return email.value === existingUser.email.value
          ? existingUser
          : null;
      },
    };

    const passwordHasher: PasswordHasher = {
      async hash(password: string): Promise<string> {
        return `hashed-${password}`;
      },
    };

    const registerUser = new RegisterUser(
      userRepository,
      passwordHasher,
    );

    await expect(
      registerUser.execute({
        id: 'user-123',
        email: 'existing@example.com',
        password: 'plain-password',
      }),
    ).rejects.toThrow('User already exists');
  });
});