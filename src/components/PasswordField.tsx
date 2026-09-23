import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  error,
  helperText,
  className = '',
  required,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const hasError = Boolean(error);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full text-left">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 mb-1.5"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>

      <div className="relative rounded-lg shadow-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Lock className="w-4 h-4" aria-hidden="true" />
        </div>

        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-description` : undefined}
          required={required}
          className={`w-full rounded-lg border text-sm transition-colors duration-150 py-2.5 pl-10 pr-11
            ${
              hasError
                ? 'border-red-400 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/20'
                : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-white hover:border-slate-400'
            }
            focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />

        <button
          id={`${id}-toggle-visibility-btn`}
          type="button"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none focus:text-indigo-600 cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 transition-colors" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4 transition-colors" aria-hidden="true" />
          )}
        </button>
      </div>

      {hasError ? (
        <div
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p id={`${id}-description`} className="mt-1.5 text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
