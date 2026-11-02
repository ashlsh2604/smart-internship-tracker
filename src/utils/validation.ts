import { ValidationErrors, LoginCredentials, SignupData } from '../types/auth';

/**
 * Standard email format regex pattern for frontend validation.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normalizes phone numbers to standard format (e.g. "+1 (555) 019-2834" -> "+15550192834")
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return hasPlus ? `+${digits}` : digits;
}

/**
 * Validates whether a phone string contains a plausible international phone number (6-15 digits)
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 6 && digits.length <= 15;
}

/**
 * Formats a raw or partial phone number for clean UI presentation
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

/**
 * Validates login form inputs (supports both Email and Phone methods).
 */
export function validateLoginForm(credentials: LoginCredentials): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  if (credentials.method === 'phone') {
    // Phone method
    if (!credentials.phone || credentials.phone.trim() === '') {
      errors.phone = 'Mobile phone number is required.';
    } else if (!isValidPhoneNumber(credentials.phone)) {
      errors.phone = 'Please enter a valid international mobile phone number (6–15 digits).';
    }

    if (credentials.otp !== undefined) {
      // OTP mode
      const otpDigits = (credentials.otp || '').replace(/\D/g, '');
      if (!otpDigits) {
        errors.otp = 'Verification code is required.';
      } else if (otpDigits.length !== 6) {
        errors.otp = 'Verification code must be 6 digits.';
      }
    } else {
      // Password mode
      if (!credentials.password || credentials.password === '') {
        errors.password = 'Password is required.';
      } else if (credentials.password.length < 6) {
        errors.password = 'Password must contain at least 6 characters.';
      }
    }
  } else {
    // Default: Email validation
    if (!credentials.email || credentials.email.trim() === '') {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(credentials.email.trim())) {
      errors.email = 'Please enter a valid email.';
    }

    // Password validation
    if (!credentials.password || credentials.password === '') {
      errors.password = 'Password is required.';
    } else if (credentials.password.length < 6) {
      errors.password = 'Password must contain at least 6 characters.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates phone OTP send request.
 */
export function validatePhoneSendOtp(phone: string): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  if (!phone || phone.trim() === '') {
    errors.phone = 'Mobile phone number is required.';
  } else if (!isValidPhoneNumber(phone)) {
    errors.phone = 'Please enter a valid mobile phone number with country code.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates signup form inputs (supports both Email and Phone signup).
 */
export function validateSignupForm(data: SignupData): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  // Full name validation
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Full name is required.';
  }

  if (data.signupMethod === 'phone') {
    // Phone validation
    if (!data.phone || data.phone.trim() === '') {
      errors.phone = 'Phone number is required.';
    } else if (!isValidPhoneNumber(data.phone)) {
      errors.phone = 'Please enter a valid phone number (7–15 digits).';
    }

    // Optional email validation if provided
    if (data.email && data.email.trim() !== '' && !EMAIL_REGEX.test(data.email.trim())) {
      errors.email = 'Please enter a valid email or leave it blank.';
    }

    // OTP validation if provided in signup
    if (data.otp !== undefined) {
      const otpDigits = data.otp.replace(/\D/g, '');
      if (!otpDigits) {
        errors.otp = 'Verification code is required.';
      } else if (otpDigits.length !== 6) {
        errors.otp = 'Verification code must be 6 digits.';
      }
    }

    // Password validation (optional if OTP verified, but recommended)
    if (data.password && data.password.length < 6) {
      errors.password = 'Password must contain at least 6 characters.';
    }
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
  } else {
    // Email validation
    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
      errors.email = 'Please enter a valid email.';
    }

    // Password validation
    if (!data.password || data.password === '') {
      errors.password = 'Password is required.';
    } else if (data.password.length < 6) {
      errors.password = 'Password must contain at least 6 characters.';
    }

    // Confirm password validation
    if (!data.confirmPassword || data.confirmPassword === '') {
      errors.confirmPassword = 'Confirmation password is required.';
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
  }

  // Terms and conditions acceptance
  if (!data.agreeTerms) {
    errors.terms = 'You must accept the Terms & Conditions to proceed.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
