/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if a value is not empty
 */
export function isNotEmpty(value: any): boolean {
  return value !== null && value !== undefined && value !== "";
}
