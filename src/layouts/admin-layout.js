import { AdminSidebar } from '../components/admin/Sidebar.js';
import { AdminHeader } from '../components/admin/Header.js';
import { authService } from '../services/auth.service.js';
import { $ } from '../utils/dom.js';

import { DashboardPage } from '../pages/admin/dashboard.js';
import { CrudPage } from '../pages/admin/crud-page.js';
import { ContentManagerPage } from '../pages/admin/content.js';
import { SettingsPage } from '../pages/admin/settings.js';

export class AdminLayout {
  constructor() {
    this.sidebar = new AdminSidebar();
    this.header = new AdminHeader();
    
    // Page instances mapped to routes
    this.pages = {
      dashboard: new DashboardPage(),
      projects: new CrudPage('projects'),
      skills: new CrudPage('skills'),
      experience: new CrudPage('experience'),
      certificates: new CrudPage('certificates'),
      content: new ContentManagerPage(),
      settings: new SettingsPage()
    };
    
    this.currentPage = 'dashboard';
  }

  mount() {
    this.sidebar.mount('#sidebar-container', 
      (page) => this.navigate(page),
      () => this.logout()
    );
    this.header.mount('#admin-header');
    
    // Initial navigation based on hash or default
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    this.navigate(hash);
  }

  navigate(pageKey) {
    if (!this.pages[pageKey]) pageKey = 'dashboard';
    
    // Unmount previous page if needed
    if (this.pages[this.currentPage] && typeof this.pages[this.currentPage].unmount === 'function') {
      this.pages[this.currentPage].unmount();
    }
    
    this.currentPage = pageKey;
    const pageObj = this.pages[pageKey];
    
    // Update URL Hash
    window.location.hash = pageKey;
    
    // Update Header Title (extracting from config if CrudPage, else manual)
    const title = pageObj.config?.title || (pageKey === 'dashboard' ? 'Dashboard' : pageObj.title);
    this.header.setTitle(title);
    
    // Render Page
    const contentContainer = $('#admin-content');
    if (contentContainer) {
      if (typeof pageObj.mount === 'function') {
        pageObj.mount('#admin-content');
      } else if (typeof pageObj.render === 'function') {
        contentContainer.innerHTML = pageObj.render();
      }
    }
  }

  async logout() {
    try {
      await authService.signOut();
      window.location.reload();
    } catch (e) {
      console.error('Logout failed:', e);
    }
  }
}
