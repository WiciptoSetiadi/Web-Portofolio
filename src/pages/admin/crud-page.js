import { CrudManager } from '../../components/admin/CrudManager.js';

export class CrudPage {
  constructor(entityType) {
    this.config = this.getConfigFor(entityType);
    this.manager = new CrudManager(this.config);
  }

  mount(containerId) {
    this.manager.mount(containerId);
  }

  unmount() {
    if (this.manager && this.manager.unmount) {
      this.manager.unmount();
    }
  }

  getConfigFor(type) {
    const statusOptions = [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' }
    ];

    switch (type) {
      case 'projects':
        return {
          tableName: 'projects',
          title: 'Manage Projects',
          singular: 'Project',
          columns: [
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category' },
            { key: 'status', label: 'Status', format: (v) => `<span class="badge badge-${v}">${v}</span>` }
          ],
          fields: [
            { name: 'title', label: 'Project Title', type: 'text', required: true },
            { name: 'slug', label: 'Slug (URL friendly)', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'text' },
            { name: 'short_description', label: 'Short Description', type: 'textarea', required: true },
            { name: 'image_url', label: 'Image / Document', type: 'file', bucket: 'projects' },
            { name: 'live_url', label: 'Live URL', type: 'text' },
            { name: 'github_url', label: 'GitHub URL', type: 'text' },
            { name: 'tech_stack', label: 'Tech Stack (comma separated)', type: 'array' },
            { name: 'status', label: 'Status', type: 'select', options: statusOptions, required: true },
            { name: 'sort_order', label: 'Sort Order', type: 'number' }
          ]
        };
      
      case 'skills':
        return {
          tableName: 'skills',
          title: 'Manage Skills',
          singular: 'Skill',
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'category', label: 'Category' },
            { key: 'proficiency', label: 'Proficiency', format: (v) => v ? `${v}%` : '-' },
            { key: 'status', label: 'Status', format: (v) => `<span class="badge badge-${v}">${v}</span>` }
          ],
          fields: [
            { name: 'name', label: 'Skill Name', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'text' },
            { name: 'icon_name', label: 'Lucide Icon Name', type: 'text' },
            { name: 'proficiency', label: 'Proficiency (0-100)', type: 'number' },
            { name: 'status', label: 'Status', type: 'select', options: statusOptions, required: true },
            { name: 'sort_order', label: 'Sort Order', type: 'number' }
          ]
        };

      case 'experience':
        return {
          tableName: 'experience',
          title: 'Manage Experience',
          singular: 'Experience',
          columns: [
            { key: 'company', label: 'Company' },
            { key: 'position', label: 'Position' },
            { key: 'status', label: 'Status', format: (v) => `<span class="badge badge-${v}">${v}</span>` }
          ],
          fields: [
            { name: 'company', label: 'Company Name', type: 'text', required: true },
            { name: 'position', label: 'Position Title', type: 'text', required: true },
            { name: 'logo_url', label: 'Logo Perusahaan / Organisasi', type: 'file', bucket: 'experience' },
            { name: 'doc_url', label: 'Foto/Gambar Dokumentasi Kegiatan', type: 'file', bucket: 'experience' },
            { name: 'start_date', label: 'Start Date', type: 'date', required: true },
            { name: 'end_date', label: 'End Date', type: 'date' },
            { name: 'is_current', label: 'Current Job', type: 'checkbox' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'tags', label: 'Tags (comma separated)', type: 'array' },
            { name: 'status', label: 'Status', type: 'select', options: statusOptions, required: true },
            { name: 'sort_order', label: 'Sort Order', type: 'number' }
          ]
        };

      case 'certificates':
        return {
          tableName: 'certificates',
          title: 'Manage Certificates',
          singular: 'Certificate',
          columns: [
            { key: 'name', label: 'Activity Name' },
            { key: 'issuer', label: 'Issuer' },
            { key: 'status', label: 'Status', format: (v) => `<span class="badge badge-${v}">${v}</span>` }
          ],
          fields: [
            { name: 'name', label: 'Nama Kegiatan (Indo/Eng)', type: 'text', required: true },
            { name: 'issuer', label: 'Penyelenggara', type: 'text', required: true },
            { name: 'category', label: 'Jenis Kegiatan (e.g. Nasional, Internasional)', type: 'text' },
            { name: 'tags', label: 'Keikutsertaan (e.g. Peserta, Pemateri) [Comma separated]', type: 'array' },
            { name: 'image_url', label: 'Bukti Sertifikat / Document', type: 'file', bucket: 'certificates' },
            { name: 'credential_url', label: 'Link Referensi (Optional)', type: 'text' },
            { name: 'issue_date', label: 'Waktu Pelaksanaan / Date', type: 'date', required: true },
            { name: 'status', label: 'Status', type: 'select', options: statusOptions, required: true },
            { name: 'sort_order', label: 'Sort Order', type: 'number' }
          ]
        };

      // Add others (education) here as needed
      default:
        throw new Error(`Unknown entity type: ${type}`);
    }
  }
}
