import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateSalt,
  hashPassword,
  evaluatePasswordStrength,
} from '../lib/crypto';
import { AuthService } from '../services/auth';

describe('Crypto & Authentication Engine (crypto.ts & auth.ts)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Cryptographic Helpers', () => {
    it('generates random hex salts of specified length', () => {
      const salt1 = generateSalt(16);
      const salt2 = generateSalt(16);

      expect(salt1.length).toBe(32); // 16 bytes = 32 hex chars
      expect(salt2.length).toBe(32);
      expect(salt1).not.toBe(salt2);
    });

    it('hashes passwords deterministically with the same salt', async () => {
      const salt = generateSalt(16);
      const hash1 = await hashPassword('SecretPassword123!', salt);
      const hash2 = await hashPassword('SecretPassword123!', salt);

      expect(hash1).toBe(hash2);
      expect(hash1.length).toBeGreaterThanOrEqual(32);
    });

    it('produces distinct hashes for distinct salts or distinct passwords', async () => {
      const salt1 = generateSalt(16);
      const salt2 = generateSalt(16);

      const hashA = await hashPassword('Password123', salt1);
      const hashB = await hashPassword('Password123', salt2);
      const hashC = await hashPassword('DifferentPassword123', salt1);

      expect(hashA).not.toBe(hashB);
      expect(hashA).not.toBe(hashC);
    });

    it('evaluates password strength according to length, casing, numbers, and symbols', () => {
      expect(evaluatePasswordStrength('').score).toBe(0);
      expect(evaluatePasswordStrength('short').score).toBe(0);
      expect(evaluatePasswordStrength('eightchars').score).toBe(1); // length
      expect(evaluatePasswordStrength('Eightchars').score).toBe(2); // length + uppercase
      expect(evaluatePasswordStrength('Eightchars1').score).toBe(3); // length + uppercase + number
      expect(evaluatePasswordStrength('Eightchars1!').score).toBe(4); // all 4 criteria
      expect(evaluatePasswordStrength('Eightchars1!').label).toBe('Strong');
    });
  });

  describe('AuthService Client-Side Accounts', () => {
    it('successfully signs up a new user, hashes password, and creates session', async () => {
      const user = await AuthService.signUp(
        'Student Developer',
        'student@srmist.edu.in',
        'StrongPassword2026!'
      );

      expect(user.id).toBeDefined();
      expect(user.name).toBe('Student Developer');
      expect(user.email).toBe('student@srmist.edu.in');
      expect(user.passwordHash).not.toBe('StrongPassword2026!'); // must be hashed, never plaintext

      const session = AuthService.getSession();
      expect(session).not.toBeNull();
      expect(session?.user.email).toBe('student@srmist.edu.in');
    });

    it('rejects duplicate email registrations', async () => {
      await AuthService.signUp('User One', 'unique@srmist.edu.in', 'Password1234');

      await expect(
        AuthService.signUp('User Two', 'unique@srmist.edu.in', 'AnotherPassword1234')
      ).rejects.toThrow('already exists');
    });

    it('successfully authenticates with correct credentials', async () => {
      await AuthService.signUp('Test User', 'auth@srmist.edu.in', 'MySecurePass1!');
      AuthService.clearSession();
      expect(AuthService.getSession()).toBeNull();

      const user = await AuthService.login('auth@srmist.edu.in', 'MySecurePass1!');
      expect(user.email).toBe('auth@srmist.edu.in');
      expect(AuthService.getSession()).not.toBeNull();
    });

    it('rejects authentication with incorrect credentials', async () => {
      await AuthService.signUp('Test User', 'auth2@srmist.edu.in', 'CorrectPassword123');

      await expect(
        AuthService.login('auth2@srmist.edu.in', 'WrongPassword123')
      ).rejects.toThrow('Invalid email or password');

      await expect(
        AuthService.login('nonexistent@domain.com', 'AnyPassword123')
      ).rejects.toThrow('Invalid email or password');
    });

    it('creates pre-seeded demo session via loginDemo', () => {
      const demo = AuthService.loginDemo();
      expect(demo.isDemo).toBe(true);
      expect(demo.name).toBe('Demo Designer');
      expect(AuthService.getSession()?.user.isDemo).toBe(true);
    });

    it('completely removes user account and clears local data on deleteAccount', async () => {
      await AuthService.signUp('Delete Me', 'deleteme@domain.com', 'Pass123456');
      expect(AuthService.getSession()).not.toBeNull();

      AuthService.deleteAccount();
      expect(AuthService.getSession()).toBeNull();

      // Trying to log back in should fail
      await expect(
        AuthService.login('deleteme@domain.com', 'Pass123456')
      ).rejects.toThrow('Invalid email or password');
    });
  });
});
