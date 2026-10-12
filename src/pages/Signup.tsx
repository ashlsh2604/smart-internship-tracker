import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateSignupForm } from '../utils/validation';
import { ValidationErrors } from '../types/auth';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
    if (serverError) setServerError('');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    if (serverError) setServerError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
    if (serverError) setServerError('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const { isValid, errors: validationErrors } = validateSignupForm({
      name,
      email,
      password,
      confirmPassword,
      agreeTerms: true,
    });

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await signup(
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
          agreeTerms: true,
        },
        true // Auto-login to establish authenticated session
      );

      if (response.success) {
        // Redirect to main page (/dashboard) after registration
        navigate('/dashboard', {
          replace: true,
          state: {
            message: `Account created successfully! Welcome to your dashboard, ${name.trim()}.`,
          },
        });
      } else {
        setServerError(
          response.message || 'An account with this email already exists or signup failed.'
        );
      }
    } catch (err) {
      console.error('Signup error:', err);
      setServerError('An unexpected error occurred during signup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Simple Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Smart Internship Tracker
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Data Structures & Algorithms Project • Student Sign-Up
          </p>
        </div>

        {/* Clean Sign-Up Box: Basic white background, light grey border */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 sm:p-8 shadow-none">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Create Student Account
          </h2>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-300 text-red-800 text-sm">
              <span className="font-semibold">Error: </span>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="signup-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Alex Morgan"
                className={`w-full px-3 py-2 border rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
                placeholder="student@college.edu"
                className={`w-full px-3 py-2 border rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={handlePasswordChange}
                placeholder="At least 6 characters"
                className={`w-full px-3 py-2 border rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Re-enter your password"
                className={`w-full px-3 py-2 border rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Simple Blue Button */}
            <button
              id="signup-submit-button"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-5 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Login here
            </Link>
          </div>
        </div>

        {/* Backend Technology Footer */}
        <p className="mt-4 text-center text-xs text-gray-500">
          Backend: C Programming Language (POSIX HTTP Server + SQLite3)
        </p>
      </div>
    </div>
  );
};
