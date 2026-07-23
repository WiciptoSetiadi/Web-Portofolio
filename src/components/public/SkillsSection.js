import { $ } from '../../utils/dom.js';
import { CrudService } from '../../services/crud.service.js';

export class SkillsSection {
  constructor(content) {
    this.content = content || {};
    this.skillService = new CrudService('skills');
  }

  async render() {
    const { title, subtitle, show_proficiency, show_filter } = this.content;

    let skills = [];
    try {
      skills = await this.skillService.getAll({ status: 'published', orderBy: 'sort_order' });
    } catch (e) {
      console.error("Failed to load skills", e);
    }

    const categories = [...new Set(skills.map(s => s.category).filter(Boolean))];

    return `
      <section id="skills" class="py-24 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center mb-16" data-aos="fade-up">
            <h2 class="heading-lg">${title || 'Skills & Expertise'}</h2>
            ${subtitle ? `<p class="mt-4 text-xl text-slate-500 max-w-3xl mx-auto">${subtitle}</p>` : ''}
          </div>

          ${show_filter && categories.length > 0 ? `
            <div class="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up" data-aos-delay="100">
              <button class="skill-filter-btn active px-4 py-2 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-medium transition-colors" data-filter="all">All</button>
              ${categories.map(cat => `
                <button class="skill-filter-btn px-4 py-2 rounded-full bg-gray-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors" data-filter="${cat}">${cat}</button>
              `).join('')}
            </div>
          ` : ''}
          
          ${skills.length === 0 ? `
             <div class="text-center py-10 text-slate-500">No skills found.</div>
          ` : `
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6" id="skills-grid">
              ${skills.map((skill, index) => this.renderSkillCard(skill, index, show_proficiency)).join('')}
            </div>
          `}
          
        </div>
      </section>
    `;
  }

  renderSkillCard(skill, index, showProficiency) {
    const delay = (index % 6) * 50;
    return `
      <div class="skill-card group bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all duration-300" data-category="${skill.category}" data-aos="fade-up" data-aos-delay="${delay}">
        <div class="w-16 h-16 mx-auto mb-4 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          ${skill.icon_name ?
        `<i data-lucide="${skill.icon_name}" class="w-8 h-8 text-primary-500"></i>` :
        `<i data-lucide="code" class="w-8 h-8 text-primary-500"></i>`
      }
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">${skill.name}</h3>
        ${showProficiency && skill.proficiency ? `
          <div class="mt-4 w-full">
            <div class="flex justify-between text-xs mb-1.5 px-1">
              <span class="font-medium text-slate-500 dark:text-slate-400">Proficiency</span>
              <span class="font-bold text-primary-600 dark:text-primary-400">${skill.proficiency}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
              <div class="bg-gradient-to-r from-primary-400 to-primary-600 h-2.5 rounded-full" style="width: ${skill.proficiency}%"></div>
            </div>
          </div>
        ` : ''}
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
    const filterBtns = container.querySelectorAll('.skill-filter-btn');
    const skillCards = container.querySelectorAll('.skill-card');

    if (filterBtns.length > 0) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Update active state
          filterBtns.forEach(b => {
            b.classList.remove('bg-primary-100', 'text-primary-700', 'dark:bg-primary-900/30', 'dark:text-primary-400');
            b.classList.add('bg-gray-50', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
          });
          btn.classList.add('bg-primary-100', 'text-primary-700', 'dark:bg-primary-900/30', 'dark:text-primary-400');
          btn.classList.remove('bg-gray-50', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');

          const filterValue = btn.dataset.filter;

          skillCards.forEach(card => {
            if (filterValue === 'all' || card.dataset.category === filterValue) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
          if (window.AOS) window.AOS.refresh();
        });
      });
    }
  }
}
