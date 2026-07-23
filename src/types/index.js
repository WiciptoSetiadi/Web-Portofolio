/**
 * JSDoc type definitions for better IDE support without full TypeScript
 */

/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} user_id
 * @property {string} full_name
 * @property {string} [title]
 * @property {string} [bio]
 * @property {string} [avatar_url]
 * @property {string} [resume_url]
 * @property {string} [location]
 * @property {string} [email]
 * @property {string} [phone]
 * @property {string} [website]
 * @property {'admin' | 'editor'} role
 * @property {Object} social_links
 */

/**
 * @typedef {Object} SectionContent
 * @property {string} id
 * @property {string} section_key
 * @property {string} [title]
 * @property {string} [subtitle]
 * @property {string} [description]
 * @property {Object} content
 * @property {boolean} is_visible
 * @property {number} sort_order
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} [category]
 * @property {string} [description]
 * @property {string} [short_description]
 * @property {string} [image_url]
 * @property {string} [live_url]
 * @property {string} [github_url]
 * @property {string[]} tech_stack
 * @property {string[]} tags
 * @property {'draft'|'published'|'archived'} status
 * @property {boolean} is_featured
 */
