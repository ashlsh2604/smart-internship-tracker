import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, SignupData, AuthResponse } from '../types/auth';
import {
  authService,
  getCurrentSessionUser,
  getRememberedEmail,
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  rememberedEmail: string;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (data: SignupData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rememberedEmail, setRememberedEmailState] = useState<string>('');

  // Synchronize initial session from localStorage on application mount
  useEffect(() => {
    try {
      const activeUser = getCurrentSessionUser();
      if (activeUser) {
        setUser(activeUser);
      }
      const savedEmail = getRememberedEmail();
      if (savedEmail) {
        setRememberedEmailState(savedEmail);
      }
    } catch (e) {
      console.error('Failed to initialize auth state from storage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await authService.login(credentials);
    if (res.success && res.user) {
      setUser(res.user);
      if (credentials.rememberMe) {
        setRememberedEmailState(credentials.email);
      } else {
        setRememberedEmailState('');
      }
    }
    return res;
  };

  const signup = async (data: SignupData): Promise<AuthResponse> => {
    // Signup does NOT log the user in automatically according to project spec
    return await authService.register(data);
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        rememberedEmail,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
