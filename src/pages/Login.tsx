import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, GraduationCap, CheckCircle2, AlertCircle, HelpCircle, X, Sparkles } from 'lucide-react';
import { InputField } from '../components/InputField';
import { PasswordField } from '../components/PasswordField';
import { Button } from '../components/Button';
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
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  // Initialize remembered email or check location state for signup success message
  useEffect(() => {
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    if (location.state && (location.state as { message?: string }).message) {
      setSuccessNotice((location.state as { message: string }).message);
      // Clean location state in history so refreshing doesn't keep stale notice
      window.history.replaceState({}, document.title);
    }
  }, [rememberedEmail, location.state]);

  // Real-time error clearance on field change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (serverError) setServerError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
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

    // Frontend validation
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
        navigate('/dashboard', { replace: true });
      } else {
        setServerError(
          response.message || 'Invalid email or password. Please check your credentials.'
        );
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setServerError('An unexpected error occurred. Please try again.');
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
          id="login-heading"
          className="text-center text-2xl font-bold tracking-tight text-slate-900"
        >
          Welcome Back
        </h1>
        <p className="mt-1 text-center text-sm text-slate-600">
          Sign in to manage your internship applications and deadlines.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          id="login-card"
          className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10"
        >
          {/* Success Banner (e.g. from Signup redirect) */}
          {successNotice && (
            <div
              id="signup-success-alert"
              role="status"
              className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-900">Success</p>
                <p className="text-emerald-700 text-xs mt-0.5">{successNotice}</p>
              </div>
            </div>
          )}

          {/* Server Error Banner */}
          {serverError && (
            <div
              id="login-error-alert"
              role="alert"
              className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Sign in failed</p>
                <p className="text-red-700 text-xs mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          {/* Quick Demo Fill Helper for Viva / Testing */}
          <div className="mb-6 p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
            <div className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Viva Demo Account:</span>
            </div>
            <button
              type="button"
              id="quick-demo-fill-btn"
              onClick={fillDemoCredentials}
              className="font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 cursor-pointer transition-colors"
            >
              Auto-fill (Alex M.)
            </button>
          </div>

          <form id="login-form" className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <InputField
              id="login-email"
              label="Email"
              type="email"
              name="email"
              placeholder="student@college.edu"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            {/* Password Field */}
            <PasswordField
              id="login-password"
              label="Password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              error={errors.password}
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me-checkbox"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me-checkbox"
                  className="ml-2 block text-xs sm:text-sm text-slate-700 cursor-pointer"
                >
                  Remember Me
                </label>
              </div>

              <div>
                <button
                  type="button"
                  id="forgot-password-link"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              id="login-submit-button"
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isSubmitting}
              loadingText="Signing in..."
            >
              Sign In
            </Button>
          </form>

          {/* Bottom link to Signup */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link
                id="link-to-signup"
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Phase 1 College Note Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Smart Internship Deadline Tracker • Phase 1: Authentication
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          id="forgot-password-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-base">
                <HelpCircle className="w-5 h-5" />
                <span>Password Recovery</span>
              </div>
              <button
                id="close-forgot-modal-btn"
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              In <strong>Phase 1</strong>, accounts are securely managed using localStorage session simulation.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 mb-4 space-y-1">
              <p><strong>Demo Student:</strong> student@college.edu</p>
              <p><strong>Password:</strong> password123</p>
              <p className="text-slate-500 pt-1">Or create a new account via the <em>Sign Up</em> page.</p>
            </div>
            <Button
              id="forgot-modal-ok-btn"
              type="button"
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => setShowForgotModal(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
