/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert string to title case
 */
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
};

/**
 * Truncate string with ellipsis
 */
export const truncate = (str: string, maxLength: number): string => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
