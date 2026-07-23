import { $, toggleClass } from '../../utils/dom.js';
import { storageService } from '../../services/storage.service.js';

export class Navbar {
  constructor(content, settings = {}) {
    this.content = content || {};
    this.settings = settings;
  }

  render() {
    const { logo_text, links, cta_label, cta_href } = this.content;
    const { logo_url, site_title } = this.settings;
    const display_text = site_title || logo_text || 'Portfolio';
    const logo_src = logo_url ? storageService.getPublicUrl('logos', logo_url) : null;

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <a href="#" class="flex items-center gap-2">
              ${logo_src
        ? `<img src="${logo_src}" alt="${display_text}" class="h-8 w-auto">`
        : `<span class="text-2xl font-bold gradient-text-animated tracking-tighter">${display_text}</span>`
      }
            </a>
          </div>
          
          <!-- Desktop Menu -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-center space-x-8">
              ${links?.map(link => `
                <a href="${link.href}" class="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 font-medium transition-colors">
                  ${link.label}
                </a>
              `).join('') || ''}
              ${cta_label ? `<a href="${cta_href}" class="btn btn-primary text-sm px-5 py-2">${cta_label}</a>` : ''}
            </div>
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button id="mobile-menu-btn" class="text-slate-600 hover:text-primary-600 dark:text-slate-300 focus:outline-none p-2">
              <i data-lucide="menu" class="w-6 h-6"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile Menu (Hidden by default) -->
      <div id="mobile-menu" class="md:hidden hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 absolute w-full shadow-lg">
        <div class="px-4 pt-2 pb-6 space-y-1">
          ${links?.map(link => `
            <a href="${link.href}" class="mobile-link block px-3 py-3 text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 rounded-md">
              ${link.label}
            </a>
          `).join('') || ''}
          ${cta_label ? `<div class="pt-4 px-3"><a href="${cta_href}" class="btn btn-primary w-full justify-center">${cta_label}</a></div>` : ''}
        </div>
      </div>
    `;
  }

  mount(containerId) {
    const container = $(containerId);
    if (!container) return;

    container.innerHTML = this.render();

    // Initialize icons
    if (window.lucide) window.lucide.createIcons({ root: container });

    // Scroll Effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        container.classList.add('glass', 'shadow-sm');
        container.classList.remove('bg-transparent');
      } else {
        container.classList.remove('glass', 'shadow-sm');
        container.classList.add('bg-transparent');
      }
    });

    // Mobile Menu Toggle
    const btn = $('#mobile-menu-btn');
    const menu = $('#mobile-menu');

    if (btn && menu) {
      btn.addEventListener('click', () => {
        const isHidden = menu.classList.contains('hidden');
        if (isHidden) {
          menu.classList.remove('hidden');
          btn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
        } else {
          menu.classList.add('hidden');
          btn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
        }
        if (window.lucide) window.lucide.createIcons({ root: btn });
      });

      // Close menu on link click
      const mobileLinks = menu.querySelectorAll('.mobile-link');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.add('hidden');
          btn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
          if (window.lucide) window.lucide.createIcons({ root: btn });
        });
      });
    }
  }
}
