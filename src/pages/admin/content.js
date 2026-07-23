import { contentService } from '../../services/content.service.js';
import { SECTION_KEYS } from '../../config/constants.js';
import { $ } from '../../utils/dom.js';

export class ContentManagerPage {
  constructor() {
    this.sections = [];
    this.currentSection = null;
  }

  async render() {
    return `
      <div class="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        <!-- Sidebar: List of Sections -->
        <div class="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
          <div class="p-4 border-b border-gray-200 bg-white">
            <h3 class="font-bold text-gray-800">Page Sections</h3>
            <p class="text-xs text-gray-500 mt-1">Select a section to edit its content.</p>
          </div>
          <div id="section-list" class="flex-1 overflow-y-auto p-2 space-y-1">
            <div class="text-center p-4"><i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto text-primary-500"></i></div>
          </div>
        </div>
        
        <!-- Main: JSON Editor Form -->
        <div class="w-2/3 flex flex-col relative bg-white">
          <div id="editor-header" class="p-6 border-b border-gray-200 flex justify-between items-center bg-white hidden">
            <div>
              <h2 id="editor-title" class="text-xl font-bold text-gray-900">Edit Section</h2>
              <p id="editor-key" class="text-sm text-gray-500 font-mono mt-1"></p>
            </div>
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input type="checkbox" id="toggle-visible" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
                Visible to Public
              </label>
            </div>
          </div>
          
          <div id="editor-body" class="flex-1 overflow-y-auto p-6 hidden">
            <!-- Dynamic Form generated based on JSON content -->
            <form id="content-form" class="space-y-6">
              
              <div class="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
                 <p class="text-sm text-blue-800"><strong>Note:</strong> Since content structures vary greatly, edit the raw JSON below or use the parsed fields. Be careful not to break the JSON syntax.</p>
              </div>

              <!-- Standard Fields -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                    <input type="text" id="sec-title" name="title" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                    <input type="text" id="sec-subtitle" name="subtitle" class="input-field">
                </div>
              </div>

              <!-- Raw JSON Field -->
              <div>
                 <label class="block text-sm font-medium text-gray-700 mb-1">Content Config (JSON)</label>
                 <textarea id="sec-content-json" rows="15" class="input-field font-mono text-sm leading-relaxed whitespace-pre"></textarea>
                 <p class="text-xs text-red-500 mt-1 hidden" id="json-error">Invalid JSON format.</p>
              </div>

            </form>
          </div>
          
          <div id="editor-footer" class="p-4 border-t border-gray-200 bg-gray-50 flex justify-end hidden">
             <button id="btn-save-content" class="btn btn-primary">Save Changes</button>
          </div>

          <div id="empty-state" class="absolute inset-0 flex items-center justify-center text-gray-400 bg-white">
            <div class="text-center">
               <i data-lucide="mouse-pointer-click" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
               <p>Select a section from the left sidebar to edit</p>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  async mount(containerId) {
    const container = $(containerId);
    if (!container) return;
    
    container.innerHTML = await this.render();
    this.container = container;
    
    await this.loadSections();
    this.attachListeners();
    if (window.lucide) window.lucide.createIcons();
  }

  async loadSections() {
    try {
      this.sections = await contentService.getAdminSections();
      this.renderSidebar();
    } catch (e) {
      console.error('Failed to load sections:', e);
      $('#section-list', this.container).innerHTML = '<div class="p-4 text-red-500 text-sm">Failed to load sections. Ensure database is seeded.</div>';
    }
  }

  renderSidebar() {
    const list = $('#section-list', this.container);
    
    if (this.sections.length === 0) {
      list.innerHTML = '<div class="p-4 text-gray-500 text-sm">No sections found.</div>';
      return;
    }

    list.innerHTML = this.sections.map(sec => `
      <button class="section-item w-full text-left p-3 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors ${this.currentSection?.id === sec.id ? 'bg-primary-50 border border-primary-100 text-primary-700' : 'text-gray-700'}" data-id="${sec.id}">
        <span class="font-medium text-sm capitalize">${sec.section_key.replace('_', ' ')}</span>
        ${sec.is_visible 
          ? '<i data-lucide="eye" class="w-4 h-4 text-green-500"></i>' 
          : '<i data-lucide="eye-off" class="w-4 h-4 text-gray-400"></i>'}
      </button>
    `).join('');
    
    if (window.lucide) window.lucide.createIcons();

    // Attach click events
    list.querySelectorAll('.section-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        this.selectSection(id);
        
        // Update active class
        list.querySelectorAll('.section-item').forEach(b => b.className = "section-item w-full text-left p-3 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors text-gray-700");
        btn.className = "section-item w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors bg-primary-50 border border-primary-100 text-primary-700";
      });
    });
  }

  selectSection(id) {
    this.currentSection = this.sections.find(s => s.id === id);
    if (!this.currentSection) return;

    // Hide empty state, show editor
    $('#empty-state', this.container).classList.add('hidden');
    $('#editor-header', this.container).classList.remove('hidden');
    $('#editor-body', this.container).classList.remove('hidden');
    $('#editor-footer', this.container).classList.remove('hidden');

    // Populate data
    $('#editor-title', this.container).textContent = `Edit ${this.currentSection.section_key}`;
    $('#editor-key', this.container).textContent = `Key: ${this.currentSection.section_key}`;
    $('#toggle-visible', this.container).checked = this.currentSection.is_visible;
    
    $('#sec-title', this.container).value = this.currentSection.title || '';
    $('#sec-subtitle', this.container).value = this.currentSection.subtitle || '';
    
    // Format JSON nicely
    $('#sec-content-json', this.container).value = JSON.stringify(this.currentSection.content, null, 2);
    $('#json-error', this.container).classList.add('hidden');
  }

  attachListeners() {
    const btnSave = $('#btn-save-content', this.container);
    
    btnSave.addEventListener('click', async () => {
      if (!this.currentSection) return;
      
      const jsonStr = $('#sec-content-json', this.container).value;
      let parsedJson = {};
      
      try {
        parsedJson = JSON.parse(jsonStr);
        $('#json-error', this.container).classList.add('hidden');
      } catch (e) {
        $('#json-error', this.container).classList.remove('hidden');
        return; // Stop save if invalid JSON
      }

      const updateData = {
        title: $('#sec-title', this.container).value,
        subtitle: $('#sec-subtitle', this.container).value,
        is_visible: $('#toggle-visible', this.container).checked,
        content: parsedJson
      };

      try {
        btnSave.textContent = 'Saving...';
        btnSave.disabled = true;

        await contentService.updateSection(this.currentSection.section_key, updateData);
        
        // Reload to get fresh data and re-render sidebar (visibility icon might change)
        await this.loadSections();
        
        // Keep current section selected
        if (this.currentSection) {
            this.selectSection(this.currentSection.id);
            // Re-apply active class
            const list = $('#section-list', this.container);
            const btn = list.querySelector(`.section-item[data-id="${this.currentSection.id}"]`);
            if (btn) btn.className = "section-item w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors bg-primary-50 border border-primary-100 text-primary-700";
        }
        
      } catch (e) {
        console.error('Failed to save section', e);
        alert('Failed to save changes.');
      } finally {
        btnSave.textContent = 'Save Changes';
        btnSave.disabled = false;
      }
    });
  }
}
