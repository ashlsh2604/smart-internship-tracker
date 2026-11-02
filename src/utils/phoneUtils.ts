export interface CountryCodeItem {
  code: string;
  name: string;
  flag: string;
  placeholder: string;
  minDigits: number;
  maxDigits: number;
}

export const POPULAR_COUNTRIES: CountryCodeItem[] = [
  { code: '+1', name: 'United States / Canada', flag: '🇺🇸', placeholder: '(555) 019-2834', minDigits: 10, maxDigits: 10 },
  { code: '+91', name: 'India', flag: '🇮🇳', placeholder: '98765 43210', minDigits: 10, maxDigits: 10 },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', placeholder: '7911 123456', minDigits: 10, maxDigits: 11 },
  { code: '+61', name: 'Australia', flag: '🇦🇺', placeholder: '412 345 678', minDigits: 9, maxDigits: 9 },
  { code: '+49', name: 'Germany', flag: '🇩🇪', placeholder: '151 23456789', minDigits: 10, maxDigits: 11 },
  { code: '+33', name: 'France', flag: '🇫🇷', placeholder: '6 12 34 56 78', minDigits: 9, maxDigits: 9 },
  { code: '+81', name: 'Japan', flag: '🇯🇵', placeholder: '90 1234 5678', minDigits: 10, maxDigits: 10 },
  { code: '+65', name: 'Singapore', flag: '🇸🇬', placeholder: '8123 4567', minDigits: 8, maxDigits: 8 },
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪', placeholder: '50 123 4567', minDigits: 9, maxDigits: 9 },
  { code: '+55', name: 'Brazil', flag: '🇧🇷', placeholder: '11 98765-4321', minDigits: 10, maxDigits: 11 },
  { code: '+52', name: 'Mexico', flag: '🇲🇽', placeholder: '55 1234 5678', minDigits: 10, maxDigits: 10 },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰', placeholder: '300 1234567', minDigits: 10, maxDigits: 10 },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩', placeholder: '1712 345678', minDigits: 10, maxDigits: 10 },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬', placeholder: '802 123 4567', minDigits: 10, maxDigits: 10 },
  { code: '+27', name: 'South Africa', flag: '🇿🇦', placeholder: '82 123 4567', minDigits: 9, maxDigits: 9 },
  { code: '+254', name: 'Kenya', flag: '🇰🇪', placeholder: '712 345678', minDigits: 9, maxDigits: 9 },
  { code: '+63', name: 'Philippines', flag: '🇵🇭', placeholder: '917 123 4567', minDigits: 10, maxDigits: 10 },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩', placeholder: '812 3456 7890', minDigits: 9, maxDigits: 12 },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾', placeholder: '12 345 6789', minDigits: 9, maxDigits: 10 },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱', placeholder: '6 12345678', minDigits: 9, maxDigits: 9 },
  { code: '+34', name: 'Spain', flag: '🇪🇸', placeholder: '612 34 56 78', minDigits: 9, maxDigits: 9 },
  { code: '+39', name: 'Italy', flag: '🇮🇹', placeholder: '312 345 6789', minDigits: 10, maxDigits: 10 },
  { code: '+46', name: 'Sweden', flag: '🇸🇪', placeholder: '70 123 45 67', minDigits: 9, maxDigits: 9 },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭', placeholder: '78 123 45 67', minDigits: 9, maxDigits: 9 },
  { code: '+82', name: 'South Korea', flag: '🇰🇷', placeholder: '10 1234 5678', minDigits: 9, maxDigits: 10 },
  { code: '+86', name: 'China', flag: '🇨🇳', placeholder: '138 1234 5678', minDigits: 11, maxDigits: 11 },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿', placeholder: '21 123 4567', minDigits: 8, maxDigits: 10 },
  { code: '+353', name: 'Ireland', flag: '🇮🇪', placeholder: '85 123 4567', minDigits: 9, maxDigits: 9 },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦', placeholder: '50 123 4567', minDigits: 9, maxDigits: 9 },
  { code: '+20', name: 'Egypt', flag: '🇪🇬', placeholder: '100 123 4567', minDigits: 10, maxDigits: 10 },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳', placeholder: '91 234 5678', minDigits: 9, maxDigits: 10 },
  { code: '+90', name: 'Turkey', flag: '🇹🇷', placeholder: '532 123 4567', minDigits: 10, maxDigits: 10 },
  { code: '+48', name: 'Poland', flag: '🇵🇱', placeholder: '512 345 678', minDigits: 9, maxDigits: 9 },
];

