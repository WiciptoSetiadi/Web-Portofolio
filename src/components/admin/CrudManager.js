import { CrudService } from '../../services/crud.service.js';
import { storageService } from '../../services/storage.service.js';
import { $ } from '../../utils/dom.js';

export class CrudManager {
  constructor(config) {
    this.config = config;
    this.service = new CrudService(config.tableName);
    this.data = [];
    this.isEditing = false;
    this.currentEditId = null;
    this.isMounted = false;
  }

  unmount() {
    this.isMounted = false;
  }

  async mount(containerId) {
    this.isMounted = true;
    this.container = $(containerId);
    if (!this.container) return;
    
    this.renderLayout();
    await this.loadData();
    
    if (!this.isMounted) return; // Prevent race conditions
    
    this.attachListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">${this.config.title}</h2>
        <button id="btn-add-new" class="btn btn-primary btn-sm flex items-center gap-2">
          <i data-lucide="plus" class="w-4 h-4"></i> Add New
        </button>
      </div>
      
      <!-- Table View -->
      <div id="table-view" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 data-table">
            <thead>
              <tr>
                ${this.config.columns.map(col => `<th>${col.label}</th>`).join('')}
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="table-body" class="bg-white divide-y divide-gray-200">
              <tr><td colspan="${this.config.columns.length + 1}" class="text-center py-8"><i data-lucide="loader-2" class="w-6 h-6 animate-spin mx-auto text-primary-500"></i></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Form View (Modal/Overlay) -->
      <div id="form-overlay" class="fixed inset-0 bg-gray-900/50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 id="form-title" class="text-lg font-bold">Add ${this.config.singular}</h3>
            <button id="btn-close-form" class="text-gray-400 hover:text-gray-600"><i data-lucide="x" class="w-5 h-5"></i></button>
          </div>
          <div class="p-6 overflow-y-auto flex-1">
            <form id="crud-form" class="space-y-4">
              ${this.renderFormFields()}
              <div class="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" id="btn-cancel-form" class="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" id="btn-save-form" class="btn btn-primary">Save ${this.config.singular}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    
    if (window.lucide) window.lucide.createIcons();
  }

  renderFormFields() {
    return this.config.fields.map(field => {
      let inputHtml = '';
      if (field.type === 'textarea') {
        inputHtml = `<textarea id="field-${field.name}" name="${field.name}" rows="4" class="input-field" ${field.required ? 'required' : ''}></textarea>`;
      } else if (field.type === 'select') {
        inputHtml = `
          <select id="field-${field.name}" name="${field.name}" class="input-field" ${field.required ? 'required' : ''}>
            ${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
          </select>
        `;
      } else if (field.type === 'checkbox') {
        inputHtml = `<input type="checkbox" id="field-${field.name}" name="${field.name}" class="w-4 h-4 text-primary-600 rounded border-gray-300">`;
      } else if (field.type === 'file') {
        inputHtml = `
          <div class="flex items-center gap-3">
            <input type="text" id="field-${field.name}" name="${field.name}" class="input-field flex-1" placeholder="URL or upload a file" ${field.required ? 'required' : ''}>
            <input type="file" id="file-${field.name}" class="hidden" accept="${field.accept || '*/*'}">
            <button type="button" class="btn border border-gray-300 bg-white hover:bg-gray-50 btn-upload" data-target="${field.name}" data-bucket="${field.bucket || 'gallery'}">
              <i data-lucide="upload" class="w-4 h-4"></i>
            </button>
          </div>
          <div id="upload-status-${field.name}" class="text-xs mt-1 text-slate-500 hidden"></div>
          <div id="preview-${field.name}" class="mt-2 hidden border border-gray-200 rounded-lg p-2 bg-gray-50 flex items-center gap-3"></div>
        `;
      } else {
        inputHtml = `<input type="${field.type || 'text'}" id="field-${field.name}" name="${field.name}" class="input-field" ${field.required ? 'required' : ''}>`;
      }
      
      return `
        <div class="${field.type === 'checkbox' ? 'flex items-center gap-2' : ''}">
          <label for="field-${field.name}" class="block text-sm font-medium text-gray-700 mb-1 ${field.type === 'checkbox' ? 'order-last mb-0' : ''}">
            ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
          </label>
          ${inputHtml}
        </div>
      `;
    }).join('');
  }

