import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';

export interface UserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: Email): Promise<User | null>;
}