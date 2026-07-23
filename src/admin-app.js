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

  showLogin(errorMessage = '') {
    $('#admin-app').classList.add('hidden');
    $('#login-container').classList.remove('hidden');

    $('#login-container').innerHTML = `
      <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div class="text-center mb-8">
          <div class="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm0 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm-6 8a6 6 0 0112 0H6z"/></svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p class="text-sm text-gray-500 mt-1">Masukkan kredensial Anda untuk masuk</p>
        </div>

        ${errorMessage ? `
          <div id="login-error" class="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"/></svg>
            ${errorMessage}
          </div>
        ` : '<div id="login-error" class="hidden"></div>'}

        <form id="login-form" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5" for="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              autocomplete="email"
              required
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5" for="admin-password">Password</label>
            <div class="relative">
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                autocomplete="current-password"
                required
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all pr-10"
              >
              <button type="button" id="toggle-password" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </div>
          </div>
          <button
            id="login-btn"
            type="submit"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <svg id="login-spinner" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 animate-spin hidden" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
            <span id="login-btn-text">Masuk</span>
          </button>
        </form>
      </div>
    `;

    // Toggle password visibility
    document.getElementById('toggle-password').addEventListener('click', () => {
      const pwInput = document.getElementById('admin-password');
      pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
    });

    // Handle form submit
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value.trim();
      const password = document.getElementById('admin-password').value;
      const btn = document.getElementById('login-btn');
      const btnText = document.getElementById('login-btn-text');
      const spinner = document.getElementById('login-spinner');
      const errorDiv = document.getElementById('login-error');

      // Loading state
      btn.disabled = true;
      spinner.classList.remove('hidden');
      btnText.textContent = 'Memverifikasi...';
      errorDiv.classList.add('hidden');

      try {
        await authService.signIn(email, password);
        this.showDashboard();
      } catch (err) {
        const msg = err.message.includes('Invalid login') || err.message.includes('invalid')
          ? 'Email atau password salah. Silakan coba lagi.'
          : err.message.includes('Unauthorized')
          ? 'Akun ini tidak memiliki akses admin.'
          : 'Terjadi kesalahan. Coba lagi.';

        errorDiv.textContent = msg;
        errorDiv.classList.remove('hidden');
      } finally {
        btn.disabled = false;
        spinner.classList.add('hidden');
        btnText.textContent = 'Masuk';
      }
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

