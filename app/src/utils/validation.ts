/**
 * SalahMate — Validation Utilities
 *
 * Standalone validation helpers.
 * For form validation, use Zod schemas via @hookform/resolvers.
 * These are for quick checks outside of forms.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Check if a string is a valid email format.
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Check if a password meets minimum requirements.
 * At least 8 characters, one uppercase, one lowercase, one digit.
 */
export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
  );
}

/**
 * Check if a string is non-empty after trimming.
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}
