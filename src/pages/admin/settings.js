import { $ } from '../../utils/dom.js';
import { settingsService } from '../../services/settings.service.js';
import { storageService } from '../../services/storage.service.js';

export class SettingsPage {
  constructor() {
    this.container = null;
    this.settings = {};
    this.originalSettings = {};
    this.currentTab = 'general';
    this.isDirty = false;
    
    // Bind navigation guard
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
  }

  get title() {
    return 'Site Settings';
  }

  async mount(containerSelector) {
    this.container = $(containerSelector);
    this.container.innerHTML = this.renderSkeleton();
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    await this.loadData();
  }

  unmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  handleBeforeUnload(e) {
    if (this.isDirty) {
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome
    }
  }

  async loadData() {
    try {
      this.settings = await settingsService.getSettings();
      // Store a deep copy for change tracking
      this.originalSettings = JSON.parse(JSON.stringify(this.settings));
      this.render();
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.container.innerHTML = `<div class="p-6 text-red-500">Failed to load settings: ${error.message}</div>`;
    }
  }

  renderSkeleton() {
    return `
      <div class="p-6 max-w-5xl mx-auto animate-pulse">
        <div class="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div class="flex gap-6">
          <div class="w-64 space-y-2">
            <div class="h-10 bg-gray-200 rounded"></div>
            <div class="h-10 bg-gray-200 rounded"></div>
            <div class="h-10 bg-gray-200 rounded"></div>
          </div>
          <div class="flex-1 bg-white p-6 rounded-xl border border-gray-200 space-y-6">
             <div class="h-6 bg-gray-200 rounded w-1/3"></div>
             <div class="h-10 bg-gray-200 rounded"></div>
             <div class="h-10 bg-gray-200 rounded"></div>
             <div class="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const tabs = [
      { id: 'general', label: 'General', icon: 'layout' },
      { id: 'profile', label: 'Profile', icon: 'user' },
      { id: 'seo', label: 'SEO', icon: 'search' },
      { id: 'social', label: 'Social Media', icon: 'share-2' },
      { id: 'security', label: 'Security', icon: 'shield' }
    ];

    this.container.innerHTML = `
      <div class="p-6 max-w-5xl mx-auto h-full flex flex-col">
        
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
          <button id="btn-save" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
            <i data-lucide="save" class="w-4 h-4"></i> Save Changes
          </button>
        </div>

        <div class="flex gap-8 flex-1 min-h-0">
          
          <!-- Tab Navigation -->
          <div class="w-64 flex-shrink-0">
            <nav class="space-y-1 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
              ${tabs.map(tab => `
                <button 
                  class="tab-btn w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${this.currentTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
                  data-tab="${tab.id}"
                >
                  <i data-lucide="${tab.icon}" class="w-5 h-5 ${this.currentTab === tab.id ? 'text-primary-600' : 'text-gray-400'}"></i>
                  ${tab.label}
                </button>
              `).join('')}
            </nav>
          </div>

          <!-- Tab Content Area -->
          <div class="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-y-auto">
            <div id="tab-content" class="p-8">
              ${this.renderActiveTab()}
            </div>
          </div>

        </div>
      </div>

      <!-- Toast Container -->
      <div id="toast-container" class="fixed bottom-6 right-6 flex flex-col gap-2 z-50"></div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.attachEventListeners();
  }

  renderActiveTab() {
    switch(this.currentTab) {
      case 'general': return this.renderGeneralTab();
      case 'profile': return this.renderProfileTab();
      case 'seo': return this.renderSEOTab();
      case 'social': return this.renderSocialTab();
      case 'security': return this.renderSecurityTab();
      default: return '';
    }
  }

  // ==========================================
  // TAB RENDERERS
  // ==========================================

  renderGeneralTab() {
    return `
      <div class="max-w-2xl space-y-8">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">General Information</h2>
          <p class="text-sm text-gray-500 mb-6">Basic configuration for your portfolio website.</p>
          
          <div class="space-y-6">
            ${this.renderInput('site_title', 'Site Name', 'text', 'My Portfolio')}
            
            <div class="grid grid-cols-2 gap-6">
              ${this.renderImageUpload('logo_url', 'Logo', 'logos')}
              ${this.renderImageUpload('favicon_url', 'Favicon', 'settings')}
            </div>
            
            <div class="grid grid-cols-2 gap-6">
              ${this.renderInput('primary_color', 'Primary Color', 'color')}
              ${this.renderInput('secondary_color', 'Secondary Color', 'color')}
            </div>

            <div class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
              <input type="checkbox" id="dark_mode_default" class="settings-input w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" ${this.settings.dark_mode_default ? 'checked' : ''}>
              <label for="dark_mode_default" class="text-sm font-medium text-gray-700">Enable Dark Mode by Default</label>
            </div>
            
            ${this.renderInput('footer_copyright', 'Footer Copyright Text', 'text', '© 2026. All rights reserved.')}
          </div>
        </div>
      </div>
    `;
  }