/**
 * Intelligent phone number parser:
 * If the user enters a full number starting with '+' or country code,
 * automatically detects the country code and strips redundant prefixes.
 */
export function parsePhoneInput(
  rawInput: string,
  currentCountryCode: string
): { detectedCountryCode: string; localNumber: string } {
  let cleaned = rawInput.trim();

  // If input starts with '+' or '00'
  if (cleaned.startsWith('+') || cleaned.startsWith('00')) {
    const withoutPrefix = cleaned.startsWith('+') ? cleaned.slice(1) : cleaned.slice(2);
    // Sort country codes by descending length (e.g. +880 before +88)
    const sorted = [...POPULAR_COUNTRIES].sort((a, b) => b.code.length - a.code.length);
    for (const item of sorted) {
      const dialDigits = item.code.replace('+', '');
      if (withoutPrefix.startsWith(dialDigits)) {
        const remainder = withoutPrefix.slice(dialDigits.length).trim();
        return {
          detectedCountryCode: item.code,
          localNumber: remainder.replace(/^0+/, ''), // strip leading zero
        };
      }
    }
  }

  // If user typed dial code without plus (e.g., "919876543210")
  if (currentCountryCode && !cleaned.startsWith('+')) {
    const dialDigits = currentCountryCode.replace('+', '');
    const digitsOnly = cleaned.replace(/\D/g, '');
    if (digitsOnly.startsWith(dialDigits) && digitsOnly.length > dialDigits.length + 6) {
      return {
        detectedCountryCode: currentCountryCode,
        localNumber: digitsOnly.slice(dialDigits.length),
      };
    }
  }

  // Strip leading trunk 0 if not needed for international dial
  if (cleaned.startsWith('0') && cleaned.length > 8 && currentCountryCode !== '+1') {
    cleaned = cleaned.replace(/^0+/, '');
  }

  return {
    detectedCountryCode: currentCountryCode,
    localNumber: cleaned,
  };
}

/**
 * Combines country code and local number into standardized E.164 format.
 * Example: toE164('+91', '9876543210') -> '+919876543210'
 */
export function toE164(countryCode: string, localNumber: string): string {
  const ccDigits = countryCode.replace(/\D/g, '');
  const localDigits = localNumber.replace(/\D/g, '');
  if (!localDigits) return '';
  return `+${ccDigits}${localDigits}`;
}

/**
 * Formats a phone number for clean human-readable UI presentation.
 */
export function formatDisplayPhone(countryCode: string, localNumber: string): string {
  const digits = localNumber.replace(/\D/g, '');
  if (!digits) return '';

  if (countryCode === '+1') {
    if (digits.length === 10) {
      return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
  } else if (countryCode === '+91') {
    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
  } else if (countryCode === '+44') {
    if (digits.length === 10) {
      return `+44 ${digits.slice(0, 4)} ${digits.slice(4)}`;
    }
  }
  return `${countryCode} ${localNumber.trim()}`;
}

/**
 * Validates whether a given phone number has sufficient and plausible digits.
 */
export function isValidRealPhone(countryCode: string, localNumber: string): boolean {
  const localDigits = localNumber.replace(/\D/g, '');
  if (localDigits.length < 6 || localDigits.length > 15) return false;

  const found = POPULAR_COUNTRIES.find((c) => c.code === countryCode);
  if (found) {
    return localDigits.length >= found.minDigits && localDigits.length <= found.maxDigits + 1;
  }
  return localDigits.length >= 7 && localDigits.length <= 15;
}
