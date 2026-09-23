import { ValidationErrors, LoginCredentials, SignupData } from '../types/auth';

/**
 * Standard email format regex pattern for frontend validation.
 * Checks for non-empty local-part, @ symbol, domain, and valid TLD.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates login form inputs.
 * Returns an object with field-specific error messages if any validation fails.
 */
export function validateLoginForm(credentials: LoginCredentials): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  // Email validation
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

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates signup form inputs.
 * Returns an object with field-specific error messages if any validation fails.
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

  // Terms and conditions acceptance
  if (!data.agreeTerms) {
    errors.terms = 'You must accept the Terms & Conditions to proceed.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
