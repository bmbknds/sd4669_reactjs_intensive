/**
 * Validation utility functions
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (US format)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s()+-]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate zip code (US format)
 */
export const isValidZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

/**
 * Validate document number (alphanumeric)
 */
export const isValidDocumentNumber = (docNumber: string): boolean => {
  const docRegex = /^[A-Z0-9]{6,20}$/i;
  return docRegex.test(docNumber);
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date: string): boolean => {
  return new Date(date) < new Date();
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (date: string): boolean => {
  return new Date(date) > new Date();
};

/**
 * Check if person is adult (18+)
 */
export const isAdult = (dateOfBirth: string): boolean => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18;
  }
  
  return age >= 18;
};

/**
 * Validate required field
 */
export const isRequired = (value: string | undefined | null): boolean => {
  return value !== undefined && value !== null && value.trim() !== '';
};

/**
 * Validate min length
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return !!value && value.length >= minLength;
};

/**
 * Validate max length
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return !!value && value.length <= maxLength;
};
