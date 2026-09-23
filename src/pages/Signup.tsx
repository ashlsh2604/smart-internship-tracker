import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, GraduationCap, AlertCircle, CheckCircle2, Shield, X } from 'lucide-react';
import { InputField } from '../components/InputField';
import { PasswordField } from '../components/PasswordField';
import { Button } from '../components/Button';
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
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);

  // Field change handlers with proactive error clearing
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
    if (errors.confirmPassword && e.target.value === confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
    if (serverError) setServerError('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
    if (serverError) setServerError('');
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeTerms(e.target.checked);
    if (errors.terms && e.target.checked) {
      setErrors((prev) => ({ ...prev, terms: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    // Frontend validation
    const { isValid, errors: validationErrors } = validateSignupForm({
      name,
      email,
      password,
      confirmPassword,
      agreeTerms,
    });

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await signup({
        name,
        email,
        password,
        confirmPassword,
        agreeTerms,
      });

      if (response.success) {
        // Redirect to Login page with success notification state
        // DO NOT log in automatically (as explicitly instructed in requirements)
        navigate('/login', {
          replace: true,
          state: {
            message:
              'Account created successfully! Please sign in with your email and password.',
          },
        });
      } else {
        setServerError(
          response.message || 'An account with this email already exists.'
        );
      }
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setServerError('An unexpected error occurred during signup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* App Branding & Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Smart Internship <span className="text-indigo-600">Tracker</span>
          </span>
        </div>

        {/* Heading & Subtitle */}
        <h1
          id="signup-heading"
          className="text-center text-2xl font-bold tracking-tight text-slate-900"
        >
          Create Your Account
        </h1>
        <p className="mt-1 text-center text-sm text-slate-600">
          Start organizing your internship journey today.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          id="signup-card"
          className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10"
        >
          {/* Server Error Banner (e.g. "An account with this email already exists.") */}
          {serverError && (
            <div
              id="signup-error-alert"
              role="alert"
              className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Registration error</p>
                <p className="text-red-700 text-xs mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          <form id="signup-form" className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Full Name Field */}
            <InputField
              id="signup-name"
              label="Full Name"
              type="text"
              name="name"
              placeholder="Alex Morgan"
              autoComplete="name"
              value={name}
              onChange={handleNameChange}
              error={errors.name}
              icon={<UserIcon className="w-4 h-4" />}
              required
            />

            {/* Email Field */}
            <InputField
              id="signup-email"
              label="Email"
              type="email"
              name="email"
              placeholder="alex@university.edu"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            {/* Password Field */}
            <PasswordField
              id="signup-password"
              label="Password"
              name="password"
              placeholder="At least 6 characters"
              autoComplete="new-password"
              value={password}
              onChange={handlePasswordChange}
              error={errors.password}
              helperText="Minimum 6 characters required."
              required
            />

            {/* Confirm Password Field */}
            <PasswordField
              id="signup-confirm-password"
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={errors.confirmPassword}
              required
            />

            {/* Terms & Conditions Checkbox */}
            <div className="pt-1">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms-conditions-checkbox"
                    name="agreeTerms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={handleTermsChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer mt-0.5"
                    aria-describedby={errors.terms ? 'terms-error' : undefined}
                  />
                </div>
                <label
                  htmlFor="terms-conditions-checkbox"
                  className="ml-2.5 text-xs text-slate-600 cursor-pointer select-none leading-relaxed"
                >
                  I agree to the{' '}
                  <button
                    type="button"
                    id="open-terms-modal-btn"
                    onClick={() => setShowTermsModal(true)}
                    className="text-indigo-600 hover:text-indigo-700 underline font-medium cursor-pointer"
                  >
                    Terms & Conditions
                  </button>{' '}
                  and academic honor code for internship management.
                </label>
              </div>

              {errors.terms && (
                <div
                  id="terms-error"
                  role="alert"
                  className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.terms}</span>
                </div>
              )}
            </div>

            {/* Create Account Button */}
            <Button
              id="signup-submit-button"
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-3"
              isLoading={isSubmitting}
              loadingText="Creating account..."
            >
              Create Account
            </Button>
          </form>

          {/* Bottom Link to Login */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                id="link-to-login"
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Phase 1 College Note Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Smart Internship Deadline Tracker • Phase 1: Authentication
        </p>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div
          id="terms-conditions-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-base">
                <Shield className="w-5 h-5" />
                <span>Terms & Academic Usage</span>
              </div>
              <button
                id="close-terms-modal-btn"
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2.5 max-h-60 overflow-y-auto pr-1 leading-relaxed">
              <p>
                <strong>1. College Project Usage:</strong> This system is developed for the Smart Internship Deadline Tracker academic project in Data Structures & Algorithms.
              </p>
              <p>
                <strong>2. Phase 1 Scope:</strong> Authentication credentials in this phase are stored locally on the client's browser (localStorage) to validate student flows before backend and DSA structures are attached.
              </p>
              <p>
                <strong>3. Privacy & Integrity:</strong> Students agree to manage accurate deadline information and preserve academic integrity when tracking opportunities.
              </p>
            </div>
            <div className="mt-5">
              <Button
                id="terms-modal-accept-btn"
                type="button"
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => {
                  setAgreeTerms(true);
                  if (errors.terms) {
                    setErrors((prev) => ({ ...prev, terms: undefined }));
                  }
                  setShowTermsModal(false);
                }}
              >
                I Understand & Agree
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
