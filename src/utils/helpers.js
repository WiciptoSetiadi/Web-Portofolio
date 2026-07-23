/**
 * Debounce a function call
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format a date string or object to a readable format
 * @param {string|Date} date 
 * @param {Object} options 
 * @returns {string}
 */
export function formatDate(date, options = { month: 'short', year: 'numeric' }) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', options);
}

/**
 * Convert string to URL-friendly slug
 * @param {string} text 
 * @returns {string}
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-');      // Replace multiple - with single -
}

/**
 * Generate a random string (useful for basic IDs)
 * @returns {string}
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Deep clone an object
 * @param {Object} obj 
 * @returns {Object}
 */
export function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}