  async loadData() {
    try {
      this.data = await this.service.getAll({ orderBy: 'created_at', ascending: false });
      this.renderTableBody();
    } catch (e) {
      console.error('Failed to load data:', e);
      $('#table-body', this.container).innerHTML = `<tr><td colspan="${this.config.columns.length + 1}" class="text-center py-4 text-red-500">Failed to load data.</td></tr>`;
    }
  }

  renderTableBody() {
    const tbody = $('#table-body', this.container);
    if (this.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${this.config.columns.length + 1}" class="text-center py-8 text-gray-500">No ${this.config.tableName} found.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.data.map((item, index) => {
      const cols = this.config.columns.map(col => {
        let val = item[col.key];
        if (col.format) val = col.format(val, item);
        return `<td>${val || '-'}</td>`;
      }).join('');
      
      return `
        <tr>
          ${cols}
          <td class="text-right space-x-2">
            <button class="text-primary-600 hover:text-primary-800 btn-edit" data-id="${item.id}"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
            <button class="text-red-600 hover:text-red-800 btn-delete" data-id="${item.id}"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </td>
        </tr>
      `;
    }).join('');
    
    if (window.lucide) window.lucide.createIcons();
    
    // Attach row events
    const editBtns = tbody.querySelectorAll('.btn-edit');
    const delBtns = tbody.querySelectorAll('.btn-delete');
    
