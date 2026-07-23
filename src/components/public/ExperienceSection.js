import { $ } from '../../utils/dom.js';
import { CrudService } from '../../services/crud.service.js';
import { formatDate } from '../../utils/helpers.js';

export class ExperienceSection {
  constructor(content) {
    this.content = content || {};
    this.experienceService = new CrudService('experience');
  }

  async render() {
    const { title, subtitle, present_label } = this.content;

    let experiences = [];
    try {
      experiences = await this.experienceService.getAll({ status: 'published', orderBy: 'start_date', ascending: false });
    } catch (e) {
      console.error("Failed to load experience", e);
    }

    return `
      <section id="experience" class="py-24 bg-gray-50 dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 overflow-hidden">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center mb-16" data-aos="fade-up">
            <h2 class="heading-lg">${title || 'Experience'}</h2>
            ${subtitle ? `<p class="mt-4 text-xl text-slate-500 max-w-3xl mx-auto">${subtitle}</p>` : ''}
          </div>

          ${experiences.length === 0 ? `
            <div class="text-center py-10 text-slate-500">No experience records found.</div>
          ` : `
            <div class="relative wrap overflow-hidden py-6 md:p-10 h-full">
              <!-- Vertical Line: Left-aligned on mobile, centered on desktop -->
              <div class="border-2-2 absolute border-opacity-20 border-gray-700 h-full border left-4 md:left-1/2 transform md:-translate-x-1/2"></div>
              
              ${experiences.map((exp, index) => this.renderTimelineItem(exp, index, present_label)).join('')}
            </div>
          `}
          
        </div>
      </section>
    `;
  }

