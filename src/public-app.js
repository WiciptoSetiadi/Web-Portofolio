import './styles/base.css';
import './styles/animations.css';
import { createIcons, icons } from 'lucide';
window.lucide = {
  createIcons: (options = {}) => createIcons({ icons, ...options })
};

import { contentService } from './services/content.service.js';
import { settingsService } from './services/settings.service.js';
import { analyticsService } from './services/analytics.service.js';
import { initScrollProgress } from './utils/animations.js';
import { updateMetaTags, injectSchemaMarkup, generatePersonSchema } from './utils/seo.js';
import { $ } from './utils/dom.js';
import { PublicLayout } from './layouts/public-layout.js';

class PublicApp {
  async init() {
    try {
      // 1. Fetch Global Settings
      const settings = await settingsService.getSettings();
      this.applySettings(settings);

      // 2. Fetch CMS Content (Cached)
      const content = await contentService.loadAll();

      // 3. Setup SEO
      this.setupSEO(settings, content.hero);

      // 4. Render App (We will build components to render here)
      this.render(content, settings);

      // 5. Initialize global scripts
      this.initScripts();

      // 6. Log view
      analyticsService.logPageView(window.location.pathname);

    } catch (error) {
      console.error('Failed to initialize app:', error);
      $('#app').innerHTML = `<div class="p-10 text-red-500 font-mono text-xs whitespace-pre-wrap"><h1>App Crash</h1>${error.message}\n${error.stack}</div>`;
    }
  }

  applySettings(settings) {
    if (settings.primary_color) {
      // Very basic approach to override primary color. In real world, needs hex-to-rgb for Tailwind variables
      document.documentElement.style.setProperty('--color-primary-500', settings.primary_color);
      document.documentElement.style.setProperty('--color-primary-600', settings.primary_color);
    }
    // Set favicon
    if (settings.favicon_url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon_url;
    }
  }

  setupSEO(settings, heroContent) {
    updateMetaTags({
      title: settings.seo_title || settings.site_title,
      description: settings.seo_description || settings.site_description || heroContent?.bio_short,
      image: settings.og_image_url || heroContent?.show_avatar ? 'fallback_avatar' : '',
      url: window.location.href
    });

    const schema = generatePersonSchema({
      full_name: heroContent?.name,
      title: heroContent?.typing_texts?.[0],
      avatar_url: settings.og_image_url
    }, window.location.origin);

    injectSchemaMarkup(schema);
  }

  render(content, settings) {
    const layout = new PublicLayout(content, settings);
    layout.mount();
  }

  initScripts() {
    initScrollProgress();
    // Initialize AOS if loaded
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        once: true,
        offset: 100,
      });
    }
  }
}

const app = new PublicApp();
app.init();
