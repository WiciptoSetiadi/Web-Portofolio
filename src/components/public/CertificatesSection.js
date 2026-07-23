import { $ } from '../../utils/dom.js';
import { CrudService } from '../../services/crud.service.js';
import { formatDate } from '../../utils/helpers.js';

export class CertificatesSection {
  constructor(content) {
    this.content = content || {};
    this.certificatesService = new CrudService('certificates');
  }

  async render() {
    const { title, subtitle } = this.content;

    let certificates = [];
    try {
      certificates = await this.certificatesService.getAll({ status: 'published', orderBy: 'issue_date', ascending: false });
    } catch (e) {
      console.error("Failed to load certificates", e);
    }

    return `
      <!-- Lightbox Modal -->
      <div id="cert-lightbox" class="fixed inset-0 z-[9999] hidden items-center justify-center bg-black/80 backdrop-blur-sm p-4" role="dialog">
        <div class="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div class="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex-shrink-0">
            <h4 id="cert-lightbox-title" class="font-semibold text-gray-800 dark:text-white text-sm truncate pr-4"></h4>
            <div class="flex items-center gap-2 flex-shrink-0">
              <a id="cert-lightbox-link" href="#" target="_blank" class="p-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center gap-1.5 text-xs font-medium px-3">
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Open Full
              </a>
              <button id="cert-lightbox-close" class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-white transition-colors">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>
          </div>
          <div id="cert-lightbox-body" class="flex-1 overflow-auto flex items-center justify-center min-h-[300px] bg-gray-100 dark:bg-slate-900">
            <!-- content injected dynamically -->
          </div>
        </div>
      </div>

      <section id="certificates" class="py-24 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center mb-16" data-aos="fade-up">
            <h2 class="heading-lg">${title || 'Certificates'}</h2>
            ${subtitle ? `<p class="mt-4 text-xl text-slate-500 max-w-3xl mx-auto">${subtitle}</p>` : ''}
          </div>

          ${certificates.length === 0 ? `
            <div class="text-center py-20 text-slate-500 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl">
              No certificates found.
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${certificates.map((cert, index) => this.renderCertificateCard(cert, index)).join('')}
            </div>
          `}
          
        </div>
      </section>
    `;
  }

  renderCertificateCard(cert, index) {
    const delay = (index % 3) * 100;
    const issueDate = formatDate(cert.issue_date, { month: 'short', year: 'numeric', day: 'numeric' });
    const isPdf = cert.image_url && cert.image_url.toLowerCase().includes('.pdf');
    const hasFile = !!cert.image_url;

    // The clickable data attributes for the lightbox
    const lightboxAttrs = hasFile
      ? `data-cert-url="${cert.image_url}" data-cert-title="${cert.name}" data-cert-type="${isPdf ? 'pdf' : 'image'}"`
      : '';
    const clickableClass = hasFile ? 'cursor-pointer cert-preview-trigger' : '';

    let previewHtml = '';
    if (!hasFile) {
      // No file at all
      previewHtml = `<div class="w-full h-full flex items-center justify-center text-gray-400"><i data-lucide="award" class="w-12 h-12"></i></div>`;
    } else if (isPdf) {
      // PDF: Styled PDF Cover for cross-platform reliability (Desktop & Mobile)
      previewHtml = `
        <div class="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 text-center relative group-hover:from-red-100 group-hover:to-orange-100 transition-colors">
          <div class="w-14 h-14 rounded-2xl bg-red-500 text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform">
            <i data-lucide="file-text" class="w-7 h-7"></i>
          </div>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">PDF Certificate</span>
          <span class="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">Click to view document</span>
          <div class="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
        </div>
      `;
    } else {
      // Image: show directly
      previewHtml = `<img src="${cert.image_url}" alt="${cert.name}" class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" loading="lazy">`;
    }

    return `
      <div class="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-slate-700 flex flex-col h-full transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="${delay}">
        
        <div class="relative h-52 overflow-hidden bg-gray-100 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 ${clickableClass}" ${lightboxAttrs}>
          ${previewHtml}
          
          <!-- Hover Overlay - click to open lightbox -->
          ${hasFile ? `
            <div class="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <div class="bg-white/90 dark:bg-slate-900/90 px-4 py-2 rounded-full flex items-center gap-2 text-gray-800 dark:text-white text-sm font-semibold shadow-lg">
                <i data-lucide="${isPdf ? 'file-text' : 'zoom-in'}" class="w-4 h-4 text-primary-600"></i>
                ${isPdf ? 'View Document' : 'View Image'}
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="p-6 flex-1 flex flex-col">
          ${cert.category ? `<span class="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2">${cert.category}</span>` : ''}
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">${cert.name}</h3>
          
          <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-2">
            <i data-lucide="building" class="w-4 h-4"></i> ${cert.issuer}
          </div>

          <div class="text-xs text-slate-500 mb-4 flex items-center gap-2">
            <i data-lucide="calendar" class="w-4 h-4"></i> ${issueDate}
          </div>
          
          <div class="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 items-center justify-between">
            <div class="flex flex-wrap gap-2">
              ${(cert.tags || []).map(tag => `
                <span class="px-2 py-1 bg-gray-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-medium rounded">${tag}</span>
              `).join('')}
            </div>
            ${cert.credential_url ? `
              <a href="${cert.credential_url}" target="_blank" rel="noopener noreferrer" class="text-xs text-primary-600 hover:text-primary-800 hover:underline flex items-center gap-1 font-medium flex-shrink-0" title="Verify Credential">
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Verify
              </a>
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
    if (window.lucide) window.lucide.createIcons({ root: container });

    const html = await this.render();
    container.innerHTML = html;

    if (window.lucide) window.lucide.createIcons({ root: container });
    if (window.AOS) window.setTimeout(() => window.AOS.refreshHard(), 100);

    // Setup lightbox
    this.setupLightbox(container);
  }

  setupLightbox(container) {
    const lightbox = $('#cert-lightbox', container) || document.getElementById('cert-lightbox');
    const lightboxBody = document.getElementById('cert-lightbox-body');
    const lightboxTitle = document.getElementById('cert-lightbox-title');
    const lightboxLink = document.getElementById('cert-lightbox-link');
    const lightboxClose = document.getElementById('cert-lightbox-close');

    if (!lightbox) return;

    // Open lightbox on card preview click
    document.querySelectorAll('.cert-preview-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const url = trigger.dataset.certUrl;
        const title = trigger.dataset.certTitle;
        const type = trigger.dataset.certType;

        lightboxTitle.textContent = title;
        lightboxLink.href = url;

        if (type === 'pdf') {
          lightboxBody.innerHTML = `
            <embed src="${url}#toolbar=1&navpanes=1&scrollbar=1" type="application/pdf" class="w-full" style="height: 70vh;" />
          `;
        } else {
          lightboxBody.innerHTML = `
            <img src="${url}" alt="${title}" class="max-w-full max-h-[70vh] object-contain p-4" />
          `;
        }

        if (window.lucide) window.lucide.createIcons({ root: lightbox });
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close lightbox
    const closeLightbox = () => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
      lightboxBody.innerHTML = '';
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }
}

