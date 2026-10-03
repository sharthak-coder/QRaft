import { User, Session } from '../types';
import { generateSalt, hashPassword } from '../lib/crypto';
import { DEMO_USER_ID, DEMO_USER_EMAIL, DEMO_USER_NAME } from './seed';

const USERS_KEY = 'qraft:users:v1';
const SESSION_KEY = 'qraft:session:v1';

export class AuthService {
  private static getUsers(): User[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private static saveUsers(users: User[]): void {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (err) {
      console.error('Failed to save users to localStorage', err);
    }
  }

  public static getSession(): Session | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) return null;
      const session: Session = JSON.parse(data);
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  public static setSession(user: User): Session {
    const session: Session = {
      user,
      token: `tok_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (err) {
      console.error('Failed to persist session', err);
    }
    return session;
  }

  public static clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (err) {
      console.error('Failed to clear session', err);
    }
  }

  public static async signUp(name: string, email: string, password: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const salt = generateSalt(16);
    const passwordHash = await hashPassword(password, salt);

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      salt,
      createdAt: Date.now(),
      following: [],
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setSession(newUser);
    return newUser;
  }

  public static async login(email: string, password: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('Invalid email or password. Please try again.');
    }

    const computedHash = await hashPassword(password, user.salt);
    if (computedHash !== user.passwordHash) {
      throw new Error('Invalid email or password. Please try again.');
    }

    this.setSession(user);
    return user;
  }

  public static loginDemo(): User {
    const demoUser: User = {
      id: DEMO_USER_ID,
      name: DEMO_USER_NAME,
      email: DEMO_USER_EMAIL,
      passwordHash: 'demo_prehashed',
      salt: 'demo_salt',
      createdAt: Date.now() - 86400000 * 30,
      isDemo: true,
      following: [],
    };

    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === DEMO_USER_ID);
    if (existingIndex >= 0) {
      users[existingIndex] = demoUser;
    } else {
      users.push(demoUser);
    }
    this.saveUsers(users);
    this.setSession(demoUser);
    return demoUser;
  }

  public static toggleFollow(authorId: string): User | null {
    const session = this.getSession();
    if (!session) return null;

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === session.user.id);
    if (userIndex < 0) return null;

    const user = users[userIndex];
    const isFollowing = user.following.includes(authorId);
    if (isFollowing) {
      user.following = user.following.filter(id => id !== authorId);
    } else {
      user.following.push(authorId);
    }

    users[userIndex] = user;
    this.saveUsers(users);
    this.setSession(user);
    return user;
  }

  public static deleteAccount(): void {
    const session = this.getSession();
    if (!session) return;

    const users = this.getUsers().filter(u => u.id !== session.user.id);
    this.saveUsers(users);
    this.clearSession();

    // Clean up user's templates and recent items
    try {
      const tmplData = localStorage.getItem('qraft:templates:v1');
      if (tmplData) {
        const templates = JSON.parse(tmplData);
        if (Array.isArray(templates)) {
          const remaining = templates.filter(t => t.authorId !== session.user.id);
          localStorage.setItem('qraft:templates:v1', JSON.stringify(remaining));
        }
      }
      localStorage.removeItem('qraft:recent:v1');
    } catch (err) {
      console.error('Error cleaning up local data', err);
    }
  }
}
