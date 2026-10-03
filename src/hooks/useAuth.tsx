import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '../types';
import { AuthService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  login: (email: string, pass: string) => Promise<User>;
  signUp: (name: string, email: string, pass: string) => Promise<User>;
  loginDemo: () => User;
  logout: () => void;
  deleteAccount: () => void;
  toggleFollow: (authorId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(() => AuthService.getSession());

  useEffect(() => {
    const existing = AuthService.getSession();
    if (existing) {
      setSession(existing);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    const user = await AuthService.login(email, pass);
    const newSession = AuthService.getSession();
    setSession(newSession);
    return user;
  };

  const signUp = async (name: string, email: string, pass: string): Promise<User> => {
    const user = await AuthService.signUp(name, email, pass);
    const newSession = AuthService.getSession();
    setSession(newSession);
    return user;
  };

  const loginDemo = (): User => {
    const user = AuthService.loginDemo();
    const newSession = AuthService.getSession();
    setSession(newSession);
    return user;
  };

  const logout = () => {
    AuthService.clearSession();
    setSession(null);
  };

  const deleteAccount = () => {
    AuthService.deleteAccount();
    setSession(null);
  };

  const toggleFollow = (authorId: string) => {
    const updatedUser = AuthService.toggleFollow(authorId);
    if (updatedUser) {
      setSession(AuthService.getSession());
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        session,
        isAuthenticated: !!session?.user,
        isDemo: !!session?.user?.isDemo,
        login,
        signUp,
        loginDemo,
        logout,
        deleteAccount,
        toggleFollow,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
