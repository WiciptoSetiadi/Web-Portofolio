import { $ } from '../../utils/dom.js';

export class AdminSidebar {
  render() {
    return `
      <div class="p-6">
        <a href="/admin" class="text-2xl font-bold text-primary-600 dark:text-primary-400">AdminPanel</a>
      </div>
      
      <div class="px-4 pb-6">
        <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Core</p>
        <nav class="space-y-1 mb-8">
          <a href="#dashboard" class="admin-sidebar-link active" data-nav="dashboard">
            <i data-lucide="layout-dashboard" class="w-5 h-5"></i> Dashboard
          </a>
          <a href="#settings" class="admin-sidebar-link" data-nav="settings">
            <i data-lucide="settings" class="w-5 h-5"></i> Settings
          </a>
        </nav>

        <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">CMS / Entities</p>
        <nav class="space-y-1 mb-8">
          <a href="#projects" class="admin-sidebar-link" data-nav="projects">
            <i data-lucide="folder-git-2" class="w-5 h-5"></i> Projects
          </a>
          <a href="#skills" class="admin-sidebar-link" data-nav="skills">
            <i data-lucide="code-2" class="w-5 h-5"></i> Skills
          </a>
          <a href="#experience" class="admin-sidebar-link" data-nav="experience">
            <i data-lucide="briefcase" class="w-5 h-5"></i> Experience
          </a>
          <a href="#certificates" class="admin-sidebar-link" data-nav="certificates">
            <i data-lucide="award" class="w-5 h-5"></i> Certificates
          </a>
        </nav>
        
        <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Page Content</p>
        <nav class="space-y-1">
          <a href="#content" class="admin-sidebar-link" data-nav="content">
            <i data-lucide="file-text" class="w-5 h-5"></i> Section Text
          </a>
        </nav>
      </div>
      
      <div class="mt-auto p-4 border-t border-gray-200 dark:border-slate-800">
        <button id="logout-btn" class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors">
          <i data-lucide="log-out" class="w-5 h-5"></i> Logout
        </button>
      </div>
    `;
  }

  mount(containerId, onNavigate, onLogout) {
    const container = $(containerId);
    if (!container) return;
    
    container.innerHTML = this.render();
    if (window.lucide) window.lucide.createIcons();

    const links = container.querySelectorAll('.admin-sidebar-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        const page = link.dataset.nav;
        if (onNavigate) onNavigate(page);
      });
    });

    const logoutBtn = $('#logout-btn', container);
    if (logoutBtn && onLogout) {
      logoutBtn.addEventListener('click', onLogout);
    }
  }
}
