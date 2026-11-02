import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  RotateCw,
  Copy,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateSignupForm, validatePhoneSendOtp } from '../utils/validation';
import {
  POPULAR_COUNTRIES,
  parsePhoneInput,
  formatDisplayPhone,
  toE164,
} from '../utils/phoneUtils';
import { ValidationErrors } from '../types/auth';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, sendPhoneOtp } = useAuth();

  // Tab: 'phone' or 'email' (default to phone since user is focusing on phone sign-in)
  const [signupMethod, setSignupMethod] = useState<'phone' | 'email'>('phone');

  // Common fields
  const [name, setName] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Email flow fields
  const [email, setEmail] = useState<string>('');
  const [phoneOptional, setPhoneOptional] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Real Phone flow fields
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [receivedCode, setReceivedCode] = useState<string>('');
  const [smsUrl, setSmsUrl] = useState<string>('');
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [phonePassword, setPhonePassword] = useState<string>('');
  const [phoneConfirmPassword, setPhoneConfirmPassword] = useState<string>('');
  const [optionalEmail, setOptionalEmail] = useState<string>('');

  // Resend OTP countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

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

  // Auto-detect country code from pasted or typed international numbers
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const getFullPhone = (): string => {
    const e164 = toE164(countryCode, phoneNumber);
    return e164 || `${countryCode} ${phoneNumber.trim()}`;
  };

  // Trigger sending SMS verification code
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
      setServerError('Unable to send code. Please check your network and try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const fillDemoEmailStudent = () => {
    setName('Alex Morgan');
    setEmail(`alex.morgan.${Date.now() % 1000}@college.edu`);
    setPhoneOptional('+1 (555) 019-2834');
    setPassword('password123');
    setConfirmPassword('password123');
    setErrors({});
    setServerError('');
  };

  const fillDemoPhoneStudent = () => {
    setName('Jordan Lee');
    setCountryCode('+1');
    setPhoneNumber(`(555) 01${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 8999)}`);
    setOtp('123456');
    setIsOtpSent(true);
    setReceivedCode('123456');
    setPhonePassword('password123');
    setPhoneConfirmPassword('password123');
    setErrors({});
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccessNotice('');

    if (signupMethod === 'email') {
      const { isValid, errors: validationErrors } = validateSignupForm({
        name,
        email,
        phone: phoneOptional.trim() || undefined,
        password,
        confirmPassword,
        signupMethod: 'email',
        agreeTerms,
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
            phone: phoneOptional.trim() || undefined,
            password,
            confirmPassword,
            signupMethod: 'email',
            agreeTerms,
          },
          true // Auto-login to establish session
        );

        if (response.success) {
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
    } else {
      // Real Phone signup
      const fullPhone = getFullPhone();
      const { isValid, errors: validationErrors } = validateSignupForm({
        name,
        phone: fullPhone,
        email: optionalEmail.trim() || undefined,
        password: phonePassword || undefined,
        confirmPassword: phoneConfirmPassword || undefined,
        otp: isOtpSent ? otp : undefined,
        signupMethod: 'phone',
        agreeTerms,
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
            phone: fullPhone,
            email: optionalEmail.trim() || undefined,
            password: phonePassword || 'password123',
            confirmPassword: phoneConfirmPassword || 'password123',
            otp: otp || undefined,
            signupMethod: 'phone',
            agreeTerms,
          },
          true
        );

        if (response.success) {
          navigate('/dashboard', {
            replace: true,
            state: {
              message: `Student account created for ${formatDisplayPhone(countryCode, phoneNumber)}! Welcome, ${name.trim()}.`,
            },
          });
        } else {
          setServerError(
            response.message || 'An account with this phone number already exists or signup failed.'
          );
        }
      } catch (err) {
        console.error('Phone signup error:', err);
        setServerError('An unexpected error occurred during phone signup. Please try again.');
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
            Data Structures & Algorithms Project • Student Sign-Up
          </p>
        </div>

        {/* Clean Sign-Up Box: Basic white background, light grey border */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 sm:p-8 shadow-none">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Create Student Account
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

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-300 text-red-800 text-xs">
              <span className="font-semibold">Error: </span>
              {serverError}
            </div>
          )}

          {/* Sign-Up Method Switcher Tabs */}
          <div className="mb-5 grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200">
            <button
              type="button"
              id="signup-tab-phone"
              onClick={() => {
                setSignupMethod('phone');
                setErrors({});
                setServerError('');
                setSuccessNotice('');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold transition-colors cursor-pointer ${
                signupMethod === 'phone'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone Sign-Up</span>
            </button>
            <button
              type="button"
              id="signup-tab-email"
              onClick={() => {
                setSignupMethod('email');
                setErrors({});
                setServerError('');
                setSuccessNotice('');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold transition-colors cursor-pointer ${
                signupMethod === 'email'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Sign-Up</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full Name Field (Common to both methods) */}
            <div>
              <label
                htmlFor="signup-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
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
                className={`w-full px-3 py-2 border rounded text-sm text-gray-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* TAB 1: REAL PHONE SIGN-UP */}
            {signupMethod === 'phone' && (
              <>
                {/* Phone Number with Country Code */}
                <div>
                  <label
                    htmlFor="signup-phone-input"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mobile Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex rounded border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <select
                      id="signup-country-code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      aria-label="Country Code"
                      className="bg-gray-50 text-gray-800 text-xs px-2.5 py-2 border-r border-gray-300 focus:outline-hidden font-medium cursor-pointer max-w-[130px]"
                    >
                      {POPULAR_COUNTRIES.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.flag} {item.code} ({item.name})
                        </option>
                      ))}
                    </select>

                    <input
                      id="signup-phone-input"
                      name="phoneNumber"
                      type="tel"
                      autoComplete="tel-national"
                      required
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder={selectedCountry.placeholder || 'Enter mobile phone'}
                      className={`flex-1 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-hidden ${
                        errors.phone ? 'border-red-500' : ''
                      }`}
                    />

                    <button
                      type="button"
                      id="signup-send-otp-btn"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp || countdown > 0}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-l border-gray-300 text-xs font-semibold whitespace-nowrap shrink-0 disabled:opacity-50 cursor-pointer flex items-center gap-1"
                    >
                      {isSendingOtp ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : countdown > 0 ? (
                        <span>Resend ({countdown}s)</span>
                      ) : isOtpSent ? (
                        <span>Resend SMS</span>
                      ) : (
                        <span>Send SMS Code</span>
                      )}
                    </button>
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                  )}
                  <p className="text-[11px] text-gray-500 mt-1">
                    Accepts any international mobile number (e.g. {selectedCountry.placeholder}).
                  </p>
                </div>

                {/* Live SMS Carrier Card when code is dispatched */}
                {isOtpSent && (
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
                )}

                {/* 6-digit OTP Verification Code Input */}
                <div>
                  <label
                    htmlFor="signup-otp-input"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    6-Digit Verification Code
                  </label>
                  <input
                    id="signup-otp-input"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter 6-digit code"
                    className={`w-full px-3 py-2 border rounded font-mono text-center tracking-widest text-base font-semibold text-gray-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.otp && (
                    <p className="text-red-600 text-xs mt-1">{errors.otp}</p>
                  )}
                </div>

                {/* Password for Phone Account (Optional or Recommended) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="signup-phone-password"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Password <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="signup-phone-password"
                      name="phonePassword"
                      type="password"
                      value={phonePassword}
                      onChange={(e) => setPhonePassword(e.target.value)}
                      placeholder="At least 6 chars"
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="signup-phone-confirm-password"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="signup-phone-confirm-password"
                      name="phoneConfirmPassword"
                      type="password"
                      value={phoneConfirmPassword}
                      onChange={(e) => setPhoneConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Optional Email */}
                <div>
                  <label
                    htmlFor="signup-optional-email"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Email Address <span className="text-gray-400 font-normal">(Optional backup login)</span>
                  </label>
                  <input
                    id="signup-optional-email"
                    name="optionalEmail"
                    type="email"
                    value={optionalEmail}
                    onChange={(e) => setOptionalEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* TAB 2: EMAIL SIGN-UP */}
            {signupMethod === 'email' && (
              <>
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
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
                    className={`w-full px-3 py-2 border rounded text-sm text-gray-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Optional Phone Number */}
                <div>
                  <label
                    htmlFor="signup-phone-optional"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number <span className="text-gray-400 font-normal">(Optional, for SMS alerts)</span>
                  </label>
                  <input
                    id="signup-phone-optional"
                    name="phoneOptional"
                    type="tel"
                    value={phoneOptional}
                    onChange={(e) => setPhoneOptional(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="signup-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password <span className="text-red-500">*</span>
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
                    className={`w-full px-3 py-2 border rounded text-sm text-gray-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
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
                    Confirm Password <span className="text-red-500">*</span>
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
                    className={`w-full px-3 py-2 border rounded text-sm text-gray-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            {/* Terms and Conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  I agree to the <span className="text-blue-600 font-medium">Terms of Service</span> and{' '}
                  <span className="text-blue-600 font-medium">Honor Code</span> for academic internship tracking.
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-600 text-xs mt-1">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="signup-submit-button"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting
                ? 'Creating account...'
                : signupMethod === 'phone'
                ? 'Create Account with Phone'
                : 'Create Account with Email'}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-5 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Login here (Phone or Email)
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