  renderTimelineItem(exp, index, presentLabel) {
    const isLeft = index % 2 === 0;
    const aosAttr = isLeft ? 'fade-right' : 'fade-left';
    
    // On desktop alternate, on mobile always full-width with left padding
    const desktopFlexDir = isLeft ? 'md:flex-row-reverse' : 'md:flex-row';
    const desktopTextAlign = isLeft ? 'md:text-right' : 'md:text-left';
    
    const startDate = formatDate(exp.start_date, { day: 'numeric', month: 'short', year: 'numeric' });
    const endDate = exp.is_current ? (presentLabel || 'Present') : formatDate(exp.end_date, { day: 'numeric', month: 'short', year: 'numeric' });

    // Documentation image (doc_url)
    const docHtml = exp.doc_url ? (() => {
      const isPdfDoc = exp.doc_url.toLowerCase().includes('.pdf');
      if (isPdfDoc) {
        return `
          <a href="${exp.doc_url}" target="_blank" class="group/doc mt-4 flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-primary-400 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-red-50 text-red-400 flex items-center justify-center flex-shrink-0">
              <i data-lucide="file-text" class="w-5 h-5"></i>
            </div>
            <div class="flex-1 min-w-0 text-left">
              <p class="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover/doc:text-primary-600 transition-colors">Dokumentasi Kegiatan</p>
              <p class="text-xs text-slate-400 truncate">Lihat PDF →</p>
            </div>
          </a>
        `;
      }
      return `
        <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 group/doc cursor-pointer relative" 
             onclick="window.__openExpDoc('${exp.doc_url}', '${(exp.company || '').replace(/'/g, "\\'")}')">
          <img src="${exp.doc_url}" alt="Dokumentasi ${exp.company}" 
               class="w-full object-cover transition-transform duration-500 group-hover/doc:scale-105"
               style="max-height: 200px; min-height: 120px;"
               loading="lazy">
          <div class="absolute inset-0 bg-black/0 group-hover/doc:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <div class="opacity-0 group-hover/doc:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-gray-800 dark:text-white shadow">
              <i data-lucide="zoom-in" class="w-3.5 h-3.5 text-primary-600"></i> Lihat Foto
            </div>
          </div>
          <div class="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
            Dokumentasi
          </div>
        </div>
      `;
    })() : '';

    return `
      <!-- Timeline Item -->
      <div class="mb-10 flex flex-col md:flex-row items-center w-full relative ${desktopFlexDir}" data-aos="${aosAttr}">
        
        <!-- Empty Spacer for Desktop Alignment -->
        <div class="hidden md:block w-5/12"></div>
        
        <!-- Timeline Icon -->
        <div class="absolute left-0 md:relative md:left-auto z-20 flex items-center bg-primary-500 shadow-xl w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 flex-shrink-0">
          <h1 class="mx-auto font-semibold text-lg text-white"><i data-lucide="briefcase" class="w-3.5 h-3.5"></i></h1>
        </div>
        
        <!-- Timeline Card -->
        <div class="w-full pl-12 md:pl-0 md:w-5/12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 md:p-6">
          
          <div class="flex items-center gap-3 mb-3 ${isLeft ? 'md:justify-end md:flex-row-reverse' : ''}">
            ${exp.logo_url 
              ? (exp.logo_url.toLowerCase().endsWith('.pdf') 
                  ? `<a href="${exp.logo_url}" target="_blank" title="View Document" class="p-2 bg-gray-100 dark:bg-slate-800 rounded text-primary-500 hover:text-primary-600 transition-colors"><i data-lucide="file-text" class="w-6 h-6"></i></a>`
                  : `<img src="${exp.logo_url}" alt="${exp.company}" class="w-10 h-10 rounded object-contain bg-white flex-shrink-0 border border-gray-100">`
                )
              : ''}
            <div class="text-left ${desktopTextAlign}">
              <h3 class="font-bold text-gray-900 dark:text-white text-lg md:text-xl leading-tight">${exp.position}</h3>
              <div class="text-primary-600 dark:text-primary-400 font-medium text-sm md:text-base">${exp.company}</div>
            </div>
          </div>
          
          <div class="text-xs md:text-sm text-slate-500 mb-4 font-mono bg-gray-50 dark:bg-slate-800 inline-block px-2.5 py-1 rounded border border-gray-100 dark:border-slate-700">
            ${startDate} - ${endDate}
          </div>
          
          ${docHtml}

          ${exp.description ? `
            <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mt-4 text-justify">
              ${exp.description}
            </p>
          ` : ''}
          
          ${exp.tags && exp.tags.length > 0 ? `
            <div class="flex flex-wrap gap-1.5 mt-4 ${isLeft ? 'md:justify-end' : 'md:justify-start'}">
              ${exp.tags.map(tag => `<span class="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-slate-500 text-xs rounded">${tag}</span>`).join('')}
            </div>
          ` : ''}
          
        </div>
      </div>
    `;
  }

  async mount(containerId) {
    const container = $(containerId);
    if (!container) return;

    container.innerHTML = '<div class="py-24 text-center"><i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto text-primary-500"></i></div>';

    const html = await this.render();
    container.innerHTML = html;

    if (window.lucide) window.lucide.createIcons({ root: container });
    if (window.AOS) window.setTimeout(() => window.AOS.refreshHard(), 100);

    // Setup global handler for doc image lightbox (inline onclick)
    window.__openExpDoc = (url, title) => {
      // Reuse cert lightbox if it exists, otherwise open new tab
      const lb = document.getElementById('cert-lightbox');
      const lbBody = document.getElementById('cert-lightbox-body');
      const lbTitle = document.getElementById('cert-lightbox-title');
      const lbLink = document.getElementById('cert-lightbox-link');
      if (lb && lbBody) {
        lbTitle.textContent = title ? `Dokumentasi: ${title}` : 'Dokumentasi Kegiatan';
        lbLink.href = url;
        lbBody.innerHTML = `<img src="${url}" alt="Dokumentasi" class="max-w-full max-h-[70vh] object-contain p-4" />`;
        if (window.lucide) window.lucide.createIcons({ root: lb });
        lb.classList.remove('hidden');
        lb.classList.add('flex');
        document.body.style.overflow = 'hidden';
      } else {
        window.open(url, '_blank');
      }
    };
  }
}