  renderProfileTab() {
    return `
      <div class="max-w-2xl space-y-8">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Public Profile</h2>
          <p class="text-sm text-gray-500 mb-6">This information will be displayed on the Hero and About sections.</p>
          
          <div class="space-y-6">
            ${this.renderImageUpload('avatar_url', 'Profile Picture (Avatar)', 'avatars', 'w-32 h-32 rounded-full object-cover')}
            
            <div class="grid grid-cols-2 gap-6">
              ${this.renderInput('full_name', 'Full Name', 'text', 'John Doe')}
              ${this.renderInput('headline', 'Professional Headline', 'text', 'Full Stack Developer')}
            </div>
            
            ${this.renderTextarea('bio', 'Short Bio', 4)}
            
            <div class="grid grid-cols-2 gap-6">
              ${this.renderInput('email', 'Public Email', 'email')}
              ${this.renderInput('phone', 'Public Phone', 'text')}
            </div>
            
            <div class="grid grid-cols-2 gap-6">
              ${this.renderInput('location', 'Location', 'text', 'Jakarta, Indonesia')}
              ${this.renderInput('website', 'Personal Website', 'url')}
            </div>

            <div class="mt-8 pt-8 border-t border-gray-200">
              <h3 class="text-md font-medium text-gray-900 mb-4">Resume / CV</h3>
              <div class="flex items-center gap-4">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Upload PDF Document</label>
                  <div class="flex items-center gap-3">
                    <input type="file" id="resume_upload" accept=".pdf" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer border border-gray-300 rounded-lg p-1">
                    <button id="btn-upload-resume" type="button" class="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap">Upload</button>
                  </div>
                  <p class="text-xs text-gray-500 mt-2">Max 10MB. PDF format only.</p>
                </div>
                ${this.settings.resume_url ? `
                  <div class="flex-shrink-0 flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <i data-lucide="check-circle" class="w-5 h-5 mr-2"></i> Resume Uploaded
                  </div>
                ` : ''}
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  renderSEOTab() {
    return `
      <div class="max-w-2xl space-y-8">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Search Engine Optimization</h2>
          <p class="text-sm text-gray-500 mb-6">Improve how your portfolio looks on Google and Social Media shares.</p>
          
          <div class="space-y-6">
            ${this.renderInput('seo_title', 'SEO Title', 'text')}
            ${this.renderTextarea('seo_description', 'SEO Description (Meta Description)', 3)}
            ${this.renderInput('keywords', 'Keywords (comma separated)', 'text', 'portfolio, developer, design')}
            
            <div class="grid grid-cols-2 gap-6">
              ${this.renderInput('author', 'Author', 'text')}
              ${this.renderInput('language', 'Language Code', 'text', 'en')}
            </div>

            <div class="mt-8 pt-8 border-t border-gray-200">
              <h3 class="text-md font-medium text-gray-900 mb-4">Social Sharing Images</h3>
              <div class="grid grid-cols-2 gap-6">
                ${this.renderImageUpload('og_image_url', 'Open Graph Image (Facebook/LinkedIn)', 'settings', 'w-full aspect-video rounded-lg object-cover')}
                ${this.renderImageUpload('twitter_image_url', 'Twitter Card Image', 'settings', 'w-full aspect-video rounded-lg object-cover')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderSocialTab() {
    return `
      <div class="max-w-2xl space-y-8">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Social Media Links</h2>
          <p class="text-sm text-gray-500 mb-6">URLs to your social media profiles.</p>
          
          <div class="space-y-6">
            ${this.renderInputGroup('github', 'GitHub URL', 'github')}
            ${this.renderInputGroup('linkedin', 'LinkedIn URL', 'linkedin')}
            ${this.renderInputGroup('instagram', 'Instagram URL', 'instagram')}
          </div>
        </div>
      </div>
    `;
  }

  renderSecurityTab() {
    return `
      <div class="max-w-2xl space-y-8">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Account Security</h2>
          <p class="text-sm text-gray-500 mb-6">Manage your authentication credentials.</p>
          
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-8">
            <div class="flex items-center gap-3 text-gray-700">
              <i data-lucide="mail" class="w-5 h-5"></i>
              <div>
                <p class="text-sm font-medium">Login Email</p>
                <p class="text-sm text-gray-500">${this.settings.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          <form id="form-password" class="space-y-6 border border-gray-200 rounded-xl p-6">
            <h3 class="text-md font-medium text-gray-900">Change Password</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" id="new_password" required minlength="6" class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input type="password" id="confirm_password" required minlength="6" class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border">
            </div>
            <button type="submit" id="btn-update-password" class="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Update Password
            </button>
          </form>

        </div>
      </div>
    `;
  }


  // ==========================================
  // UI HELPERS
  // ==========================================

  renderInput(id, label, type = 'text', placeholder = '') {
    const value = this.settings[id] || '';
    return `
      <div>
        <label for="${id}" class="block text-sm font-medium text-gray-700 mb-1">${label}</label>
        <input type="${type}" id="${id}" value="${value}" placeholder="${placeholder}" class="settings-input w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border">
      </div>
    `;
  }

  renderInputGroup(id, label, icon) {
    const value = this.settings[id] || '';
    return `
      <div>
        <label for="${id}" class="block text-sm font-medium text-gray-700 mb-1">${label}</label>
        <div class="relative rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <i data-lucide="${icon}" class="h-4 w-4 text-gray-400"></i>
          </div>
          <input type="url" id="${id}" value="${value}" class="settings-input block w-full rounded-lg border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 p-2 border" placeholder="https://...">
        </div>
      </div>
    `;
  }

  renderTextarea(id, label, rows = 3) {
    const value = this.settings[id] || '';
    return `
      <div>
        <label for="${id}" class="block text-sm font-medium text-gray-700 mb-1">${label}</label>
        <textarea id="${id}" rows="${rows}" class="settings-input w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border">${value}</textarea>
      </div>
    `;
  }

  renderImageUpload(fieldId, label, bucket, imageClasses = 'w-24 h-24 rounded-lg object-contain bg-gray-50 border border-gray-200') {
    const path = this.settings[fieldId];
    const previewUrl = storageService.getPublicUrl(bucket, path) || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ij48L2NpcmNsZT48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNiAxMCA1IDIxIj48L3BvbHlsaW5lPjwvc3ZnPg==';

    return `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">${label}</label>
        <div class="flex items-start gap-4">
          <img id="preview-${fieldId}" src="${previewUrl}" class="${imageClasses}">
          <div class="flex-1 space-y-2">
            <input type="file" id="file-${fieldId}" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer border border-gray-300 rounded-lg p-1">
            <button type="button" data-upload="${fieldId}" data-bucket="${bucket}" class="btn-upload px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Upload Image
            </button>
            <p class="text-xs text-gray-400">Max 5MB. JPG, PNG, WEBP.</p>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================

  attachEventListeners() {
    // Tab switching
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Optional: Check if dirty before switching
        if (this.isDirty && !confirm('You have unsaved changes. Change tab anyway?')) {
          return;
        }
        
        // Save current input states to this.settings before switching
        this.syncInputsToState();
        
        this.currentTab = e.currentTarget.dataset.tab;
        this.render();
      });
    });

    // Input changes (mark dirty)
    this.container.querySelectorAll('.settings-input').forEach(input => {
      input.addEventListener('input', () => {
        this.isDirty = true;
      });
      input.addEventListener('change', () => {
        this.isDirty = true;
      });
    });

    // Save Button
    const btnSave = $('#btn-save', this.container);
    if (btnSave) {
      btnSave.addEventListener('click', () => this.handleSave());
    }

    // Image Upload Buttons
    this.container.querySelectorAll('.btn-upload').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const fieldId = e.currentTarget.dataset.upload;
        const bucket = e.currentTarget.dataset.bucket;
        await this.handleImageUpload(fieldId, bucket, e.currentTarget);
      });
    });

    // Resume Upload Button
    const btnUploadResume = $('#btn-upload-resume', this.container);
    if (btnUploadResume) {
      btnUploadResume.addEventListener('click', async (e) => {
        await this.handleResumeUpload(e.currentTarget);
      });
    }

    // Password Form
    const pwdForm = $('#form-password', this.container);
    if (pwdForm) {
      pwdForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handlePasswordUpdate();
      });
    }
  }

  syncInputsToState() {
    this.container.querySelectorAll('.settings-input').forEach(input => {
      const id = input.id;
      if (input.type === 'checkbox') {
        this.settings[id] = input.checked;
      } else {
        this.settings[id] = input.value;
      }
    });
  }

  // ==========================================
  // ACTIONS
  // ==========================================

  async handleSave() {
    this.syncInputsToState();
    const btn = $('#btn-save', this.container);
    
    try {
      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Saving...';
      
      await settingsService.updateSettings(this.settings.id, this.settings);
      
      // Update tracking state
      this.originalSettings = JSON.parse(JSON.stringify(this.settings));
      this.isDirty = false;
      
      // Emit event so Navbar and public site knows things changed
      window.dispatchEvent(new CustomEvent('settings-updated', { detail: this.settings }));
      
      this.showToast('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Save failed:', error);
      this.showToast('Failed to save settings: ' + error.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Save Changes';
      if (window.lucide) window.lucide.createIcons();
    }
  }

  async handleImageUpload(fieldId, bucket, btnElement) {
    const fileInput = $(`#file-${fieldId}`, this.container);
    const file = fileInput.files[0];
    
    if (!file) {
      this.showToast('Please select a file first.', 'error');
      return;
    }

    const originalText = btnElement.innerText;
    
    try {
      btnElement.disabled = true;
      btnElement.innerText = 'Uploading...';
      
      // Upload via StorageService
      const path = await storageService.uploadFile(file, bucket);
      
      // Update state & UI
      this.settings[fieldId] = path;
      this.isDirty = true;
      
      const previewUrl = storageService.getPublicUrl(bucket, path);
      $(`#preview-${fieldId}`, this.container).src = previewUrl;
      
      this.showToast('Image uploaded successfully! Remember to Save Changes.', 'success');
      
      // If uploading avatar, we can emit early so navbar updates immediately for preview
      if (fieldId === 'avatar_url') {
          window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { path } }));
      }
      
    } catch (error) {
      this.showToast(error.message, 'error');
    } finally {
      btnElement.disabled = false;
      btnElement.innerText = originalText;
      fileInput.value = ''; // clear input
    }
  }

  async handleResumeUpload(btnElement) {
    const fileInput = $('#resume_upload', this.container);
    const file = fileInput.files[0];
    
    if (!file) {
      this.showToast('Please select a PDF file first.', 'error');
      return;
    }

    const originalText = btnElement.innerText;
    
    try {
      btnElement.disabled = true;
      btnElement.innerText = 'Uploading...';
      
      const path = await storageService.uploadFile(file, 'resume');
      
      this.settings.resume_url = path;
      this.isDirty = true;
      
      this.showToast('Resume uploaded! Remember to Save Changes.', 'success');
      // Re-render tab to show success badge
      this.render(); 
      
    } catch (error) {
      this.showToast(error.message, 'error');
    } finally {
      btnElement.disabled = false;
      btnElement.innerText = originalText;
    }
  }

  async handlePasswordUpdate() {
    const p1 = $('#new_password', this.container).value;
    const p2 = $('#confirm_password', this.container).value;
    
    if (p1 !== p2) {
      this.showToast('Passwords do not match.', 'error');
      return;
    }
    
    const btn = $('#btn-update-password', this.container);
    const originalText = btn.innerText;
    
    try {
      btn.disabled = true;
      btn.innerText = 'Updating...';
      
      await settingsService.updatePassword(p1);
      
      this.showToast('Password updated successfully.', 'success');
      $('#new_password', this.container).value = '';
      $('#confirm_password', this.container).value = '';
    } catch (error) {
      this.showToast(error.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerText = originalText;
    }
  }

  showToast(message, type = 'success') {
    const container = $('#toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    
    toast.className = `flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${bgColor} transform transition-all duration-300 translate-y-full opacity-0`;
    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-5 h-5"></i>
      <span class="text-sm font-medium">${message}</span>
    `;
    
    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons({ root: toast });
    
    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-full', 'opacity-0');
    });
    
    // Remove after 3s
    setTimeout(() => {
      toast.classList.add('translate-y-full', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}
