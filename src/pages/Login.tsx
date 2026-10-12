import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validation';
import { ValidationErrors } from '../types/auth';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, rememberedEmail } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    if (location.state && (location.state as { message?: string }).message) {
      setSuccessNotice((location.state as { message: string }).message);
      window.history.replaceState({}, document.title);
    }
  }, [rememberedEmail, location.state]);

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

  const fillDemoCredentials = () => {
    setEmail('student@college.edu');
    setPassword('password123');
    setErrors({});
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccessNotice('');

    const { isValid, errors: validationErrors } = validateLoginForm({
      email,
      password,
    });

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await login({
        email,
        password,
        rememberMe,
      });

      if (response.success) {
        navigate('/dashboard', {
          replace: true,
          state: {
            message: `Welcome back, ${response.user?.name || 'Student'}! You are now logged in.`,
          },
        });
      } else {
        setServerError(
          response.message || 'Invalid email or password. Please check your credentials.'
        );
      }
    } catch (err) {
      console.error('Login error:', err);
      setServerError('An unexpected error occurred. Please try again.');
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
            Data Structures & Algorithms Project • Student Portal
          </p>
        </div>

        {/* Clean Login Box: Basic white background, light grey border */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 sm:p-8 shadow-none">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Student Login
          </h2>

          {/* Success Banner */}
          {successNotice && (
            <div className="mb-4 p-3 rounded bg-green-50 border border-green-300 text-green-800 text-sm">
              <span className="font-semibold">Success: </span>
              {successNotice}
            </div>
          )}

          {/* Error Banner */}
          {serverError && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-300 text-red-800 text-sm">
              <span className="font-semibold">Error: </span>
              {serverError}
            </div>
          )}

          {/* Quick Demo Helper */}
          <div className="mb-4 p-2.5 bg-gray-50 border border-gray-200 rounded flex items-center justify-between text-xs text-gray-700">
            <span>Demo: <strong>student@college.edu</strong></span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
            >
              Auto-fill demo
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="login-email"
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
                htmlFor="login-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className={`w-full px-3 py-2 border rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center text-sm">
              <input
                id="remember-me-checkbox"
                name="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="remember-me-checkbox"
                className="ml-2 block text-xs text-gray-600 cursor-pointer"
              >
                Remember me on this browser
              </label>
            </div>

            {/* Simple Blue Button */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Link to Sign-Up */}
          <div className="mt-5 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Sign Up here
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
