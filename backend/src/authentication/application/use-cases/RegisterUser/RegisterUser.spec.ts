import { RegisterUser } from './RegisterUser';
import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';

describe('RegisterUser', () => {
  it('should register and save a user', async () => {
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

    const registerUser = new RegisterUser(userRepository);

    const user = await registerUser.execute({
      id: 'user-123',
      email: 'User@Example.com',
      passwordHash: 'hashed-password',
    });

    expect(user.id).toBe('user-123');
    expect(user.email.value).toBe('user@example.com');
    expect(user.passwordHash).toBe('hashed-password');
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

    const registerUser = new RegisterUser(userRepository);

    await expect(
      registerUser.execute({
        id: 'user-123',
        email: 'invalid-email',
        passwordHash: 'hashed-password',
      }),
    ).rejects.toThrow('Invalid email address');
  });
});