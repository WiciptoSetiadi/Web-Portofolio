import { $ } from '../../utils/dom.js';
import { CrudService } from '../../services/crud.service.js';

export class ProjectsSection {
  constructor(content) {
    this.content = content || {};
    this.projectService = new CrudService('projects');
  }

  async render() {
    const { title, subtitle, filter_label, show_filter, empty_state } = this.content;

    // Fetch published projects
    let projects = [];
    try {
      projects = await this.projectService.getAll({ status: 'published', orderBy: 'sort_order' });
    } catch (e) {
      console.error("Failed to load projects", e);
    }

    // Extract unique categories for filter (case-insensitive, normalized to Title Case)
    const normalizeCategory = str => str.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    const categories = [...new Map(
      projects.map(p => p.category).filter(Boolean).map(cat => [normalizeCategory(cat).toLowerCase(), normalizeCategory(cat)])
    ).values()];

    return `
      <section id="projects" class="py-24 bg-gray-50 dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center mb-16" data-aos="fade-up">
            <h2 class="heading-lg">${title || 'My Projects'}</h2>
            ${subtitle ? `<p class="mt-4 text-xl text-slate-500 max-w-3xl mx-auto">${subtitle}</p>` : ''}
          </div>

          ${show_filter && categories.length > 0 ? `
            <div class="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up" data-aos-delay="100">
              <span class="py-2 text-slate-500 font-medium">${filter_label || 'Filter:'}</span>
              <button class="project-filter-btn active px-4 py-2 rounded-full bg-primary-600 text-white font-medium transition-colors" data-filter="all">All</button>
              ${categories.map(cat => `
                <button class="project-filter-btn px-4 py-2 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors border border-gray-200 dark:border-slate-600" data-filter="${cat.toLowerCase()}">${cat}</button>
              `).join('')}
            </div>
          ` : ''}
          
          ${projects.length === 0 ? `
            <div class="text-center py-20 text-slate-500 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl">
              ${empty_state || 'No projects found.'}
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="projects-grid">
              ${projects.map((project, index) => this.renderProjectCard(project, index)).join('')}
            </div>
          `}
          
        </div>
      </section>
    `;
  }

  renderProjectCard(project, index) {
    const delay = (index % 3) * 100;
    return `
      <div class="project-card group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-slate-800 flex flex-col h-full transform hover:-translate-y-2" data-category="${(project.category || '').toLowerCase().trim()}" data-aos="fade-up" data-aos-delay="${delay}">
        
        <div class="relative h-64 overflow-hidden bg-gray-100 dark:bg-slate-800">
          ${project.image_url
        ? (project.image_url.toLowerCase().endsWith('.pdf')
          ? `<div class="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-800 text-gray-400"><i data-lucide="file-text" class="w-16 h-16 mb-2"></i><span class="text-sm font-medium">PDF Document</span></div>`
          : `<img src="${project.image_url}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy">`
        )
        : `<div class="w-full h-full flex items-center justify-center text-gray-400"><i data-lucide="image" class="w-12 h-12"></i></div>`
      }
          
          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
            ${(project.image_url && project.image_url.toLowerCase().endsWith('.pdf')) ? `<a href="${project.image_url}" target="_blank" rel="noopener noreferrer" class="p-3 bg-white text-gray-900 rounded-full hover:scale-110 transition-transform" title="View Document"><i data-lucide="external-link" class="w-5 h-5"></i></a>` : ''}
            ${project.live_url ? `<a href="${project.live_url}" target="_blank" rel="noopener noreferrer" class="p-3 bg-white text-gray-900 rounded-full hover:scale-110 transition-transform" title="Live Demo"><i data-lucide="external-link" class="w-5 h-5"></i></a>` : ''}
            ${project.github_url ? `<a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="p-3 bg-gray-900 text-white rounded-full hover:scale-110 transition-transform border border-gray-700" title="Source Code"><i data-lucide="github" class="w-5 h-5"></i></a>` : ''}
          </div>
        </div>
        
        <div class="p-8 flex-1 flex flex-col">
          ${project.category ? `<span class="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2">${project.category}</span>` : ''}
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">${project.title}</h3>
          <p class="text-slate-600 dark:text-slate-400 mb-6 flex-1 line-clamp-3">${project.short_description || project.description || ''}</p>
          
          <div class="flex flex-wrap gap-2 mt-auto pt-6 border-t border-gray-100 dark:border-slate-800">
            ${(project.tech_stack || []).slice(0, 4).map(tech => `
              <span class="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full">${tech}</span>
            `).join('')}
            ${(project.tech_stack && project.tech_stack.length > 4) ? `<span class="px-2 py-1 text-slate-400 text-xs font-medium">+${project.tech_stack.length - 4}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  async mount(containerId) {
    const container = $(containerId);
    if (!container) return;

    container.innerHTML = '<div class="py-24 text-center"><i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto text-primary-500"></i></div>';
    if (window.lucide) window.lucide.createIcons({ root: container });

    const html = await this.render();
    container.innerHTML = html;

    if (window.lucide) window.lucide.createIcons({ root: container });
    if (window.AOS) window.setTimeout(() => window.AOS.refreshHard(), 100);

    // Setup filtering logic
    const filterBtns = container.querySelectorAll('.project-filter-btn');
    const projectCards = container.querySelectorAll('.project-card');

    if (filterBtns.length > 0) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Update active button styles
          filterBtns.forEach(b => {
            b.classList.remove('bg-primary-600', 'text-white', 'border-primary-600', 'shadow-lg', 'shadow-primary-500/30');
            b.classList.add('bg-white', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-300', 'border-gray-200', 'dark:border-slate-600');
          });
          btn.classList.add('bg-primary-600', 'text-white', 'border-primary-600', 'shadow-lg', 'shadow-primary-500/30');
          btn.classList.remove('bg-white', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-300', 'border-gray-200', 'dark:border-slate-600');

          const filterValue = btn.dataset.filter;

          projectCards.forEach((card, index) => {
            const matches = filterValue === 'all' || card.dataset.category === filterValue;

            // Remove AOS attributes to prevent AOS from overriding card opacity to 0
            card.removeAttribute('data-aos');
            card.classList.add('aos-animate');

            if (matches) {
              // Show card
              card.style.display = 'flex';
              card.classList.remove('filter-hidden');

              // Staggered entrance
              setTimeout(() => {
                card.classList.add('filter-visible');
              }, (index % 6) * 50);
            } else {
              // Hide card with smooth fade out
              card.classList.remove('filter-visible');
              card.classList.add('filter-hidden');
              setTimeout(() => {
                if (card.classList.contains('filter-hidden')) {
                  card.style.display = 'none';
                }
              }, 280);
            }
          });
        });
      });
    }
  }
}
