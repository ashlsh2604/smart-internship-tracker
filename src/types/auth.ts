export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface RegisteredUser extends User {
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  agreeTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}
