/**
 * Country-specific strict mobile number validation & formatting
 */

export interface CountryPhoneConfig {
  code: string;
  dialCode: string;
  digits: number;
  name: string;
  flag: string;
  example: string;
  validator: (rawNumber: string) => { isValid: boolean; error?: string };
}

export const COUNTRY_PHONE_CONFIGS: Record<string, CountryPhoneConfig> = {
  IN: {
    code: 'IN',
    dialCode: '+91',
    digits: 10,
    name: 'India',
    flag: '🇮🇳',
    example: '9876543210',
    validator: (raw: string) => {
      const clean = raw.replace(/\D/g, '');
      if (clean.length !== 10) {
        return { isValid: false, error: `Indian mobile number must be exactly 10 digits (currently ${clean.length})` };
      }
      if (!/^[6-9]/.test(clean)) {
        return { isValid: false, error: 'Indian mobile number must begin with 6, 7, 8, or 9' };
      }
      return { isValid: true };
    },
  },
  US: {
    code: 'US',
    dialCode: '+1',
    digits: 10,
    name: 'United States',
    flag: '🇺🇸',
    example: '2025550143',
    validator: (raw: string) => {
      const clean = raw.replace(/\D/g, '');
      if (clean.length !== 10) {
        return { isValid: false, error: `US phone number must be exactly 10 digits (currently ${clean.length})` };
      }
      return { isValid: true };
    },
  },
  CA: {
    code: 'CA',
    dialCode: '+1',
    digits: 10,
    name: 'Canada',
    flag: '🇨🇦',
    example: '4165550143',
    validator: (raw: string) => {
      const clean = raw.replace(/\D/g, '');
      if (clean.length !== 10) {
        return { isValid: false, error: `Canadian phone number must be exactly 10 digits (currently ${clean.length})` };
      }
      return { isValid: true };
    },
  },
  AE: {
    code: 'AE',
    dialCode: '+971',
    digits: 9,
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    example: '501234567',
    validator: (raw: string) => {
      const clean = raw.replace(/\D/g, '');
      if (clean.length !== 9) {
        return { isValid: false, error: `UAE mobile number must be exactly 9 digits (currently ${clean.length})` };
      }
      return { isValid: true };
    },
  },
  SG: {
    code: 'SG',
    dialCode: '+65',
    digits: 8,
    name: 'Singapore',
    flag: '🇸🇬',
    example: '81234567',
    validator: (raw: string) => {
      const clean = raw.replace(/\D/g, '');
      if (clean.length !== 8) {
        return { isValid: false, error: `Singapore mobile number must be exactly 8 digits (currently ${clean.length})` };
      }
      return { isValid: true };
    },
  },
  QA: {
    code: 'QA',
    dialCode: '+974',
    digits: 8,
    name: 'Qatar',
    flag: '🇶🇦',
    example: '33123456',
    validator: (raw: string) => {
      const clean = raw.replace(/\D/g, '');
      if (clean.length !== 8) {
        return { isValid: false, error: `Qatar mobile number must be exactly 8 digits (currently ${clean.length})` };
      }
      return { isValid: true };
    },
  },
  SA: {
    code: 'SA',
    dialCode: '+966',
    digits: 9,
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    example: '501234567',
    validator: (raw: string) => {
      const clean = raw.replace(/\D/g, '');
      if (clean.length !== 9) {
        return { isValid: false, error: `Saudi mobile number must be exactly 9 digits (currently ${clean.length})` };
      }
      return { isValid: true };
    },
  },
  KW: {
    code: 'KW',
    dialCode: '+965',
    digits: 8,
    name: 'Kuwait',
    flag: '🇰🇼',
    example: '99123456',
    validator: (raw: string) => {
      const clean = raw.replace(/\D/g, '');
      if (clean.length !== 8) {
        return { isValid: false, error: `Kuwait mobile number must be exactly 8 digits (currently ${clean.length})` };
      }
      return { isValid: true };
    },
  },
  GB: {
    code: 'GB',
    dialCode: '+44',
    digits: 10,
    name: 'United Kingdom',
    flag: '🇬🇧',
    example: '7911123456',
    validator: (raw: string) => {
      const clean = raw.replace(/\D/g, '');
      if (clean.length !== 10) {
        return { isValid: false, error: `UK mobile number must be exactly 10 digits (currently ${clean.length})` };
      }
      return { isValid: true };
    },
  },
  AU: {
    code: 'AU',
    dialCode: '+61',
    digits: 9,
    name: 'Australia',
    flag: '🇦🇺',
    example: '412345678',
    validator: (raw: string) => {
      const clean = raw.replace(/\D/g, '');
      if (clean.length !== 9) {
        return { isValid: false, error: `Australian mobile number must be exactly 9 digits (currently ${clean.length})` };
      }
      return { isValid: true };
    },
  },
};

/**
 * Get phone configuration by country code, ID, or fallback to India
 */
export function getPhoneConfig(countryCodeOrName?: string): CountryPhoneConfig {
  if (!countryCodeOrName) return COUNTRY_PHONE_CONFIGS.IN;

  const upper = countryCodeOrName.toUpperCase();
  if (COUNTRY_PHONE_CONFIGS[upper]) {
    return COUNTRY_PHONE_CONFIGS[upper];
  }

  // Search by name
  for (const cfg of Object.values(COUNTRY_PHONE_CONFIGS)) {
    if (cfg.name.toUpperCase().includes(upper) || upper.includes(cfg.name.toUpperCase())) {
      return cfg;
    }
  }

  return COUNTRY_PHONE_CONFIGS.IN;
}

/**
 * Validates and formats a phone number with country dial code prefix
 */
export function validateAndFormatPhone(
  rawPhone: string,
  countryCodeOrName?: string
): { isValid: boolean; formatted: string; error?: string } {
  if (!rawPhone || !rawPhone.trim()) {
    return { isValid: false, formatted: '', error: 'Phone number is required' };
  }

  const config = getPhoneConfig(countryCodeOrName);
  
  // Strip dial code if user pasted it
  let cleaned = rawPhone.replace(/\D/g, '');
  const dialDigits = config.dialCode.replace(/\D/g, '');
  if (cleaned.startsWith(dialDigits) && cleaned.length > config.digits) {
    cleaned = cleaned.slice(dialDigits.length);
  }

  const validation = config.validator(cleaned);
  if (!validation.isValid) {
    return { isValid: false, formatted: rawPhone, error: validation.error };
  }

  return {
    isValid: true,
    formatted: `${config.dialCode} ${cleaned}`,
  };
}
