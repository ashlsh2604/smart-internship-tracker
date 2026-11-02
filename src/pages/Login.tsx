import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Phone,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  RotateCw,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm, validatePhoneSendOtp } from '../utils/validation';
import {
  POPULAR_COUNTRIES,
  parsePhoneInput,
  formatDisplayPhone,
  toE164,
  isValidRealPhone,
} from '../utils/phoneUtils';
import { ValidationErrors } from '../types/auth';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithPhone, sendPhoneOtp, rememberedEmail, rememberedPhone } = useAuth();

  // Active Tab: 'email' or 'phone'
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');

  // Email form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Real phone form state
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [phoneAuthMode, setPhoneAuthMode] = useState<'otp' | 'password'>('otp');
  const [otp, setOtp] = useState<string>('');
  const [phonePassword, setPhonePassword] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [receivedCode, setReceivedCode] = useState<string>('');
  const [smsUrl, setSmsUrl] = useState<string>('');
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Common form state
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize remembered credentials & query param alerts
  useEffect(() => {
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
      setLoginMethod('email');
    }
    if (rememberedPhone) {
      const { detectedCountryCode, localNumber } = parsePhoneInput(rememberedPhone, '+1');
      setCountryCode(detectedCountryCode);
      setPhoneNumber(localNumber);
      setRememberMe(true);
      setLoginMethod('phone');
    }

    if (location.state && (location.state as { message?: string }).message) {
      setSuccessNotice((location.state as { message: string }).message);
      window.history.replaceState({}, document.title);
    }
  }, [rememberedEmail, rememberedPhone, location.state]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

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

  // Intelligent phone number parser: automatically detects country code if pasted/typed with '+'
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const { detectedCountryCode, localNumber } = parsePhoneInput(rawValue, countryCode);
    if (detectedCountryCode !== countryCode) {
      setCountryCode(detectedCountryCode);
    }
    setPhoneNumber(localNumber);
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
    if (serverError) setServerError('');
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
    if (errors.otp) setErrors((prev) => ({ ...prev, otp: undefined }));
    if (serverError) setServerError('');
  };

  const fillDemoEmailCredentials = () => {
    setEmail('student@college.edu');
    setPassword('password123');
    setErrors({});
    setServerError('');
  };

  const fillDemoPhoneCredentials = () => {
    setCountryCode('+1');
    setPhoneNumber('(555) 019-2834');
    setOtp('123456');
    setPhonePassword('password123');
    setIsOtpSent(true);
    setReceivedCode('123456');
    setErrors({});
    setServerError('');
  };

  const getFullPhone = (): string => {
    const e164 = toE164(countryCode, phoneNumber);
    return e164 || `${countryCode} ${phoneNumber.trim()}`;
  };

  // Trigger sending SMS verification code to real phone
  const handleSendOtp = async () => {
    const fullPhone = getFullPhone();
    const { isValid, errors: validationErrors } = validatePhoneSendOtp(fullPhone);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setServerError('');
    setIsSendingOtp(true);

    try {
      const res = await sendPhoneOtp(fullPhone);
      if (res.success) {
        setIsOtpSent(true);
        const code = res.code || res.demoOtp || '123456';
        setReceivedCode(code);
        setSmsUrl(res.smsUrl || `sms:${fullPhone.replace(/\D/g, '')}?body=Verification%20Code:%20${code}`);
        setWhatsappUrl(res.whatsappUrl || `https://api.whatsapp.com/send?text=Verification%20Code:%20${code}`);
        setCountdown(30);
        setSuccessNotice(`Verification code sent to ${formatDisplayPhone(countryCode, phoneNumber)}!`);
      } else {
        setServerError(res.message || 'Failed to send verification code. Please check your phone number.');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setServerError('Unable to send code. Please check your connection and try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Submit Handler for Email or Real Phone
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccessNotice('');

    if (loginMethod === 'email') {
      const { isValid, errors: validationErrors } = validateLoginForm({
        method: 'email',
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
          method: 'email',
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
    } else {
      // Real Phone Sign-In
      const fullPhone = getFullPhone();
      const isOtp = phoneAuthMode === 'otp';

      const { isValid, errors: validationErrors } = validateLoginForm({
        method: 'phone',
        phone: fullPhone,
        otp: isOtp ? otp : undefined,
        password: !isOtp ? phonePassword : undefined,
      });

      if (!isValid) {
        setErrors(validationErrors);
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      try {
        const response = await loginWithPhone(
          fullPhone,
          isOtp ? otp : phonePassword,
          isOtp,
          rememberMe
        );

        if (response.success) {
          navigate('/dashboard', {
            replace: true,
            state: {
              message: `Welcome back, ${response.user?.name || 'Student'}! You are signed in via phone.`,
            },
          });
        } else {
          setServerError(
            response.message || 'Phone sign-in failed. Check your phone number or verification code.'
          );
        }
      } catch (err) {
        console.error('Phone login error:', err);
        setServerError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const selectedCountry = POPULAR_COUNTRIES.find((c) => c.code === countryCode) || POPULAR_COUNTRIES[0];

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

        {/* Clean Login Card */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Student Sign-In
            </h2>
            <span className="text-xs text-gray-500 font-medium">Phase 1 Auth</span>
          </div>

          {/* Success Banner */}
          {successNotice && (
            <div className="mb-4 p-3 rounded bg-green-50 border border-green-300 text-green-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <div>{successNotice}</div>
            </div>
          )}

          {/* Error Banner */}
          {serverError && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-300 text-red-800 text-xs">
              <span className="font-semibold">Error: </span>
              {serverError}
            </div>
          )}

          {/* Sign-In Method Selector Tabs */}
          <div className="mb-5 grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200">
            <button
              type="button"
              id="login-tab-phone"
              onClick={() => {
                setLoginMethod('phone');
                setErrors({});
                setServerError('');
                setSuccessNotice('');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold transition-colors cursor-pointer ${
                loginMethod === 'phone'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone Sign-In</span>
            </button>
            <button
              type="button"
              id="login-tab-email"
              onClick={() => {
                setLoginMethod('email');
                setErrors({});
                setServerError('');
                setSuccessNotice('');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold transition-colors cursor-pointer ${
                loginMethod === 'email'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Sign-In</span>
            </button>
          </div>

          {/* ============================================================= */}
          {/* TAB 1: REAL PHONE NUMBER SIGN-IN                              */}
          {/* ============================================================= */}
          {loginMethod === 'phone' ? (
            <div>
              {/* Verification Method Switch: SMS OTP vs Password */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-gray-600 font-medium">Authentication:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneAuthMode('otp');
                      setErrors({});
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      phoneAuthMode === 'otp'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300 font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    SMS Verification Code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneAuthMode('password');
                      setErrors({});
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      phoneAuthMode === 'password'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300 font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Password
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Real Mobile Phone Input with Country Code Selector */}
                <div>
                  <label
                    htmlFor="login-phone"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Mobile Phone Number
                  </label>
                  <div className="flex rounded border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <select
                      id="login-country-code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      aria-label="Country Code"
                      className="bg-gray-50 text-gray-800 text-xs px-2 py-2 border-r border-gray-300 focus:outline-hidden font-medium cursor-pointer max-w-[130px]"
                    >
                      {POPULAR_COUNTRIES.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.flag} {item.code} ({item.name})
                        </option>
                      ))}
                    </select>
                    <input
                      id="login-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder={selectedCountry.placeholder || 'Enter mobile phone'}
                      className="flex-1 px-3 py-2 text-xs text-gray-900 bg-white focus:outline-hidden"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.phone}</p>
                  )}
                  <p className="text-[11px] text-gray-500 mt-1">
                    Enter any real mobile number (e.g. {selectedCountry.placeholder}). Country code auto-adjusts if pasted.
                  </p>
                </div>

                {/* Sub-Mode A: OTP Verification Code */}
                {phoneAuthMode === 'otp' ? (
                  <div className="space-y-3">
                    {!isOtpSent ? (
                      <div>
                        <button
                          type="button"
                          id="send-otp-btn"
                          onClick={handleSendOtp}
                          disabled={isSendingOtp}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          {isSendingOtp ? (
                            <>
                              <RotateCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending SMS Code...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Send 6-Digit SMS Code</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Live Carrier SMS Delivery Notification Card */}
                        <div className="p-3 bg-slate-900 text-white rounded-lg border border-slate-700 shadow-xs space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-300 pb-1.5 border-b border-slate-800">
                            <span className="flex items-center gap-1.5 font-medium text-blue-400 text-xs">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>SMS to {formatDisplayPhone(countryCode, phoneNumber)}</span>
                            </span>
                            <span className="text-[10px] bg-slate-800 text-green-400 font-mono px-1.5 py-0.5 rounded">
                              Dispatched
                            </span>
                          </div>

                          <div className="text-xs text-slate-200">
                            <p className="text-slate-400 text-[11px]">Verification Passcode:</p>
                            <div className="mt-1 flex items-center justify-between bg-slate-800/90 px-3 py-1.5 rounded border border-slate-700">
                              <span className="text-xs text-slate-300">Code:</span>
                              <span className="font-mono text-base font-bold text-yellow-300 tracking-wider">
                                {receivedCode}
                              </span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setOtp(receivedCode);
                                if (errors.otp) setErrors((prev) => ({ ...prev, otp: undefined }));
                              }}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-1 text-[11px] cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Auto-fill Code</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(receivedCode);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium flex items-center gap-1 text-[11px] cursor-pointer border border-slate-700"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copied ? 'Copied!' : 'Copy'}</span>
                            </button>
                            {smsUrl && (
                              <a
                                href={smsUrl}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium flex items-center gap-1 text-[11px] border border-slate-700"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Open SMS App</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* 6-Digit Code Input Box */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label
                              htmlFor="login-otp"
                              className="block text-xs font-medium text-gray-700"
                            >
                              Enter 6-Digit Passcode
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setIsOtpSent(false);
                                setOtp('');
                              }}
                              className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                            >
                              Change phone
                            </button>
                          </div>
                          <input
                            id="login-otp"
                            name="otp"
                            type="text"
                            maxLength={6}
                            autoComplete="one-time-code"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="Enter 6-digit code"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-center font-mono text-base tracking-widest text-gray-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                          />
                          {errors.otp && (
                            <p className="text-red-600 text-[11px] mt-1">{errors.otp}</p>
                          )}
                        </div>

                        {/* Resend Timer */}
                        <div className="flex items-center justify-between text-[11px] text-gray-600">
                          {countdown > 0 ? (
                            <span className="text-gray-500">Resend SMS code in {countdown}s</span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={isSendingOtp}
                              className="text-blue-700 font-medium hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <RotateCw className="w-3 h-3" />
                              <span>Resend SMS Code</span>
                            </button>
                          )}
                        </div>

                        {/* Verify & Sign In Button */}
                        <button
                          id="verify-otp-submit-button"
                          type="submit"
                          disabled={isSubmitting || otp.length < 6}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          {isSubmitting ? (
                            'Verifying & Signing In...'
                          ) : (
                            <>
                              <span>Verify & Sign In</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Sub-Mode B: Password with Phone */
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="login-phone-password"
                        className="block text-xs font-medium text-gray-700 mb-1"
                      >
                        Account Password
                      </label>
                      <input
                        id="login-phone-password"
                        name="phonePassword"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={phonePassword}
                        onChange={(e) => setPhonePassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                      {errors.password && (
                        <p className="text-red-600 text-[11px] mt-1">{errors.password}</p>
                      )}
                      <p className="text-[11px] text-gray-500 mt-1">
                        If this is your first time signing in with this phone, your student account will be created automatically.
                      </p>
                    </div>

                    <button
                      id="login-phone-password-submit"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {isSubmitting ? (
                        'Signing In...'
                      ) : (
                        <>
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Sign In with Phone & Password</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Remember Phone Checkbox */}
                <div className="flex items-center text-xs pt-1">
                  <input
                    id="remember-phone-checkbox"
                    name="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="remember-phone-checkbox"
                    className="ml-2 block text-xs text-gray-600 cursor-pointer"
                  >
                    Remember my phone number on this device
                  </label>
                </div>

                {/* Demo student helper */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <button
                    type="button"
                    onClick={fillDemoPhoneCredentials}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Fill sample demo phone
                  </button>
                  <span>Real international format supported</span>
                </div>
              </form>
            </div>
          ) : (
            /* ============================================================= */
            /* TAB 2: EMAIL SIGN-IN FORM                                     */
            /* ============================================================= */
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Student College Email
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
                  className={`w-full px-3 py-2 border rounded text-xs text-gray-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-[11px] mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-medium text-gray-700 mb-1"
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
                  className={`w-full px-3 py-2 border rounded text-xs text-gray-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="text-red-600 text-[11px] mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center text-xs">
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

              <button
                id="login-submit-button"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-xs transition-colors cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In with Email'}
              </button>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <button
                  type="button"
                  onClick={fillDemoEmailCredentials}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Fill sample demo credentials
                </button>
                <span>C11 + SQLite3 backend</span>
              </div>
            </form>
          )}

          {/* Link to Sign-Up */}
          <div className="mt-5 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
            Don't have an account yet?{' '}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Sign up here
            </Link>
          </div>
        </div>

        {/* Backend Technology Footer */}
        <p className="mt-4 text-center text-xs text-gray-500">
          Native Windows & Multi-Platform C11 REST Engine + Isolated SQLite3
        </p>
      </div>
    </div>
  );
};
