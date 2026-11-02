import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, SignupData, AuthResponse, SendOtpResponse } from '../types/auth';
import {
  authService,
  getCurrentSessionUser,
  getRememberedEmail,
  getRememberedPhone,
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  rememberedEmail: string;
  rememberedPhone: string;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  loginWithPhone: (
    phone: string,
    otpOrPassword: string,
    isOtp?: boolean,
    rememberMe?: boolean
  ) => Promise<AuthResponse>;
  sendPhoneOtp: (phone: string) => Promise<SendOtpResponse>;
  signup: (data: SignupData, autoLogin?: boolean) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<AuthResponse>;
  getRegisteredAccounts: () => User[];
  switchAccount: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rememberedEmail, setRememberedEmailState] = useState<string>('');
  const [rememberedPhone, setRememberedPhoneState] = useState<string>('');

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
      const savedPhone = getRememberedPhone();
      if (savedPhone) {
        setRememberedPhoneState(savedPhone);
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
        if (credentials.email) setRememberedEmailState(credentials.email);
        if (credentials.phone) setRememberedPhoneState(credentials.phone);
      } else {
        if (credentials.email) setRememberedEmailState('');
        if (credentials.phone) setRememberedPhoneState('');
      }
    }
    return res;
  };

  const loginWithPhone = async (
    phone: string,
    otpOrPassword: string,
    isOtp: boolean = true,
    rememberMe: boolean = false
  ): Promise<AuthResponse> => {
    const res = await authService.loginWithPhone(phone, otpOrPassword, isOtp, rememberMe);
    if (res.success && res.user) {
      setUser(res.user);
      if (rememberMe) {
        setRememberedPhoneState(phone);
      } else {
        setRememberedPhoneState('');
      }
    }
    return res;
  };

  const sendPhoneOtp = async (phone: string) => {
    return authService.sendPhoneOtp(phone);
  };

  const signup = async (data: SignupData, autoLogin: boolean = true): Promise<AuthResponse> => {
    const res = await authService.register(data, autoLogin);
    if (res.success && res.user && autoLogin) {
      setUser(res.user);
    }
    return res;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<AuthResponse> => {
    const res = await authService.updateProfile(updates);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const getRegisteredAccounts = (): User[] => {
    return authService.getRegisteredAccounts();
  };

  const switchAccount = async (userId: string): Promise<boolean> => {
    const switchedUser = await authService.switchAccount(userId);
    if (switchedUser) {
      setUser(switchedUser);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        rememberedEmail,
        rememberedPhone,
        login,
        loginWithPhone,
        sendPhoneOtp,
        signup,
        logout,
        updateProfile,
        getRegisteredAccounts,
        switchAccount,
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
