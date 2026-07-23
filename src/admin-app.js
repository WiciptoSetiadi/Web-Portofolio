import './styles/base.css';

import { createIcons, icons } from 'lucide';
window.lucide = {
  createIcons: (options = {}) => createIcons({ icons, ...options })
};
import { authService } from './services/auth.service.js';
import { AdminLayout } from './layouts/admin-layout.js';
import { $ } from './utils/dom.js';

class AdminApp {
  async init() {
    try {
      const session = await authService.getSession();
      
      if (!session) {
        this.showLogin();
      } else {
        this.showDashboard();
      }
    } catch (error) {
      console.error('Admin init error:', error);
      this.showLogin();
    }
  }

  showLogin() {
    $('#admin-app').classList.add('hidden');
    $('#login-container').classList.remove('hidden');
    // Will mount Login component here
    $('#login-container').innerHTML = `
      <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
        <p class="text-center text-gray-500 mb-4">UI Implementation pending...</p>
        <button id="dev-login" class="btn btn-primary w-full">Bypass Login (Dev Only)</button>
      </div>
    `;

    $('#dev-login').addEventListener('click', () => {
        this.showDashboard();
    });
  }

  showDashboard() {
    $('#login-container').classList.add('hidden');
    $('#admin-app').classList.remove('hidden');
    
    // Mount Admin Layout and Router here
    const layout = new AdminLayout();
    layout.mount();
  }
}

const adminApp = new AdminApp();
adminApp.init();
