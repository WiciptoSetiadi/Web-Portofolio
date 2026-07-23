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
    const desktopFlexDir = isLeft ? 'md:flex-row-reverse' : 'md:flex-row';

    const startDate = formatDate(exp.start_date, { day: 'numeric', month: 'short', year: 'numeric' });
    const endDate = exp.is_current ? (presentLabel || 'Present') : formatDate(exp.end_date, { day: 'numeric', month: 'short', year: 'numeric' });

    // Documentation image (doc_url)
    const docHtml = exp.doc_url ? (() => {
      const isPdfDoc = exp.doc_url.toLowerCase().includes('.pdf');
      if (isPdfDoc) {
        return `
          <a href="${exp.doc_url}" target="_blank" class="group/doc flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:border-primary-400 transition-colors">
            <div class="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center flex-shrink-0">
              <i data-lucide="file-text" class="w-4 h-4"></i>
            </div>
            <div class="flex-1 min-w-0 text-left">
              <p class="text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover/doc:text-primary-600 transition-colors">Dokumentasi Kegiatan</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 truncate">Lihat PDF →</p>
            </div>
          </a>
        `;
      }
      return `
        <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-600 group/doc cursor-pointer relative aspect-video" 
             onclick="window.__openExpDoc('${exp.doc_url}', '${(exp.company || '').replace(/'/g, "\\'")}')">
          <img src="${exp.doc_url}" alt="Dokumentasi ${exp.company}" 
               class="w-full h-full object-cover transition-transform duration-500 group-hover/doc:scale-105"
               loading="lazy">
          <div class="absolute inset-0 bg-black/0 group-hover/doc:bg-black/40 transition-colors duration-300 flex items-center justify-center">
            <div class="opacity-0 group-hover/doc:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-gray-800 dark:text-white shadow">
              <i data-lucide="zoom-in" class="w-3.5 h-3.5 text-primary-600"></i> Lihat Foto
            </div>
          </div>
          <div class="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
            Dokumentasi
          </div>
        </div>
      `;
    })() : '';

    return `
      <!-- Timeline Item -->
      <div class="mb-12 flex flex-col md:flex-row items-start md:items-center w-full relative ${desktopFlexDir}" data-aos="${aosAttr}">
        
        <!-- Empty Spacer for Desktop Alignment -->
        <div class="hidden md:block w-5/12"></div>
        
        <!-- Timeline Icon -->
        <div class="absolute left-0 top-6 md:top-auto md:relative md:left-auto z-20 flex items-center justify-center bg-primary-500 shadow-lg w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 flex-shrink-0">
          <i data-lucide="briefcase" class="w-3.5 h-3.5 text-white"></i>
        </div>
        
        <!-- Timeline Card -->
        <div class="w-full pl-12 md:pl-0 md:w-5/12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          
          <!-- Card Header: Logo + Position + Company -->
          <div class="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100 dark:border-slate-700">
            ${exp.logo_url
              ? (exp.logo_url.toLowerCase().endsWith('.pdf')
                  ? `<a href="${exp.logo_url}" target="_blank" class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-slate-800 rounded-lg text-primary-500 hover:text-primary-600 transition-colors"><i data-lucide="file-text" class="w-5 h-5"></i></a>`
                  : `<img src="${exp.logo_url}" alt="${exp.company}" class="w-10 h-10 rounded-lg object-contain bg-white flex-shrink-0 border border-gray-100 dark:border-slate-700">`
                )
              : `<div class="w-10 h-10 flex-shrink-0 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center"><i data-lucide="building-2" class="w-5 h-5 text-primary-600 dark:text-primary-400"></i></div>`}
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900 dark:text-white text-base md:text-lg leading-tight truncate">${exp.position}</h3>
              <div class="text-primary-600 dark:text-primary-400 font-semibold text-sm truncate">${exp.company}</div>
            </div>
          </div>
          
          <!-- Date Badge -->
          <div class="px-5 py-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
            <i data-lucide="calendar" class="w-3.5 h-3.5 text-primary-500 dark:text-primary-400 flex-shrink-0"></i>
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-wide">
              ${startDate} &nbsp;→&nbsp; ${endDate}
            </span>
            ${exp.is_current ? `<span class="ml-auto inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full"><span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping inline-block"></span>Aktif</span>` : ''}
          </div>
          
          <!-- Card Body: Doc + Description + Tags -->
          <div class="px-5 py-4 space-y-4">
            
            ${docHtml ? `<div>${docHtml}</div>` : ''}

            ${exp.description ? `
              <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300 text-justify">
                ${exp.description}
              </p>
            ` : ''}
            
            ${exp.tags && exp.tags.length > 0 ? `
              <div class="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-slate-700">
                ${exp.tags.map(tag => `<span class="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full border border-primary-100 dark:border-primary-800">${tag}</span>`).join('')}
              </div>
            ` : ''}

          </div>
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
