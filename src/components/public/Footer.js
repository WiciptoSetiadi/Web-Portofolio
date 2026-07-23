import { $ } from '../../utils/dom.js';

export class Footer {
  constructor(content, settings = {}) {
    this.content = content || {};
    this.settings = settings;
  }

  render() {
    const { tagline, links } = this.content;
    const { footer_copyright, github, linkedin, twitter, instagram, youtube } = this.settings;

    const currentYear = new Date().getFullYear();
    const displayCopyright = footer_copyright
      ? footer_copyright.replace('2026', currentYear)
      : (this.content.copyright ? this.content.copyright.replace('2026', currentYear) : `© ${currentYear} Portfolio. All rights reserved.`);

    const renderSocial = (url, icon, label) => url ? `
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-primary-500">
        <span class="sr-only">${label}</span>
        <i data-lucide="${icon}" class="h-6 w-6"></i>
      </a>
    ` : '';

    return `
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex justify-center md:justify-start space-x-6 md:order-2">
            ${links?.map(link => `
              <a href="${link.href}" class="text-slate-500 hover:text-primary-600 dark:hover:text-primary-400">
                ${link.label}
              </a>
            `).join('') || ''}
            ${(github || linkedin || instagram) ? `
            <div class="flex space-x-4 border-l border-gray-200 dark:border-slate-700 pl-6 ml-6">
              ${renderSocial(github, 'github', 'GitHub')}
              ${renderSocial(linkedin, 'linkedin', 'LinkedIn')}
              ${renderSocial(instagram, 'instagram', 'Instagram')}
            </div>
            ` : ''}
          </div>
          
          <div class="mt-8 md:mt-0 md:order-1 text-center md:text-left">
            <p class="text-base text-slate-500">
              ${displayCopyright}
            </p>
            ${tagline ? `<p class="mt-2 text-sm text-slate-400">${tagline}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  mount(containerId) {
    const container = $(containerId);
    if (!container) return;

    container.innerHTML = this.render();
    if (window.lucide) window.lucide.createIcons({ root: container });
  }
}
