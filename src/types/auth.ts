export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  college?: string;
  major?: string;
  targetRole?: string;
  graduationYear?: string;
}

export interface RegisteredUser extends User {
  password?: string;
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
  method?: 'email' | 'phone';
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
  signupMethod?: 'email' | 'phone';
  agreeTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
  demoOtp?: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  code?: string;
  demoOtp?: string;
  phone?: string;
  smsUrl?: string;
  whatsappUrl?: string;
  carrierNotice?: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}

