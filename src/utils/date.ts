/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
  if (!date) return '';
  const d = new Date(date);
  
  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Format date to ISO string for API
 */
export const toISODate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Check if date is expired
 */
export const isExpired = (date: string | Date): boolean => {
  if (!date) return false;
  return new Date(date) < new Date();
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string | Date): number => {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Get relative time (e.g., "2 days ago")
 */
export const getRelativeTime = (date: string | Date): string => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
};
