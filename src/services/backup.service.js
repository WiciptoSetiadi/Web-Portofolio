import { supabase } from '../config/supabase.js';

class BackupService {
  /**
   * Export all data to JSON
   */
  async exportData() {
    const tables = [
      'site_settings', 
      'section_content',
      'categories', 
      'projects', 
      'skills', 
      'experience', 
      'education', 
      'certificates', 
      'achievements', 
      'gallery'
    ];
    
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: {}
    };

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.error(`Error exporting ${table}:`, error);
        continue;
      }
      exportData.data[table] = data;
    }

    return exportData;
  }

  /**
   * Trigger download of JSON backup
   */
  downloadBackup(exportData) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}

export const backupService = new BackupService();
