import { $ } from '../../utils/dom.js';
import { initTypingEffect } from '../../utils/animations.js';
import { storageService } from '../../services/storage.service.js';

export class HeroSection {
  constructor(content, settings = {}) {
    this.content = content || {};
    this.settings = settings;
  }

  render() {
    const { greeting, typing_texts, cta_primary, cta_secondary, show_avatar } = this.content;
    const { full_name, headline, bio, avatar_url } = this.settings;

    // Fallbacks
    const display_name = full_name || this.content.name || 'Your Name';
    const display_bio = bio || this.content.bio_short || 'Welcome to my portfolio.';

    // Resolve avatar URL
    const avatar_src = avatar_url ? storageService.getPublicUrl('avatars', avatar_url) : null;

    // Resolve resume URL
    const resume_src = this.settings.resume_url ? storageService.getPublicUrl('resume', this.settings.resume_url) : null;
    return `
      <section id="hero" class="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <!-- Background Elements -->
        <div class="absolute inset-0 z-0">
          <div class="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div class="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div class="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-col-reverse lg:flex-row">
            
            <!-- Text Content -->
            <div data-aos="fade-up" class="text-center lg:text-left order-2 lg:order-1">
              <span class="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-sm font-semibold mb-6 tracking-wide">
                ${greeting || "Hello!"}
              </span>
              
              <h1 class="heading-xl mb-4">
                <span class="block">${display_name}</span>
                <span class="block text-2xl sm:text-3xl md:text-5xl mt-2 text-slate-600 dark:text-slate-400 min-h-[3rem] md:min-h-[4rem]">
                  I'm a <span id="hero-typing" class="text-primary-600 dark:text-primary-400 font-bold"></span>
                </span>
              </h1>
              
              <p class="mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 mx-auto lg:mx-0 mb-8 sm:mb-10">
                ${display_bio}
              </p>
              
              <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                ${cta_primary ? `<a href="${cta_primary.href}" class="btn btn-primary">${cta_primary.label}</a>` : ''}
                ${resume_src
        ? `<a href="${resume_src}" target="_blank" class="btn btn-secondary"><i data-lucide="download" class="w-4 h-4 mr-2"></i>Download CV</a>`
        : (cta_secondary ? `<a href="${cta_secondary.href}" class="btn btn-secondary">${cta_secondary.label}</a>` : '')}
              </div>
            </div>

            <!-- Avatar / Illustration -->
            ${show_avatar ? `
            <div data-aos="fade-left" data-aos-delay="200" class="flex justify-center relative order-1 lg:order-2 mb-8 lg:mb-0 px-4">
               <div class="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
                  <!-- Abstract shapes behind avatar -->
                  <div class="absolute inset-0 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full opacity-20 blur-2xl transform scale-110"></div>
                  <!-- Avatar container -->
                  <div class="relative h-full w-full rounded-full border-4 border-white/50 dark:border-slate-800/50 shadow-2xl overflow-hidden glass flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                    ${avatar_src
          ? `<img src="${avatar_src}" alt="${display_name}" class="w-full h-full object-cover">`
          : `<i data-lucide="user" class="w-32 h-32 text-slate-300 dark:text-slate-600"></i>`
        }
                  </div>
                  
                  <!-- Floating badge -->
                  <div class="absolute bottom-2 left-2 md:bottom-10 md:-left-6 glass px-3 py-1.5 md:px-6 md:py-3 rounded-2xl shadow-xl flex items-center gap-2 md:gap-4 transform -rotate-3 md:-rotate-6 hover:rotate-0 transition-transform">
                    <div class="bg-green-500 w-2 h-2 md:w-3 md:h-3 rounded-full animate-ping"></div>
                    <span class="font-medium text-xs md:text-sm whitespace-nowrap">Available for work</span>
                  </div>
               </div>
            </div>
            ` : ''}
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

    // Init typing effect
    if (this.content.typing_texts && this.content.typing_texts.length > 0) {
      const typingElement = $('#hero-typing');
      if (typingElement) {
        initTypingEffect(typingElement, this.content.typing_texts);
      }
    }
  }
}
