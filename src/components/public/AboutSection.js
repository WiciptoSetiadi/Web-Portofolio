import { $ } from '../../utils/dom.js';

export class AboutSection {
  constructor(content, settings = {}) {
    this.content = content || {};
    this.settings = settings;
  }

  render() {
    const { title, subtitle, bio_long, stats } = this.content;

    return `
      <section id="about" class="py-24 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <div class="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 text-justify">
          
          <div class="text-center mb-16" data-aos="fade-up">
            <h2 class="heading-lg">${title || 'About Me'}</h2>
            ${subtitle ? `<p class="mt-4 text-xl text-slate-500 max-w-3xl mx-auto">${subtitle}</p>` : ''}
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div data-aos="fade-right" class="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
               ${bio_long ? `<p>${bio_long}</p>` : `<p>${this.settings.bio || 'I am a passionate developer...'}</p>`}
               <!-- Additional bio paragraphs if needed -->
            </div>
            
            <div data-aos="fade-left" class="grid grid-cols-2 gap-6">
              ${stats?.map((stat, i) => `
                <div class="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-slate-700 card-hover">
                  <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600 dark:text-primary-400">
                    <i data-lucide="${stat.icon || 'star'}" class="w-6 h-6"></i>
                  </div>
                  <div class="text-3xl font-bold text-gray-900 dark:text-white mb-1" id="stat-${i}">${stat.value}</div>
                  <div class="text-sm font-medium text-slate-500 uppercase tracking-wide">${stat.label}</div>
                </div>
              `).join('') || ''}
            </div>
            
          </div>
        </div>
      </section>
    `;
  }

  mount(containerId) {
    const container = $(containerId);
    if (!container) return;

    container.innerHTML = this.render();
    if (window.lucide) window.lucide.createIcons({ root: container });

    // Animate stats if value is a number, otherwise just display it
    this.content.stats?.forEach((stat, i) => {
      if (!isNaN(stat.value)) {
        // Future enhancement: Add count-up animation here
      }
    });
  }
}
