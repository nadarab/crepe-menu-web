/**
 * Admin Configuration
 * Unique secret key for admin dashboard access
 * This should be a long, random string that only you know
 */

// Get admin secret from environment variable or use default (change this!)
export const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || 'change-this-to-a-unique-secret-key';

/**
 * Generate a random secret key (for reference)
 * You can use this to generate your own secret
 */
export const generateAdminSecret = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Check if the provided secret matches the admin secret
 */
export const isValidAdminSecret = (secret: string): boolean => {
  return secret === ADMIN_SECRET;
};

