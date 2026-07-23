/**
 * Inject JSON-LD Schema.org markup into the head
 * @param {Object} schema 
 */
export function injectSchemaMarkup(schema) {
  if (!schema) return;
  
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(schema);
}

/**
 * Generate standard Person schema for the portfolio
 * @param {Object} profileData 
 * @param {string} siteUrl 
 * @returns {Object}
 */
export function generatePersonSchema(profileData, siteUrl) {
  if (!profileData) return null;
  
  return {
    "@context": "https://schema.org/",
    "@type": "Person",
    "name": profileData.full_name || "Portfolio Owner",
    "jobTitle": profileData.title || "Professional",
    "url": siteUrl,
    "image": profileData.avatar_url || "",
    "sameAs": profileData.social_links ? Object.values(profileData.social_links) : []
  };
}

/**
 * Dynamically update Meta tags
 * @param {Object} data {title, description, image, url}
 */
export function updateMetaTags({ title, description, image, url }) {
  if (title) {
    document.title = title;
    updateTag('meta[property="og:title"]', 'content', title);
    updateTag('meta[name="twitter:title"]', 'content', title);
  }
  
  if (description) {
    updateTag('meta[name="description"]', 'content', description);
    updateTag('meta[property="og:description"]', 'content', description);
    updateTag('meta[name="twitter:description"]', 'content', description);
  }
  
  if (image) {
    updateTag('meta[property="og:image"]', 'content', image);
    updateTag('meta[name="twitter:image"]', 'content', image);
  }
  
  if (url) {
    updateTag('meta[property="og:url"]', 'content', url);
  }
}

/**
 * Helper to update a specific meta tag
 * @param {string} selector 
 * @param {string} attr 
 * @param {string} value 
 */
function updateTag(selector, attr, value) {
  let el = document.querySelector(selector);
  if (el) {
    el.setAttribute(attr, value);
  }
}
