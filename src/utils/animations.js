/**
 * Initialize a typing effect on an element
 * @param {Element} element 
 * @param {string[]} texts Array of strings to type
 * @param {number} typingSpeed 
 * @param {number} erasingSpeed 
 * @param {number} newTextDelay 
 */
export function initTypingEffect(element, texts, typingSpeed = 100, erasingSpeed = 50, newTextDelay = 2000) {
  if (!element || !texts || !texts.length) return;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      element.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeDelay = typingSpeed;
    if (isDeleting) {
      typeDelay = erasingSpeed;
    }

    if (!isDeleting && charIndex === currentText.length) {
      typeDelay = newTextDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex++;
      if (textIndex >= texts.length) {
        textIndex = 0;
      }
    }

    setTimeout(type, typeDelay);
  }

  // Add cursor element if it doesn't exist next to it
  if (!element.nextElementSibling || !element.nextElementSibling.classList.contains('typing-cursor')) {
      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      element.parentNode.insertBefore(cursor, element.nextSibling);
  }

  setTimeout(type, newTextDelay + 250);
}

/**
 * Update the scroll progress bar
 */
export function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}
