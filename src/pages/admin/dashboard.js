import { analyticsService } from '../../services/analytics.service.js';
import { $ } from '../../utils/dom.js';

export class DashboardPage {
  async render() {
    return `
      <div id="dashboard-container" class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800">Overview</h2>
        
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="stats-grid">
           <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse h-32"></div>
           <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse h-32"></div>
           <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse h-32"></div>
        </div>

        <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h3>
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                Activity log will be displayed here.
            </div>
        </div>
      </div>
    `;
  }

  async mount(containerId) {
    const container = $(containerId);
    if (!container) return;
    
    container.innerHTML = await this.render();
    
    // Load Stats
    try {
        const stats = await analyticsService.getDashboardStats();
        
        const statsHtml = `
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div class="flex items-center gap-4">
                    <div class="p-3 bg-blue-50 text-blue-600 rounded-lg"><i data-lucide="eye" class="w-6 h-6"></i></div>
                    <div>
                        <p class="text-sm font-medium text-gray-500">Total Page Views</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.totalViews}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div class="flex items-center gap-4">
                    <div class="p-3 bg-green-50 text-green-600 rounded-lg"><i data-lucide="folder" class="w-6 h-6"></i></div>
                    <div>
                        <p class="text-sm font-medium text-gray-500">Total Projects</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.totalProjects}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div class="flex items-center gap-4">
                    <div class="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><i data-lucide="mail" class="w-6 h-6"></i></div>
                    <div>
                        <p class="text-sm font-medium text-gray-500">Unread Messages</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.unreadMessages}</p>
                    </div>
                </div>
            </div>
        `;
        
        $('#stats-grid', container).innerHTML = statsHtml;
        if(window.lucide) window.lucide.createIcons();
    } catch (e) {
        console.error('Failed to load dashboard stats', e);
        $('#stats-grid', container).innerHTML = '<div class="col-span-3 text-red-500 p-4">Failed to load statistics.</div>';
    }
  }
}
