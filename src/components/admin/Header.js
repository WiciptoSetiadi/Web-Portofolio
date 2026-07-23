import { $ } from '../../utils/dom.js';
import { settingsService } from '../../services/settings.service.js';
import { storageService } from '../../services/storage.service.js';

export class AdminHeader {
  constructor() {
    this.name = 'Admin';
    this.avatarUrl = null;
    
    // Bind listeners
    this.onSettingsUpdated = this.onSettingsUpdated.bind(this);
    this.onAvatarUpdated = this.onAvatarUpdated.bind(this);
  }

  render() {
    const avatarContent = this.avatarUrl 
      ? `<img src="${this.avatarUrl}" class="w-8 h-8 rounded-full object-cover border border-gray-200">`
      : `<div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">${this.name.charAt(0).toUpperCase()}</div>`;

    return `
      <div class="flex items-center gap-4">
        <button id="mobile-sidebar-toggle" class="md:hidden p-2 text-gray-500 hover:text-primary-600">
          <i data-lucide="menu" class="w-6 h-6"></i>
        </button>
        <h2 id="page-title" class="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h2>
      </div>
      
      <div class="flex items-center gap-4">
        <a href="/" target="_blank" class="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600">
          <i data-lucide="external-link" class="w-4 h-4"></i> View Site
        </a>
        <div class="h-8 w-px bg-gray-200"></div>
        <div class="flex items-center gap-3">
          <div id="header-avatar" class="flex items-center justify-center">
            ${avatarContent}
          </div>
          <span id="header-name" class="text-sm font-medium text-gray-700">${this.name}</span>
        </div>
      </div>
    `;
  }

  async mount(containerId) {
    const container = $(containerId);
    if (!container) return;
    this.container = container;
    
    // Initial Render
    container.innerHTML = this.render();
    if (window.lucide) window.lucide.createIcons();
    
    // Listen for updates from Settings page
    window.addEventListener('settings-updated', this.onSettingsUpdated);
    window.addEventListener('avatar-updated', this.onAvatarUpdated);

    // Fetch initial data
    try {
      const settings = await settingsService.getSettings();
      if (settings.full_name) this.name = settings.full_name.split(' ')[0]; // Use first name
      if (settings.avatar_url) this.avatarUrl = storageService.getPublicUrl('avatars', settings.avatar_url);
      
      // Re-render avatar section only
      this.updateDOM();
    } catch (e) {
      console.warn('Failed to fetch admin profile for header', e);
    }
  }

  unmount() {
    window.removeEventListener('settings-updated', this.onSettingsUpdated);
    window.removeEventListener('avatar-updated', this.onAvatarUpdated);
  }

  onSettingsUpdated(e) {
    const settings = e.detail;
    if (settings.full_name) this.name = settings.full_name.split(' ')[0];
    if (settings.avatar_url) this.avatarUrl = storageService.getPublicUrl('avatars', settings.avatar_url);
    this.updateDOM();
  }

  onAvatarUpdated(e) {
    const { path } = e.detail;
    this.avatarUrl = storageService.getPublicUrl('avatars', path);
    this.updateDOM();
  }

  updateDOM() {
    const nameEl = $('#header-name', this.container);
    if (nameEl) nameEl.textContent = this.name;
    
    const avatarContainer = $('#header-avatar', this.container);
    if (avatarContainer) {
      avatarContainer.innerHTML = this.avatarUrl 
        ? `<img src="${this.avatarUrl}" class="w-8 h-8 rounded-full object-cover border border-gray-200">`
        : `<div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">${this.name.charAt(0).toUpperCase()}</div>`;
    }
  }

  setTitle(title) {
    const titleEl = $('#page-title', this.container);
    if (titleEl) titleEl.textContent = title;
  }
}
