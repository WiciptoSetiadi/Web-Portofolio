/**
 * Select a single element
 * @param {string} selector 
 * @param {Element} parent 
 * @returns {Element|null}
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Select multiple elements
 * @param {string} selector 
 * @param {Element} parent 
 * @returns {NodeListOf<Element>}
 */
export function $$(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Safely set innerHTML with basic XSS prevention (for simple cases)
 * In a real app, use a proper sanitizer like DOMPurify for user input
 * @param {Element} el 
 * @param {string} html 
 */
export function setHTML(el, html) {
  if (!el) return;
  el.innerHTML = html;
}

/**
 * Safely set text content
 * @param {Element} el 
 * @param {string} text 
 */
export function setText(el, text) {
  if (!el) return;
  el.textContent = text;
}

/**
 * Toggle a class on an element
 * @param {Element} el 
 * @param {string} className 
 * @param {boolean} [force] 
 */
export function toggleClass(el, className, force) {
  if (!el) return;
  el.classList.toggle(className, force);
}

/**
 * Show an element
 * @param {Element} el 
 * @param {string} display 
 */
export function show(el, display = 'block') {
  if (!el) return;
  el.style.display = display;
}

/**
 * Hide an element
 * @param {Element} el 
 */
export function hide(el) {
  if (!el) return;
  el.style.display = 'none';
}

/**
 * Delegate an event listener
 * @param {Element} el 
 * @param {string} event 
 * @param {string} selector 
 * @param {Function} handler 
 */
export function delegate(el, event, selector, handler) {
  if (!el) return;
  el.addEventListener(event, function(e) {
    const target = e.target.closest(selector);
    if (target && el.contains(target)) {
      handler.call(target, e, target);
    }
  });
}