    editBtns.forEach(btn => btn.addEventListener('click', (e) => this.openForm(btn.dataset.id)));
    delBtns.forEach(btn => btn.addEventListener('click', (e) => this.deleteItem(btn.dataset.id)));
  }

  attachListeners() {
    $('#btn-add-new', this.container).addEventListener('click', () => this.openForm());
    $('#btn-close-form', this.container).addEventListener('click', () => this.closeForm());
    $('#btn-cancel-form', this.container).addEventListener('click', () => this.closeForm());
    
    // File Upload Handlers
    const uploadBtns = this.container.querySelectorAll('.btn-upload');
    uploadBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetName = btn.dataset.target;
        const bucket = btn.dataset.bucket || 'gallery';
        const fileInput = $(`#file-${targetName}`, this.container);
        
        fileInput.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          
          const statusEl = $(`#upload-status-${targetName}`, this.container);
          statusEl.textContent = 'Uploading...';
          statusEl.classList.remove('hidden', 'text-red-500', 'text-green-500');
          statusEl.classList.add('text-slate-500');
          btn.disabled = true;
          
          try {
            const path = await storageService.uploadFile(file, bucket);
            const url = storageService.getPublicUrl(bucket, path);
            $(`#field-${targetName}`, this.container).value = url;
            this.updateFilePreview(targetName, url);
            
            statusEl.textContent = 'Upload successful!';
            statusEl.classList.replace('text-slate-500', 'text-green-500');
          } catch (err) {
            statusEl.textContent = `Error: ${err.message}`;
            statusEl.classList.replace('text-slate-500', 'text-red-500');
          } finally {
            btn.disabled = false;
            fileInput.value = ''; // reset
          }
        };
        
        fileInput.click();
      });
    });

    const form = $('#crud-form', this.container);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = {};
      
      this.config.fields.forEach(field => {
        if (field.type === 'checkbox') {
          data[field.name] = formData.has(field.name);
        } else if (field.type === 'array') {
          data[field.name] = formData.get(field.name).split(',').map(s => s.trim()).filter(Boolean);
        } else {
          data[field.name] = formData.get(field.name);
        }
      });
      
      // Basic validator integration here if needed
      
      try {
        const btn = $('#btn-save-form', this.container);
        btn.textContent = 'Saving...';
        btn.disabled = true;
        
        if (this.isEditing) {
          await this.service.update(this.currentEditId, data);
        } else {
          await this.service.create(data);
        }
        
        this.closeForm();
        await this.loadData();
      } catch (err) {
        console.error('Save failed', err);
        alert('Failed to save data. ' + err.message);
      } finally {
        const btn = $('#btn-save-form', this.container);
        btn.textContent = `Save ${this.config.singular}`;
        btn.disabled = false;
      }
    });

    // Listen to manual file path changes
    const fileFields = this.config.fields.filter(f => f.type === 'file');
    fileFields.forEach(field => {
      const textInput = $(`#field-${field.name}`, this.container);
      if (textInput) {
        const handler = () => this.updateFilePreview(field.name, textInput.value);
        textInput.addEventListener('input', handler);
        textInput.addEventListener('change', handler);
      }
    });
  }

  openForm(id = null) {
    this.isEditing = !!id;
    this.currentEditId = id;
    
    const form = $('#crud-form', this.container);
    form.reset();
    
    $('#form-title', this.container).textContent = id ? `Edit ${this.config.singular}` : `Add ${this.config.singular}`;
    
    if (id) {
      const item = this.data.find(d => d.id === id);
      if (item) {
        this.config.fields.forEach(field => {
          const el = $(`#field-${field.name}`, form);
          if (!el) return;
          
          if (field.type === 'checkbox') {
            el.checked = !!item[field.name];
          } else if (field.type === 'array') {
            el.value = (item[field.name] || []).join(', ');
          } else {
            el.value = item[field.name] || '';
            if (field.type === 'file') {
              this.updateFilePreview(field.name, item[field.name]);
            }
          }
        });
      }
    } else {
      // Clear file previews for Add New form
      const fileFields = this.config.fields.filter(f => f.type === 'file');
      fileFields.forEach(field => this.updateFilePreview(field.name, ''));
    }
    
    $('#form-overlay', this.container).classList.remove('hidden');
  }

  updateFilePreview(fieldName, url) {
    const previewContainer = $(`#preview-${fieldName}`, this.container);
    if (!previewContainer) return;

    if (!url) {
      previewContainer.innerHTML = '';
      previewContainer.classList.add('hidden');
      return;
    }

    const cleanUrl = url.trim();
    const isImage = /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(cleanUrl) || cleanUrl.startsWith('data:image/');
    const isPdf = /\.pdf(\?.*)?$/i.test(cleanUrl);

    let previewContent = '';
    if (isImage) {
      previewContent = `
        <img src="${cleanUrl}" class="w-20 h-20 object-contain rounded bg-white border border-gray-200" alt="Preview">
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-gray-700 truncate">${cleanUrl.split('/').pop().split('?')[0]}</p>
          <a href="${cleanUrl}" target="_blank" class="text-xs text-primary-600 hover:text-primary-800 hover:underline">View full image</a>
        </div>
      `;
    } else if (isPdf) {
      previewContent = `
        <div class="w-20 h-20 bg-red-50 text-red-500 rounded flex flex-col items-center justify-center border border-red-100 flex-shrink-0">
          <i data-lucide="file-text" class="w-10 h-10"></i>
          <span class="text-[10px] font-bold mt-1">PDF</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-gray-700 truncate">${cleanUrl.split('/').pop().split('?')[0]}</p>
          <a href="${cleanUrl}" target="_blank" class="text-xs text-primary-600 hover:text-primary-800 hover:underline">Open PDF Document</a>
        </div>
      `;
    } else {
      previewContent = `
        <div class="w-20 h-20 bg-gray-100 text-gray-500 rounded flex flex-col items-center justify-center border border-gray-200 flex-shrink-0">
          <i data-lucide="file" class="w-10 h-10"></i>
          <span class="text-[10px] font-bold mt-1">FILE</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-gray-700 truncate">${cleanUrl.split('/').pop().split('?')[0]}</p>
          <a href="${cleanUrl}" target="_blank" class="text-xs text-primary-600 hover:text-primary-800 hover:underline">Open File</a>
        </div>
      `;
    }

    // Add a remove button to clear the input
    previewContent += `
      <button type="button" class="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-100 btn-remove-file flex-shrink-0" data-target="${fieldName}">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    `;

    previewContainer.innerHTML = previewContent;
    previewContainer.classList.remove('hidden');

    if (window.lucide) window.lucide.createIcons({ root: previewContainer });

    // Attach listener for remove button
    const removeBtn = previewContainer.querySelector('.btn-remove-file');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        $(`#field-${fieldName}`, this.container).value = '';
        this.updateFilePreview(fieldName, '');
      });
    }
  }

  closeForm() {
    $('#form-overlay', this.container).classList.add('hidden');
    this.isEditing = false;
    this.currentEditId = null;
  }

  async deleteItem(id) {
    if (confirm(`Are you sure you want to delete this ${this.config.singular}?`)) {
      try {
        await this.service.delete(id);
        await this.loadData();
      } catch (err) {
        alert('Failed to delete.');
      }
    }
  }
}
